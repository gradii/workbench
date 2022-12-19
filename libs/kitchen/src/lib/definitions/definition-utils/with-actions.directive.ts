import {
  Directive,
  ElementRef,
  Input,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDifferFactory,
  IterableDiffers,
  OnDestroy
} from '@angular/core';
import { KitchenActions, Workflow } from '@common/public-api';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';

import { RenderState } from '../../state/render-state.service';
import { GlobalStateService } from '../../workflow/global-state.service';
import { WorkflowExecutorService } from '../../workflow/workflow-executor.service';

@Directive({ selector: '[kitchenWithActions]' })
export class WithActionsDirective implements OnDestroy {
  @Input() set kitchenWithActions(actions: KitchenActions) {
    if (actions) {
      this.actions = actions;
      this.listenActions(actions);
    }
  }

  private actions: KitchenActions;
  // trigger name to unsubscribe map
  private triggerUnlisteners = new Map<string, () => void>();
  private triggerDiffer: IterableDiffer<string>;
  // accept eventType and callback function
  // returns unsubscribe function
  private subscribeToTrigger: (trigger: string, callback: (value: any) => void) => () => void;
  // fire triggers only in preview mode
  private enabled = false;
  private disabled$: Observable<boolean>;
  private destroyed$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private globalStore: GlobalStateService,
    private renderState: RenderState,
    private workflowExecutor: WorkflowExecutorService,
    differs: IterableDiffers
  ) {
    const differFactory: IterableDifferFactory = differs.find([]);
    this.triggerDiffer = differFactory.create((index: number, trigger: string) => trigger);
    this.disabled$ = this.renderState.showDevUI$;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.unlistenAll();
  }

  listen(subscribeToTrigger: (trigger: string, callback: (value: any) => void) => () => void) {
    this.subscribeToTrigger = subscribeToTrigger;

    this.renderState.showDevUI$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((disabled: boolean) => (this.enabled = !disabled));
  }

  private listenActions(actions: KitchenActions) {
    const triggers = Object.keys(actions)
      // if trigger doesn't have actions it means that no listener should be attached for that trigger
      .filter((trigger: string) => actions[trigger].length);
    const changes: IterableChanges<string> = this.triggerDiffer.diff(triggers);
    if (changes) {
      this.updateTriggerListeners(changes);
    }
  }

  private updateTriggerListeners(changes: IterableChanges<string>) {
    changes.forEachOperation(
      (change: IterableChangeRecord<string>, previousIndex: number | null, currentIndex: number | null) => {
        const trigger: string = change.item;
        if (previousIndex === null) {
          this.listenTrigger(trigger);
        } else if (currentIndex === null) {
          this.unlistenTrigger(trigger);
        }
      }
    );
  }

  private listenTrigger(trigger: string) {
    let unlisten: () => void;
    const callback: (value: any) => void = event => {
      if (this.enabled) {
        this.executeActions(trigger, event);
      }
    };
    if (trigger === 'init') {
      unlisten = this.listenOnInit(callback);
    } else {
      unlisten = this.subscribeToTrigger(trigger, callback);
    }

    // if component doesn't return unlisten function,
    // them component doesn't now how to listen that kind of trigger
    if (!unlisten) {
      unlisten = () => null;
    }

    this.triggerUnlisteners.set(trigger, unlisten);
  }

  private unlistenTrigger(trigger: string) {
    const unlisten = this.triggerUnlisteners.get(trigger);
    this.triggerUnlisteners.delete(trigger);
    unlisten();
  }

  private unlistenAll() {
    this.triggerUnlisteners.forEach(unlisten => unlisten());
    this.triggerUnlisteners.clear();
  }

  private executeActions(trigger: string, event) {
    const actionsToExecute = this.actions[trigger];
    const shouldAbortListen$ = this.disabled$.pipe(
      distinctUntilChanged(),
      filter(disabled => disabled)
    );
    const destroy$ = merge(this.destroyed$, shouldAbortListen$);

    for (const triggeredAction of actionsToExecute) {
      this.workflowExecutor
        .getWorkflow(triggeredAction.action)
        .pipe(
          switchMap((workflow: Workflow) => this.workflowExecutor.run(workflow, triggeredAction.paramCode || event)),
          takeUntil(destroy$)
        )
        .subscribe();
    }
  }

  private listenOnInit(callback: (value: any) => void): () => void {
    const subscription: Subscription = this.renderState.showDevUI$.subscribe((devMode: boolean) => {
      if (!devMode) {
        // on init called immediately after component created
        // in preview mode it could lead to component.service.bake dispatch inside of dispatch
        // TODO remove when batch updates will be implemented
        setTimeout(() => callback(undefined));
      }
    });
    return () => subscription.unsubscribe();
  }
}
