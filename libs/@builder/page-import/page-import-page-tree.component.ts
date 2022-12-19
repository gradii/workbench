import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CheckablePage } from './page-check-helper.service';

@Component({
  selector       : 'ub-page-import-page-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./page-import-page-tree.component.scss'],
  template       : `
    <ul>
      <li *ngFor="let page of pages">
        <tri-checkbox [checked]="page.checked"
                      (checkedChange)="checkedChange.emit({ page: page, checked: $event })">
          {{ page.name }}
        </tri-checkbox>

        <ub-page-import-page-tree
          *ngIf="page.pageList.length"
          (checkedChange)="checkedChange.emit($event)"
          [pages]="page.pageList"
        >
        </ub-page-import-page-tree>
      </li>
    </ul>
  `
})
export class PageImportPageTreeComponent {
  @Input() pages: CheckablePage[];

  @Output() checkedChange: EventEmitter<{ page: CheckablePage; checked: boolean }> = new EventEmitter<{
    page: CheckablePage;
    checked: boolean;
  }>();
}
