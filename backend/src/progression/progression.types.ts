import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

export class RecordActivityInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  path!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label!: string;
}

export class RecordStudyTimeInput {
  @IsInt()
  @Min(0)
  @Max(1440)
  minutes!: number;
}

export class RecordExerciseAnswerInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  moduleName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  word!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  answer!: string;
}

export class DailyQuizAnswerInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  word!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  answer!: string;
}

export class CompleteDailyQuizInput {
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => DailyQuizAnswerInput)
  answers!: DailyQuizAnswerInput[];
}
