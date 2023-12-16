import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ub-lesson-controller',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lesson-controller.component.html',
  styleUrls: ['./lesson-controller.component.scss']
})
export class LessonControllerComponent {
}
