import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { WorkflowStep, StepType } from '@common/public-api';
import { Subject } from 'rxjs';

import { stepInfo, StepInfoConfig } from '../workflow-info.model';

const duplicateStep = {
  title: 'Duplicate',
  icon : 'outline:copy'
};

const deleteStep = {
  title: 'Delete',
  icon : 'outline:trash'
};

@Component({
  selector       : 'ub-step-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['step-list-item.component.scss'],
  template       : `
    <ub-step-item [isActive]="selected" [stepItem]="stepInfo[step.type]"></ub-step-item>
    <ub-error-notification
      *ngIf="workflowId"
      [workflowId]="workflowId"
      [stepId]="step.id"
      [selected]="selected"
    ></ub-error-notification>
    <div class="more-vertical-button-wrapper" [class.with-min-width]="!menuItems.length">
      <button
        triButton
        ghost
        size="xsmall"
        *ngIf="menuItems.length"
        class="basic more-vertical-button"
        [triMenuTriggerFor]="context_menu"
      >
        <tri-icon svgIcon="workbench:more-vertical"></tri-icon>
      </button>
    </div>

    <ng-template #context_menu="triMenuPanel" triMenuPanel>
      <div class="workflow-context-menu" triMenu [triMenuPanel]="context_menu">
        <button class="example-menu-item"
                *ngFor="let it of menuItems"
                triMenuItem
                (triMenuItemTriggered)="onMenuItemClick(it)">
          >
          <tri-icon svgIcon="it.icon"></tri-icon>
          {{it.title}}
        </button>
      </div>
    </ng-template>
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

  @Output() delete: EventEmitter<string>    = new EventEmitter<string>();
  @Output() duplicate: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.selected')
  @Input()
  selected: boolean;

  menuItems: any[] = [];

  stepInfo: StepInfoConfig = stepInfo;

  get menuTag(): string {
    return `workflow-item-menu-${this.step.type}-${this.step.id}`;
  }

  private destroyed$: Subject<void> = new Subject<void>();

  constructor(/*private menuService: MenuService*/) {
  }

  ngOnInit() {
    // this.menuService
    //   .onItemClick()
    //   .pipe(
    //     filter(({ tag }) => tag === this.menuTag),
    //     takeUntil(this.destroyed$)
    //   )
    //   .subscribe((data: { item: { title: string } }) => {
    //     if (data.item.title === 'Duplicate' && this.step.type !== StepType.CONDITION) {
    //       this.duplicate.emit(this.step.id);
    //     }
    //     if (data.item.title === 'Delete') {
    //       this.delete.emit(this.step.id);
    //     }
    //   });
  }

  onMenuItemClick(item: any) {
    if (item.title === 'Duplicate' && this.step.type !== StepType.CONDITION) {
      this.duplicate.emit(this.step.id);
    }
    if (item.title === 'Delete') {
      this.delete.emit(this.step.id);
    }
  }

  actionClick(event: Event) {
    event.stopPropagation();
    // this.contextMenu.show();
  }
}
