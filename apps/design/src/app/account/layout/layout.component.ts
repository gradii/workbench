import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ub-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <ub-header></ub-header>
      </nb-layout-header>
      <nb-layout-column>
        <ng-content></ng-content>
      </nb-layout-column>
    </nb-layout>
  `
})
export class LayoutComponent {
}
