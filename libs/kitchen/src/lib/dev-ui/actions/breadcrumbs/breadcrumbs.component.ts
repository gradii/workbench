import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FlourComponent } from '../../../model';

@Component({
  selector       : 'kitchen-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./breadcrumbs.component.scss', '../action-button.scss'],
  template       : `
    <div class="list" *ngIf="opened">
      <button
        *ngFor="let comp of componentList"
        triButton
        [kitchenBreadcrumbsHover]="comp"
        class="breadcrumb-item action-button clear-icon"
        size="xsmall"
        (click)="select(comp)"
      >
        {{ comp.component | kitchenComponentName }}
      </button>
    </div>
    <button
      triButton
      class="action-button clear-icon"
      [class.not-available]="componentList.length === 0"
      size="xsmall"
      (click)="toggle()"
    >
      {{ vc.component | kitchenComponentName }}
    </button>
  `
})
export class BreadcrumbsComponent {
  componentList: FlourComponent[] = [];
  vc: FlourComponent;
  opened                          = false;

  @Input()
  set virtualComponent(virtualComponent: FlourComponent) {
    this.componentList = this.buildList(virtualComponent);
    this.vc            = virtualComponent;
  }

  @Output()
  selectComponent: EventEmitter<FlourComponent> = new EventEmitter<FlourComponent>();

  toggle() {
    this.opened = !this.opened;
  }

  select(vc: FlourComponent) {
    if (this.vc.component.id !== vc.component.id) {
      this.selectComponent.emit(vc);
    }
  }

  private buildList(vc: FlourComponent): FlourComponent[] {
    const list: FlourComponent[]      = [];
    const parent: FlourComponent      = vc.parentComponent;
    const grandParent: FlourComponent = parent && parent.parentComponent;
    if (parent) {
      list.unshift(parent);
    }
    if (grandParent) {
      list.unshift(grandParent);
    }
    return list;
  }
}
