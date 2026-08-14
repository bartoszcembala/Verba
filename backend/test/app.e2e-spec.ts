import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import type { AddressInfo } from "node:net";
import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import type { Sql } from "postgres";
import { AppModule } from "../src/app.module";
import { DB, POSTGRES_CLIENT } from "../src/storage/db/db.constants";
import type { Database } from "../src/storage/db/db.types";
import { dailyQuestProgress, learningModules, lessons, progress, users } from "../src/storage/schema";

type JsonRecord = Record<string, unknown>;

type ApiResult = {
  body: JsonRecord;
  headers: Headers;
  status: number;
};

const signupInput = {
  name: "E2E Learner",
  email: "learner@example.com",
  password: "strong-password",
  passwordConfirm: "strong-password",
};

let app: INestApplication;
let baseUrl: string;
let db: Database;
let postgresClient: Sql;

async function request(
  path: string,
  options: { body?: unknown; cookie?: string; method?: string } = {},
): Promise<ApiResult> {
  const headers = new Headers();
  if (options.body !== undefined) headers.set("content-type", "application/json");
  if (options.cookie) headers.set("cookie", options.cookie);

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  return {
    body: await response.json() as JsonRecord,
    headers: response.headers,
    status: response.status,
  };
}

function authCookie(response: ApiResult): string {
  const setCookie = response.headers.get("set-cookie");
  assert.ok(setCookie, "Expected the response to set an authentication cookie");
  return setCookie.split(";", 1)[0];
}

function responseData(response: ApiResult): JsonRecord {
  assert.equal(response.body.success, true);
  assert.ok(response.body.data && typeof response.body.data === "object");
  return response.body.data as JsonRecord;
}

async function signup(): Promise<{ cookie: string; user: JsonRecord }> {
  const response = await request("/api/users/signup", { method: "POST", body: signupInput });
  assert.equal(response.status, 201);
  const data = responseData(response);
  assert.ok(data.user && typeof data.user === "object");
  return { cookie: authCookie(response), user: data.user as JsonRecord };
}

before(async () => {
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL must point to the isolated E2E database");
  assert.equal(process.env.NODE_ENV, "test", "E2E tests must run with NODE_ENV=test");

  app = await NestFactory.create(AppModule, { logger: ["error"], rawBody: true });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  await app.listen(0, "127.0.0.1");

  const address = app.getHttpServer().address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
  db = app.get<Database>(DB);
  postgresClient = app.get<Sql>(POSTGRES_CLIENT);
});

beforeEach(async () => {
  await db.delete(dailyQuestProgress);
  await db.delete(progress);
  await db.delete(lessons);
  await db.delete(learningModules);
  await db.delete(users);
});

after(async () => {
  await app.close();
  await postgresClient.end({ timeout: 5 });
});

describe("authentication", () => {
  it("signs up, returns a safe user, and authenticates /users/me", async () => {
    const { cookie, user } = await signup();

    assert.equal(user.email, signupInput.email);
    assert.equal(user.premium, false);
    assert.equal("password" in user, false);
    assert.equal("passwordHash" in user, false);

    const current = await request("/api/users/me", { cookie });
    assert.equal(current.status, 200);
    assert.equal(responseData(current).email, signupInput.email);
  });

  it("rejects duplicate signup and invalid credentials", async () => {
    await signup();

    const duplicate = await request("/api/users/signup", {
      method: "POST",
      body: { ...signupInput, email: signupInput.email.toUpperCase() },
    });
    assert.equal(duplicate.status, 400);

    const invalidLogin = await request("/api/users/login", {
      method: "POST",
      body: { email: signupInput.email, password: "incorrect-password" },
    });
    assert.equal(invalidLogin.status, 401);
  });

  it("logs in with the correct password and clears the cookie on logout", async () => {
    await signup();

    const login = await request("/api/users/login", {
      method: "POST",
      body: { email: signupInput.email, password: signupInput.password },
    });
    assert.equal(login.status, 201);
    const cookie = authCookie(login);

    const logout = await request("/api/users/logout", { method: "POST", cookie });
    assert.equal(logout.status, 201);
    assert.match(logout.headers.get("set-cookie") ?? "", /jwt=;/);
    assert.match(logout.headers.get("set-cookie") ?? "", /Max-Age=0/i);
  });

  it("protects authenticated endpoints", async () => {
    const response = await request("/api/users/me");
    assert.equal(response.status, 401);
  });
});

describe("progression", () => {
  it("rejects progression mutations without authentication", async () => {
    const response = await request("/api/progression/streak", { method: "POST" });
    assert.equal(response.status, 401);
  });

  it("awards lesson XP and quest progress only once", async () => {
    const { cookie } = await signup();
    const [lesson] = await db.insert(lessons).values({
      title: "e2e-lesson",
      number: 1,
      displayTitle: "E2E Lesson",
      html: "<p>Test lesson</p>",
    }).returning();

    const first = await request(`/api/progression/lessons/${lesson.id}/complete`, {
      method: "POST",
      cookie,
    });
    assert.equal(first.status, 201);
    const firstUser = responseData(first);
    assert.equal(firstUser.exp, 30.3);
    assert.deepEqual(firstUser.finishedLessons, [lesson.id]);

    const second = await request(`/api/progression/lessons/${lesson.id}/complete`, {
      method: "POST",
      cookie,
    });
    assert.equal(second.status, 201);
    assert.equal(responseData(second).exp, 30.3);

    const quests = responseData(await request("/api/daily-quests/me", { cookie }));
    const lessonQuest = (quests.quests as JsonRecord[]).find((quest) => quest.key === "complete_lesson");
    assert.equal(lessonQuest?.progress, 1);
    assert.equal(lessonQuest?.completed, true);
  });

  it("validates exercise answers and awards each learned word only once", async () => {
    const { cookie } = await signup();
    await db.insert(learningModules).values({
      title: "e2e-module",
      displayName: "E2E Module",
      words: [["hola", "hello"]],
    });

    const incorrect = await request("/api/progression/exercises/answer", {
      method: "POST",
      cookie,
      body: { moduleName: "e2e-module", word: "hola", answer: "adios" },
    });
    assert.equal(incorrect.status, 400);

    const answer = { moduleName: "e2e-module", word: "hola", answer: "hola" };
    const first = await request("/api/progression/exercises/answer", {
      method: "POST",
      cookie,
      body: answer,
    });
    assert.equal(first.status, 201);
    assert.equal(responseData(first).exp, 10.1);

    const duplicate = await request("/api/progression/exercises/answer", {
      method: "POST",
      cookie,
      body: answer,
    });
    assert.equal(duplicate.status, 201);
    assert.equal(responseData(duplicate).exp, 10.1);

    const quests = responseData(await request("/api/daily-quests/me", { cookie }));
    const wordsQuest = (quests.quests as JsonRecord[]).find((quest) => quest.key === "learn_words");
    assert.equal(wordsQuest?.progress, 1);
  });

  it("accepts a passed daily quiz and prevents repeated XP", async () => {
    const { cookie } = await signup();
    const quizWords = ["uno", "dos", "tres", "cuatro", "cinco"];
    await db.insert(progress).values({
      userName: signupInput.email,
      moduleName: "quiz-module",
      learned: quizWords.map((word) => [word, `${word}-translation`]),
    });

    const answers = quizWords.map((word) => ({ word, answer: word }));
    const first = await request("/api/progression/daily-quiz/complete", {
      method: "POST",
      cookie,
      body: { answers },
    });
    assert.equal(first.status, 201);
    assert.equal(responseData(first).exp, 30.3);

    const duplicate = await request("/api/progression/daily-quiz/complete", {
      method: "POST",
      cookie,
      body: { answers },
    });
    assert.equal(duplicate.status, 201);
    assert.equal(responseData(duplicate).exp, 30.3);

    const quests = responseData(await request("/api/daily-quests/me", { cookie }));
    const quizQuest = (quests.quests as JsonRecord[]).find((quest) => quest.key === "daily_quiz");
    assert.equal(quizQuest?.progress, 1);
    assert.equal(quizQuest?.completed, true);
  });
});
