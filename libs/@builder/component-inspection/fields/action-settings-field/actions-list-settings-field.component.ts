import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KitchenActions, TriggeredAction, WorkflowInfo } from '@common/public-api';
import { PuffComponent } from '@tools-state/component/component.model';

import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector       : 'ub-actions-list-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
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
  set component(component: PuffComponent) {
    this.component$.next(component);
  }

  get component(): PuffComponent {
    return this.component$.value;
  }

  @Input()
  set actions(value: KitchenActions) {
    // store original actions, used for generating output
    this.originalActions = value || {};
    // array of triggers, used for iteration
    this.triggers        = Object.keys(this.originalActions);
    // object with signature trigger: action, allows to avoid manipulation with array in template
    // and for easy accessing selected action,
    this.adaptedActions = {};
    for (const trigger of this.triggers) {
      const triggerActions         = this.originalActions[trigger];
      // none option is exist only in template of select, when none is selected it means empty array of actions for trigger
      this.adaptedActions[trigger] = triggerActions.length ? triggerActions[0] : { action: '', paramCode: '' };
    }
  }

  @Output() actionsChange: EventEmitter<KitchenActions> = new EventEmitter<KitchenActions>();

  triggers: string[] = [];
  component$         = new BehaviorSubject<PuffComponent>(null);
  adaptedActions: {
    [trigger: string]: TriggeredAction;
  };

  searchOptions$: Observable<any[]> = this.workflowFacade.workflowInfoList$.pipe(
    map((workflowList: WorkflowInfo[]) => {
      return workflowList.map(item => {
        const endIconData: Partial<any> = {};
        if (!item.assigned) {
          endIconData.endIcon        = 'action-isnt-assigned';
          endIconData.iconPack       = 'bakery';
          endIconData.endIconTooltip = 'Action is not assigned';
        }
        return {
          displayValue: item.name,
          id          : item.id,
          filterValues: [item.name],
          ...endIconData
        };
      });
    })
  );

  private originalActions: KitchenActions;

  constructor(private workflowFacade: WorkflowFacade, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  navigateToData(trigger: string) {
    this.router.navigate(['../data'], {
      relativeTo : this.activatedRoute.parent,
      queryParams: {
        newAction  : true,
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
