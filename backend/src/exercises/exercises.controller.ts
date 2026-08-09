import { Body, Controller, Post } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import type { GenerateExerciseInput } from "./exercises.types";

@Controller("exercises")
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post("generate")
  generate(@Body() body: GenerateExerciseInput) {
    return this.exercisesService.generate(body);
  }
}
