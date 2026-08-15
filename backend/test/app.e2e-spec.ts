import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import type { AddressInfo } from "node:net";
import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { eq } from "drizzle-orm";
import type { Sql } from "postgres";
import { AppModule } from "../src/app.module";
import { createAppValidationPipe } from "../src/common/validation/app-validation.pipe";
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

async function signup(input = signupInput): Promise<{ cookie: string; user: JsonRecord }> {
  const response = await request("/api/users/signup", { method: "POST", body: input });
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
  app.useGlobalPipes(createAppValidationPipe());
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
    assert.equal(user.role, "user");
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

  it("rejects malformed and unknown authentication fields", async () => {
    const malformed = await request("/api/users/signup", {
      method: "POST",
      body: {
        ...signupInput,
        email: "not-an-email",
        password: "short",
        passwordConfirm: "short",
        role: "admin",
      },
    });
    assert.equal(malformed.status, 400);
    assert.equal((await db.select().from(users)).length, 0);
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

  it("stores friendships as user references and returns current profile data", async () => {
    const owner = await signup();
    const friend = await signup({
      name: "Second Learner",
      email: "friend@example.com",
      password: "strong-password",
      passwordConfirm: "strong-password",
    });

    const updated = await request("/api/users/me", {
      method: "PATCH",
      cookie: owner.cookie,
      body: { friends: [{ friendId: friend.user._id, name: "Forged Name", avatar: "5" }] },
    });
    assert.equal(updated.status, 200);
    assert.deepEqual(responseData(updated).friends, [{
      friendId: friend.user._id,
      name: "Second Learner",
      avatar: "1",
    }]);

    await request("/api/users/me", {
      method: "PATCH",
      cookie: friend.cookie,
      body: { name: "Renamed Friend", avatar: "3" },
    });
    const refreshed = responseData(await request("/api/users/me", { cookie: owner.cookie }));
    assert.deepEqual(refreshed.friends, [{
      friendId: friend.user._id,
      name: "Renamed Friend",
      avatar: "3",
    }]);

    const privilegeEscalation = await request("/api/users/me", {
      method: "PATCH",
      cookie: owner.cookie,
      body: { role: "admin", premium: true },
    });
    assert.equal(privilegeEscalation.status, 400);
  });
});

describe("progression", () => {
  it("rejects progression mutations without authentication", async () => {
    const response = await request("/api/progression/streak", { method: "POST" });
    assert.equal(response.status, 401);
  });

  it("rejects malformed progression payloads before service execution", async () => {
    const { cookie } = await signup();
    const wrongType = await request("/api/progression/study-time", {
      method: "POST",
      cookie,
      body: { minutes: "10" },
    });
    assert.equal(wrongType.status, 400);

    const unknownField = await request("/api/progression/activity", {
      method: "POST",
      cookie,
      body: { path: "/lesson", label: "Lesson", exp: 100000 },
    });
    assert.equal(unknownField.status, 400);
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

    const renamed = await request("/api/users/me", {
      method: "PATCH",
      cookie,
      body: { email: "renamed@example.com" },
    });
    assert.equal(renamed.status, 200);
    const progressResponse = await request("/api/progress/me", { cookie });
    assert.equal(progressResponse.status, 200);
    const progressRows = progressResponse.body.data as JsonRecord[];
    assert.equal(progressRows[0]?.userName, "renamed@example.com");
    assert.equal(progressRows[0]?.moduleName, "e2e-module");

    const quests = responseData(await request("/api/daily-quests/me", { cookie }));
    const wordsQuest = (quests.quests as JsonRecord[]).find((quest) => quest.key === "learn_words");
    assert.equal(wordsQuest?.progress, 1);
  });

  it("accepts a passed daily quiz and prevents repeated XP", async () => {
    const { cookie, user } = await signup();
    const quizWords = ["uno", "dos", "tres", "cuatro", "cinco"];
    const [learningModule] = await db.insert(learningModules).values({
      title: "quiz-module",
      displayName: "Quiz Module",
      words: quizWords.map((word) => [word, `${word}-translation`]),
    }).returning();
    await db.insert(progress).values({
      userId: user._id as string,
      learningModuleId: learningModule.id,
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

  it("allows only administrators to manage modules and lessons", async () => {
    const { cookie, user } = await signup();
    const moduleInput = {
      title: "related-module",
      displayName: "Related Module",
      words: [],
    };

    const unauthenticated = await request("/api/modules", {
      method: "POST",
      body: moduleInput,
    });
    assert.equal(unauthenticated.status, 401);

    const forbidden = await request("/api/modules", {
      method: "POST",
      cookie,
      body: moduleInput,
    });
    assert.equal(forbidden.status, 403);

    await db.update(users).set({ role: "admin" }).where(eq(users.id, user._id as string));
    const malformedModule = await request("/api/modules", {
      method: "POST",
      cookie,
      body: { ...moduleInput, words: [["missing-translation"]] },
    });
    assert.equal(malformedModule.status, 400);

    const createdModule = await request("/api/modules", {
      method: "POST",
      cookie,
      body: moduleInput,
    });
    assert.equal(createdModule.status, 201);
    const module = (responseData(createdModule).module as JsonRecord);

    const updatedModule = await request(`/api/modules/${module._id as string}`, {
      method: "PATCH",
      cookie,
      body: { displayName: "Updated Related Module" },
    });
    assert.equal(updatedModule.status, 200);

    const created = await request("/api/lesson", {
      method: "POST",
      cookie,
      body: {
        title: "related-lesson",
        number: 2,
        displayTitle: "Related Lesson",
        html: "<p>Relationship test</p>",
        relatedExercises: ["related-module"],
      },
    });
    assert.equal(created.status, 201);
    const lesson = responseData(created).lesson as JsonRecord;

    const updatedLesson = await request(`/api/lesson/${lesson._id as string}`, {
      method: "PATCH",
      cookie,
      body: { displayTitle: "Updated Lesson", relatedExercises: ["related-module"] },
    });
    assert.equal(updatedLesson.status, 200);
    assert.equal(responseData(updatedLesson).displayTitle, "Updated Lesson");

    const listed = await request("/api/lesson");
    assert.equal(listed.status, 200);
    const lessonRows = listed.body.data as JsonRecord[];
    assert.deepEqual(lessonRows[0]?.relatedExercises, ["related-module"]);

    const deletedLesson = await request(`/api/lesson/${lesson._id as string}`, {
      method: "DELETE",
      cookie,
    });
    assert.equal(deletedLesson.status, 200);

    const deletedModule = await request(`/api/modules/${module._id as string}`, {
      method: "DELETE",
      cookie,
    });
    assert.equal(deletedModule.status, 200);
  });
});
