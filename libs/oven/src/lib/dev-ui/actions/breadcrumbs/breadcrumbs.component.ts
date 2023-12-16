import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { VirtualComponent } from '../../../model';

@Component({
  selector: 'oven-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./breadcrumbs.component.scss', '../action-button.scss'],
  template: `
    <div class="list" *ngIf="opened">
      <button
        *ngFor="let comp of componentList"
        nbButton
        [ovenBreadcrumbsHover]="comp"
        class="breadcrumb-item action-button clear-icon"
        size="tiny"
        (click)="select(comp)"
      >
        {{ comp.component | ovenComponentName }}
      </button>
    </div>
    <button
      nbButton
      class="action-button clear-icon"
      [class.not-available]="componentList.length === 0"
      size="tiny"
      (click)="toggle()"
    >
      {{ vc.component | ovenComponentName }}
    </button>
  `
})
export class BreadcrumbsComponent {
  componentList: VirtualComponent[] = [];
  vc: VirtualComponent;
  opened = false;

  @Input() set virtualComponent(virtualComponent: VirtualComponent) {
    this.componentList = this.buildList(virtualComponent);
    this.vc = virtualComponent;
  }

  @Output() selectComponent: EventEmitter<VirtualComponent> = new EventEmitter<VirtualComponent>();

  toggle() {
    this.opened = !this.opened;
  }

  select(vc: VirtualComponent) {
    if (this.vc.component.id !== vc.component.id) {
      this.selectComponent.emit(vc);
    }
  }

  private buildList(vc: VirtualComponent): VirtualComponent[] {
    const list: VirtualComponent[] = [];
    const parent: VirtualComponent = vc.parentComponent;
    const grandParent: VirtualComponent = parent && parent.parentComponent;
    if (parent) {
      list.unshift(parent);
    }
    if (grandParent) {
      list.unshift(grandParent);
    }
    return list;
  }
}
