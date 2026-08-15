import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { ExercisesService } from "./exercises.service";
import { GenerateExerciseInput } from "./exercises.types";

@UseGuards(JwtAuthGuard)
@Controller("exercises")
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post("generate")
  generate(@Body() body: GenerateExerciseInput) {
    return this.exercisesService.generate(body);
  }
}
