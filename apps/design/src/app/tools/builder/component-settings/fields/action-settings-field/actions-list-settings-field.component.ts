import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BcInputSearchOption, OvenActions, TriggeredAction, WorkflowInfo } from '@common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { BakeryComponent } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-actions-list-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngFor="let trigger of triggers">
      <ub-action-input
        [triggerName]="trigger"
        [disabled]="false"
        [component]="component"
        [actionOptions]="searchOptions$ | async"
        (addNewAction)="navigateToData(trigger)"
        (actionsChange)="select(trigger, $event)"
      >
      </ub-action-input>
    </ng-container>
  `
})
export class ActionsListSettingsFieldComponent {
  @Input()
  set component(component: BakeryComponent) {
    this.component$.next(component);
  }

  get component(): BakeryComponent {
    return this.component$.value;
  }

  @Input()
  set actions(value: OvenActions) {
    // store original actions, used for generating output
    this.originalActions = value || {};
    // array of triggers, used for iteration
    this.triggers = Object.keys(this.originalActions);
    // object with signature trigger: action, allows to avoid manipulation with array in template
    // and for easy accessing selected action,
    this.adaptedActions = {};
    for (const trigger of this.triggers) {
      const triggerActions = this.originalActions[trigger];
      // none option is exist only in template of select, when none is selected it means empty array of actions for trigger
      this.adaptedActions[trigger] = triggerActions.length ? triggerActions[0] : { action: '', paramCode: '' };
    }
  }

  @Output() actionsChange: EventEmitter<OvenActions> = new EventEmitter<OvenActions>();

  triggers: string[] = [];
  component$ = new BehaviorSubject<BakeryComponent>(null);
  adaptedActions: {
    [trigger: string]: TriggeredAction;
  };

  searchOptions$: Observable<BcInputSearchOption[]> = this.workflowFacade.workflowInfoList$.pipe(
    map((workflowList: WorkflowInfo[]) => {
      return workflowList.map(item => {
        const endIconData: Partial<BcInputSearchOption> = {};
        if (!item.assigned) {
          endIconData.endIcon = 'action-isnt-assigned';
          endIconData.iconPack = 'bakery';
          endIconData.endIconTooltip = 'Action is not assigned';
        }
        return {
          displayValue: item.name,
          id: item.id,
          filterValues: [item.name],
          ...endIconData
        };
      });
    })
  );

  private originalActions: OvenActions;

  constructor(private workflowFacade: WorkflowFacade, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  navigateToData(trigger: string) {
    this.router.navigate(['../data'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        newAction: true,
        componentId: this.component$.getValue().id,
        trigger
      }
    });
  }

  select(trigger: string, action: TriggeredAction): void {
    const actionList: TriggeredAction[] = [];

    if (action !== null) {
      actionList.push(action);
    }

    this.actionsChange.emit({ [trigger]: actionList });
  }
}
