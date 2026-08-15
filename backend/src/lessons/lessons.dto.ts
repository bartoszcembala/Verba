import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsInt()
  @Min(0)
  @Max(10000)
  number!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  displayTitle!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200000)
  html!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  relatedExercises?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(40)
  type?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  level?: string | null;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  number?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  displayTitle?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200000)
  html?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  relatedExercises?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(40)
  type?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  level?: string | null;
}
