import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import type { AuthUser } from "../common/auth/auth-user";
import { CurrentUser } from "../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard";
import { apiResponse } from "../common/http/api-response";
import { ProgressionService } from "./progression.service";
import type {
  CompleteDailyQuizInput,
  RecordActivityInput,
  RecordExerciseAnswerInput,
  RecordStudyTimeInput,
} from "./progression.types";

@UseGuards(JwtAuthGuard)
@Controller("progression")
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Post("activity")
  async recordActivity(@CurrentUser() user: AuthUser, @Body() body: RecordActivityInput) {
    return apiResponse(await this.progressionService.recordActivity(user._id, body));
  }

  @Post("streak")
  async touchStreak(@CurrentUser() user: AuthUser) {
    return apiResponse(await this.progressionService.touchStreak(user._id));
  }

  @Post("study-time")
  async recordStudyTime(@CurrentUser() user: AuthUser, @Body() body: RecordStudyTimeInput) {
    return apiResponse(await this.progressionService.recordStudyTime(user._id, body));
  }

  @Post("lessons/:lessonId/complete")
  async completeLesson(@CurrentUser() user: AuthUser, @Param("lessonId") lessonId: string) {
    return apiResponse(await this.progressionService.completeLesson(user._id, lessonId));
  }

  @Post("exercises/answer")
  async submitExerciseAnswer(
    @CurrentUser() user: AuthUser,
    @Body() body: RecordExerciseAnswerInput,
  ) {
    return apiResponse(await this.progressionService.submitExerciseAnswer(user._id, body));
  }

  @Post("exercises/:moduleName/reset")
  async resetExerciseProgress(
    @CurrentUser() user: AuthUser,
    @Param("moduleName") moduleName: string,
  ) {
    return apiResponse(await this.progressionService.resetExerciseProgress(user._id, moduleName));
  }

  @Post("daily-quiz/complete")
  async completeDailyQuiz(@CurrentUser() user: AuthUser, @Body() body: CompleteDailyQuizInput) {
    return apiResponse(await this.progressionService.completeDailyQuiz(user._id, body));
  }
}
