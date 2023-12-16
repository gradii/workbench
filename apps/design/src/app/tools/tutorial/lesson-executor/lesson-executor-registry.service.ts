import { Injectable } from '@angular/core';

import { LessonExecutor } from './lesson-executor';
import { LessonType } from '@tools-state/tutorial-brief/tutorial-brief.model';
import { StaticLessonExecutorService } from './static-lesson/static-lesson-executor.service';
import { DynamicLessonExecutorService } from './dynamic-lesson/dynamic-lesson-executor.service';

@Injectable()
export class LessonExecutorRegistryService {
  constructor(
    private staticLessonExecutor: StaticLessonExecutorService,
    private dynamicLessonExecutor: DynamicLessonExecutorService
  ) {
  }

  getLessonExecutor(lessonType: LessonType): LessonExecutor {
    if (lessonType === 'static') {
      return this.staticLessonExecutor;
    }

    return this.dynamicLessonExecutor;
  }
}
