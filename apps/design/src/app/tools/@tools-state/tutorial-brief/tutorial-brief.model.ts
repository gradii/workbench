export interface TutorialBrief {
  id
  description
}

export interface Lesson {
  id
  type
  steps
  title
  trackInTourProgress
}

export interface Step {
  id
  showPrevButton
  validity
  actions
  showProgress
}

export interface StepAction {
  action
  projectSlotRequired?
  showWhenNoProjectSlots?
}

export interface LessonType {

}

export interface Tutorial {
  lessons
}
