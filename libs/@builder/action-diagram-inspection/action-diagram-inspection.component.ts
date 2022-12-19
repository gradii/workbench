import { Component, OnInit } from '@angular/core';
import { StoreItem } from '@common/public-api';
import { ActionDiagramFacade } from '@tools-state/data/action-diagram/action-diagram-facade.service';
import { StoreItemUtilService } from '@workflow-common/util/store-item-util.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ActionDiagramInspectionService, ActionInspection, ActionInspectionBuilder, ActionInspectionDataSource, HintStrategy,
  NodeManipulation, Telemetry
} from './action-diagram-inspection.service';

@Component({
  selector: 'pf-action-diagram-inspection',
  template: `
    <tri-tab-group type="segment">
      <tri-tab title="inspection">
        <div style="min-height: 200px">
          <pf-action-inspection-info
            [dataSource]="actionInspectionDataSource"
            [actionInspection]="actionInspection">
          </pf-action-inspection-info>
        </div>
      </tri-tab>
      <tri-tab title="variable">
        <pf-scope-variable-box></pf-scope-variable-box>
      </tri-tab>
      <tri-tab title="event">
        <pf-scope-event-box></pf-scope-event-box>
      </tri-tab>
      <tri-tab title="additional">

      </tri-tab>
    </tri-tab-group>

  `
})
export class ActionDiagramInspectionComponent implements OnInit {

  filteredStoreItemList$: Observable<StoreItem[]> = this.storeItemUtils.activePageStoreItemList$;
  globalStoreItemList$: Observable<StoreItem[]>   = this.storeItemUtils.globalStoreItemList$;

  destroy$ = new Subject();

  actionInspectionBuilder: ActionInspectionBuilder;

  actionInspection: ActionInspection;
  actionInspectionDataSource: ActionInspectionDataSource;

  constructor(
    private storeItemUtils: StoreItemUtilService,
    private actionDiagramInspectionService: ActionDiagramInspectionService,
    private actionDiagramFacade: ActionDiagramFacade
  ) {
    this.actionInspectionDataSource = new ActionInspectionDataSource(
      actionDiagramFacade.inspectDiagramModel$
    );
  }

  ngOnInit() {
    this.actionInspection        = new ActionInspection();
    this.actionInspectionBuilder = this.actionDiagramInspectionService
      .createBuilder(this.actionInspection)
      .withHintStrategy(new HintStrategy())
      .withNodeManipulation(new NodeManipulation())
      .withTelemetry(new Telemetry());

    this.actionInspectionBuilder.asObservable().pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.complete();
    // this.actionDiagramInspectionService.disconnect(this.actionInspection);
  }

}