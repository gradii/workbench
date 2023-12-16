import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Lesson } from '@tools-state/tutorial-brief/tutorial-brief.model';

@Component({
  selector: 'ub-tour-progress',
  templateUrl: './tour-progress.component.html',
  styleUrls: ['./tour-progress.component.scss']
})
export class TourProgressComponent {
  @Input() lessons: Lesson[] = [];
  @Input() activeLessonIndex: number;
  @Input() progress = 0;

  @Output() skip = new EventEmitter();
}
