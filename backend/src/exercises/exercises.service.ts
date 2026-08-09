import { BadGatewayException, BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { GenerateExerciseInput, GeneratedExercise } from "./exercises.types";

type OpenAiResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

@Injectable()
export class ExercisesService {
  constructor(private readonly config: ConfigService) {}

  async generate(input: GenerateExerciseInput): Promise<GeneratedExercise> {
    if (!input.word || !input.translation) {
      throw new BadRequestException("Word and translation are required");
    }

    const apiKey = this.config.get<string>("OPENAI_API_KEY");
    if (!apiKey) throw new ServiceUnavailableException("Exercise generation is not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.get<string>("OPENAI_MODEL", "gpt-4o-mini"),
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return only a valid JSON object for a Spanish fill-in-the-blank exercise.",
          },
          {
            role: "user",
            content: `Create one Spanish present-tense fill-in-the-blank exercise. The required answer is "${input.word}" and its Polish translation is "${input.translation}". Return question, translation, correctAnswer, and four options as JSON.`,
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new BadGatewayException("OpenAI exercise generation failed");

    const payload = await response.json() as OpenAiResponse;
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new BadGatewayException("OpenAI returned an empty exercise");

    try {
      const exercise = JSON.parse(content) as Partial<GeneratedExercise>;
      if (
        typeof exercise.question !== "string" ||
        typeof exercise.translation !== "string" ||
        typeof exercise.correctAnswer !== "string" ||
        !Array.isArray(exercise.options) ||
        !exercise.options.every((option) => typeof option === "string")
      ) {
        throw new Error("Invalid exercise shape");
      }
      return exercise as GeneratedExercise;
    } catch {
      throw new BadGatewayException("OpenAI returned an invalid exercise");
    }
  }
}
