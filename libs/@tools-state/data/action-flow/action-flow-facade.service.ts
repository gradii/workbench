import { Injectable } from '@angular/core';
import { ActionFlow, AnalyticsService } from '@common/public-api';
import { DiagramModel } from '@gradii/triangle/diagram';
import { dispatch } from '@ngneat/effects';
import { BehaviorSubject } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { ActionFlowActions } from '@tools-state/data/action-flow/action-flow.actions';
import { getActionFlow, getActivePageActionFlow } from '@tools-state/data/action-flow/action-flow.selectors';

type ActionFlowModelLayerModel = {
  type: string;
  selected: boolean;
  extras: any;
  id: string;
  locked: boolean;
}

type ActionFlowModelLayer = {
  isSvg: boolean;
  transformed: boolean;
  models: ActionFlowModelLayerModel[];
  type: string;
  selected: boolean;
  extras: any;
  id: string;
  locked: boolean;
}

type ActionFlowModel = {
  offsetX: number;
  offsetY: number;
  zoom: number;
  gridSize: number;
  layers: ActionFlowModelLayer[];
  id: string;
  locked: boolean;
}

@Injectable({ providedIn: 'root' })
export class ActionFlowFacade {

  inspectDiagramModel$ = new BehaviorSubject<DiagramModel>(null);

  getActivePageActionFlow$ = getActivePageActionFlow;

  constructor(private analytics: AnalyticsService) {
  }

  _syncAppState() {
    dispatch(WorkingAreaActions.SyncState());
    dispatch(ProjectActions.UpdateProject());
    dispatch(HistoryActions.Persist());
  }

  // connectActionFlow(actionDiagram: ActionFlow) {
  // }

  createActionFlow() {

  }

  setInspectDiagramModel(model: DiagramModel) {
    this.inspectDiagramModel$.next(model);
  }

  saveActionFlow(actionDiagram: ActionFlow) {
    // if (!actionDiagram.model || !actionDiagram.parentSlotId) {
    //   return;
    // }
    // dispatch(ActionFlowActions.UpsertActionFlow(actionDiagram));
    // this._syncAppState();

    // this.analytics.logActionSave(actionDiagram.id, actionDiagram.name, actionDiagram.steps.length);
  }

  updateActionFlowModel(model: ActionFlowModel) {
    getActionFlow(model.id).pipe(
      take(1),
      filter(actionDiagram => !!actionDiagram),
      tap(actionDiagram => {
        dispatch(ActionFlowActions.UpsertActionFlow({
          ...actionDiagram,
          model: model
        }));
        this._syncAppState();
      })
    ).subscribe();
  }
}
