import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

import { PageTreeNode } from '@tools-state/page/page.model';

@Component({
  selector: 'ub-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page.component.scss'],
  template: `
    <bc-icon *ngIf="isInactiveSubPage" name="corner-down-right-outline" class="inactive-icon"></bc-icon>
    <span class="page-name">{{ page.name }}</span>
    <div class="page-controls" *ngIf="active">
      <button nbButton class="clear-icon" size="tiny" (click)="onEdit($event)">
        <bc-icon name="edit"></bc-icon>
      </button>

      <button *ngIf="canDuplicate" nbButton class="clear-icon" size="tiny" (click)="onDuplicate($event)">
        <bc-icon name="copy"></bc-icon>
      </button>

      <button *ngIf="canBeRemoved" nbButton class="clear-icon" size="tiny" (click)="onRemove($event)">
        <bc-icon name="trash-2"></bc-icon>
      </button>
    </div>
    <bc-icon *ngIf="locked" class="lock-icon" name="lock"></bc-icon>
  `
})
export class PageComponent {
  @Input() page: PageTreeNode;
  @Input() canBeRemoved: boolean;
  @Input() canDuplicate: boolean;

  @Input() @HostBinding('class.locked') locked: boolean;
  @Input() @HostBinding('class.active') active: boolean;

  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() duplicate = new EventEmitter();

  get isInactiveSubPage() {
    return !this.active && this.page.parentPageId;
  }

  @HostListener('click')
  onClick() {
    if (!this.locked) {
      this.select.next();
    }
  }

  onEdit(event: MouseEvent) {
    event.stopPropagation();
    if (!this.locked) {
      this.edit.next();
    }
  }

  onRemove(event: MouseEvent) {
    event.stopPropagation();
    if (!this.locked) {
      this.remove.next();
    }
  }

  onDuplicate(event: MouseEvent) {
    event.stopPropagation();
    if (!this.locked) {
      this.duplicate.next();
    }
  }
}
