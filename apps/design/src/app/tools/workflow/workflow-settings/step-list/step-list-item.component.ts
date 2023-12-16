import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StepType, WorkflowStep } from '@common';
import { NbContextMenuDirective, NbMenuItem, NbMenuService } from '@nebular/theme';

import { stepInfo, StepInfoConfig } from '../workflow-info.model';

const duplicateStep = {
  title: 'Duplicate',
  icon: 'copy'
};

const deleteStep = {
  title: 'Delete',
  icon: 'trash-2'
};

@Component({
  selector: 'ub-step-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['step-list-item.component.scss'],
  template: `
    <ub-step-item [isActive]="selected" [stepItem]="stepInfo[step.type]"></ub-step-item>
    <ub-error-notification
      *ngIf="workflowId"
      [workflowId]="workflowId"
      [stepId]="step.id"
      [selected]="selected"
    ></ub-error-notification>
    <div class="more-vertical-button-wrapper" [class.with-min-width]="!menuItems.length">
      <button
        nbButton
        ghost
        size="tiny"
        *ngIf="menuItems.length"
        class="basic more-vertical-button"
        [nbContextMenu]="menuItems"
        [nbContextMenuTag]="menuTag"
        (click)="actionClick($event)"
        nbContextMenuClass="workflow-context-menu"
      >
        <bc-icon name="more-vertical"></bc-icon>
      </button>
    </div>
  `
})
export class StepListItemComponent implements OnInit {
  @Input() set contextMenuConfig(config: { isLastStep: boolean; isNested: boolean; isCondition: boolean }) {
    const items = [];
    if (!config.isCondition) {
      items.push(duplicateStep);
    }
    if (!config.isLastStep || config.isNested) {
      items.push(deleteStep);
    }

    this.menuItems = items;
  }

  @Input() step: WorkflowStep;
  @Input() workflowId: string;

  @ViewChild(NbContextMenuDirective) contextMenu: NbContextMenuDirective;

  @Output() delete: EventEmitter<string> = new EventEmitter<string>();
  @Output() duplicate: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.selected')
  @Input()
  selected: boolean;

  menuItems: NbMenuItem[] = [];

  stepInfo: StepInfoConfig = stepInfo;

  get menuTag(): string {
    return `workflow-item-menu-${this.step.type}-${this.step.id}`;
  }

  private destroyed$: Subject<void> = new Subject<void>();

  constructor(private nbMenuService: NbMenuService) {
  }

  ngOnInit() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === this.menuTag),
        takeUntil(this.destroyed$)
      )
      .subscribe((data: { item: { title: string } }) => {
        if (data.item.title === 'Duplicate' && this.step.type !== StepType.CONDITION) {
          this.duplicate.emit(this.step.id);
        }
        if (data.item.title === 'Delete') {
          this.delete.emit(this.step.id);
        }
      });
  }

  actionClick(event: Event) {
    event.stopPropagation();
    this.contextMenu.show();
  }
}
