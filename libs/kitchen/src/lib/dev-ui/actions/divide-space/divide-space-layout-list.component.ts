import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { DivideSpaceType } from '@common/public-api';

@Component({
  selector: 'kitchen-divide-space-layout-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./divide-space-layout-list.component.scss'],
  template: `
    <div class="title">DIVIDE SPACE</div>
    <div class="layout-container">
      <button
        *ngFor="let layout of layoutList"
        triButton
        variant="text"
        class="clear-icon"
        size="large"
        (click)="layoutClick.emit(layout.name)"
      >
        <tri-icon [svgIcon]="layout.icon"></tri-icon>
      </button>
    </div>
  `
})
export class DivideSpaceLayoutListComponent {
  @Output() layoutClick: EventEmitter<DivideSpaceType> = new EventEmitter<DivideSpaceType>();

  layoutList = [
    {
      icon: 'workbench:dev-ui-layout-smile-top',
      name: DivideSpaceType.COL_2_1
    },
    {
      icon: 'workbench:dev-ui-layout-smile-right',
      name: DivideSpaceType.ROW_1_2
    },
    {
      icon: 'workbench:dev-ui-layout-smile-bottom',
      name: DivideSpaceType.COL_1_2
    },
    {
      icon: 'workbench:dev-ui-layout-smile-left',
      name: DivideSpaceType.ROW_2_1
    },
    {
      icon: 'workbench:dev-ui-layout-or',
      name: DivideSpaceType.ROW_1_1
    },
    {
      icon: 'workbench:dev-ui-layout-equal',
      name: DivideSpaceType.COL_1_1
    },
    {
      icon: 'workbench:dev-ui-layout-squares',
      name: DivideSpaceType.ROW_2_2
    }
  ];
}
