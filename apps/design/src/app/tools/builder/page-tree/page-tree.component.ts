import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AclService } from '@common';

import { Page, PageTreeNode } from '@tools-state/page/page.model';

@Component({
  selector: 'ub-page-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page-tree.component.scss'],
  template: `
    <ul class="tree-list" [class.root]="isRoot">
      <li *ngFor="let page of pages">
        <ub-page
          [page]="page"
          [active]="isPageActive(page)"
          [canBeRemoved]="canRemovePages"
          [canDuplicate]="canDuplicatePage$ | async"
          [locked]="!(canOpenPage(page) | async)"
          (select)="select.emit(page.id)"
          (edit)="edit.emit(page.id)"
          (remove)="remove.emit(page.id)"
          (duplicate)="duplicate.emit(page.id)"
        >
        </ub-page>

        <ub-page-tree
          *ngIf="page.children.length"
          [pages]="page.children"
          [canRemovePages]="canRemovePages"
          (select)="select.emit($event)"
          (edit)="edit.emit($event)"
          (remove)="remove.emit($event)"
          (duplicate)="duplicate.emit($event)"
          [activePage]="activePage"
        >
        </ub-page-tree>
      </li>
    </ul>
  `
})
export class PageTreeComponent {
  @Input() pages: PageTreeNode[];
  @Input() activePage: Page;
  @Input() canRemovePages: boolean;
  @Input() isRoot: boolean;

  @Output() select = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();
  @Output() duplicate = new EventEmitter<string>();

  canDuplicatePage$: Observable<boolean> = this.acl.canCreatePage();

  constructor(private acl: AclService) {
  }

  isPageActive(page: Page): boolean {
    return page.id === this.activePage.id;
  }

  canOpenPage(page: Page): Observable<boolean> {
    return this.acl.canOpenPage(page.id);
  }
}
