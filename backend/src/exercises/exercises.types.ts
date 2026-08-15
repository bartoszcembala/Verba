import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class GenerateExerciseInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  word!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  translation!: string;
}

export type GeneratedExercise = {
  question: string;
  translation: string;
  correctAnswer: string;
  options: string[];
};
