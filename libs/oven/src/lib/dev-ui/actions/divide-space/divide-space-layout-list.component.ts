import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { DivideSpaceType } from '@common';

@Component({
  selector: 'oven-divide-space-layout-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./divide-space-layout-list.component.scss'],
  template: `
    <div class="title">DIVIDE SPACE</div>
    <div class="layout-container">
      <button
        *ngFor="let layout of layoutList"
        nbButton
        class="clear-icon"
        size="large"
        (click)="layoutClick.emit(layout.name)"
      >
        <bc-icon [name]="layout.icon"></bc-icon>
      </button>
    </div>
  `
})
export class DivideSpaceLayoutListComponent {
  @Output() layoutClick: EventEmitter<DivideSpaceType> = new EventEmitter<DivideSpaceType>();

  layoutList = [
    {
      icon: 'dev-ui-layout-smile-top',
      name: DivideSpaceType.COL_2_1
    },
    {
      icon: 'dev-ui-layout-smile-right',
      name: DivideSpaceType.ROW_1_2
    },
    {
      icon: 'dev-ui-layout-smile-bottom',
      name: DivideSpaceType.COL_1_2
    },
    {
      icon: 'dev-ui-layout-smile-left',
      name: DivideSpaceType.ROW_2_1
    },
    {
      icon: 'dev-ui-layout-or',
      name: DivideSpaceType.ROW_1_1
    },
    {
      icon: 'dev-ui-layout-equal',
      name: DivideSpaceType.COL_1_1
    },
    {
      icon: 'dev-ui-layout-squares',
      name: DivideSpaceType.ROW_2_2
    }
  ];
}
