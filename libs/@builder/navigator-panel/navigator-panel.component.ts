import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector       : 'ub-navigator-panel',
  styleUrls      : ['./navigator-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <pf-components-tree-panel></pf-components-tree-panel>
  `
})
export class NavigatorPanelComponent {
}
