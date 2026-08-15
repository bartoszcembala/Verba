import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { IsWordPairArray } from "../common/validation/is-word-pair-array";
import type { WordPair } from "../storage/schema";

export class CreateLearningModuleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  displayName!: string;

  @IsArray()
  @ArrayMaxSize(2000)
  @IsWordPairArray()
  words!: WordPair[];

  @IsOptional()
  @IsString()
  @MaxLength(40)
  level?: string | null;
}

export class UpdateLearningModuleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  displayName?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2000)
  @IsWordPairArray()
  words?: WordPair[];

  @IsOptional()
  @IsString()
  @MaxLength(40)
  level?: string | null;
}
