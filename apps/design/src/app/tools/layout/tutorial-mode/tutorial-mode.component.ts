import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ub-tutorial-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tutorial-mode.component.scss'],
  template: `
    <span>Tutorial mode</span>
    <div class="notification"></div>
  `
})
export class TutorialModeComponent {
}
