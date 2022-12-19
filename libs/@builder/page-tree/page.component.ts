import {
  ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import { BuilderSidebarService } from '@builder/builder-sidebar.service';
import { PopoverDirective } from '@gradii/triangle/popover';
import { PageFacade } from '@tools-state/page/page-facade.service';

import { Page, PageTreeNode, PageUpdate } from '@tools-state/page/page.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector       : 'ub-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./page.component.scss'],
  template       : `
    <tri-icon *ngIf="isInactiveSubPage" svgIcon="outline:enter" style="transform:rotateY(180deg)"
              class="inactive-icon"></tri-icon>
    <span class="page-name">{{ page.name }}</span>
    <div class="page-controls" *ngIf="active">
      <button triIconOnlyButton [ghost]="true"
              class="clear-icon"
              size="tiny"
              [triPopover]="ref"
              [triPopoverDisabled]="locked"
              #editTrigger="triPopover"
              triPopoverClass="page-update-popover"
              triPopoverTrigger="hint"
              (click)="$event.stopPropagation();">
        <ng-template #ref>
          <ub-page-update [page]="page" [pages]="availablePageParentList$|async"
                          (cancel)="editTrigger.hide()"
                          (update)="onUpdate($event)"></ub-page-update>
        </ng-template>
        <tri-icon svgIcon="outline:edit"></tri-icon>
      </button>

      <button *ngIf="canDuplicate" triIconOnlyButton [ghost]="true" class="clear-icon"
              size="tiny" (click)="onDuplicate($event)">
        <tri-icon svgIcon="outline:copy"></tri-icon>
      </button>

      <button *ngIf="canBeRemoved" triIconOnlyButton [ghost]="true" class="clear-icon" size="tiny"
              (click)="onRemove($event)">
        <tri-icon svgIcon="outline:trash"></tri-icon>
      </button>
    </div>
    <tri-icon *ngIf="locked" class="lock-icon" svgIcon="outline:lock"></tri-icon>
  `
})
export class PageComponent implements OnInit, OnDestroy {
  @Input() page: PageTreeNode;
  @Input() canBeRemoved: boolean;
  @Input() canDuplicate: boolean;

  @Input() @HostBinding('class.locked') locked: boolean;
  @Input() @HostBinding('class.active') active: boolean;

  @Output() remove    = new EventEmitter<void>();
  @Output() edit      = new EventEmitter<void>();
  @Output() select    = new EventEmitter<void>();
  @Output() duplicate = new EventEmitter<void>();

  @ViewChild('editTrigger', { read: PopoverDirective })
  editTrigger: PopoverDirective;

  readonly availablePageParentList$: Observable<Page[]> = this.pageFacade.availablePageParentList$;

  private destroy$ = new Subject<void>();

  get isInactiveSubPage() {
    return !this.active && this.page.parentPageId;
  }

  constructor(
    private pageFacade: PageFacade,
    private builderSidebarService: BuilderSidebarService
  ) {
  }


  @HostListener('click')
  onClick() {
    if (!this.locked) {
      this.select.next();
    }
  }

  onUpdate(pageUpdate: PageUpdate): void {
    this.pageFacade.updatePage(pageUpdate);
  }

  // onEdit(event: MouseEvent) {
  //   event.stopPropagation();
  //   // if (!this.locked) {
  //   //   // this.edit.next();
  //   //   // this.editTrigger.show()
  //   // }
  // }

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

  ngOnInit() {
    this.builderSidebarService.opened$.pipe(
      takeUntil(this.destroy$),
      tap((status) => {
        if (!status) {
          this.editTrigger?.hide();
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
