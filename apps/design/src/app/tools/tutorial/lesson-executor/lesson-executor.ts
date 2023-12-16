
export interface LessonProgress {
  done
  currentStep
}

export interface LessonExecutor {
  startLesson():void
  forceComplete():void
}
