import { Injectable } from '@angular/core';
import { ActionDiagram, AnalyticsService } from '@common/public-api';
import { DiagramModel } from '@gradii/triangle/diagram';
import { dispatch } from '@ngneat/effects';
import { BehaviorSubject } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { HistoryActions } from '../../history/history.actions';
import { ProjectActions } from '../../project/project.actions';
import { WorkingAreaActions } from '../../working-area/working-area.actions';
import { ActionDiagramActions } from './action-diagram.actions';
import { getActionDiagram, getActivePageActionDiagram } from './action-diagram.selectors';

type ActionDiagramModelLayerModel = {
  type: string;
  selected: boolean;
  extras: any;
  id: string;
  locked: boolean;
}

type ActionDiagramModelLayer = {
  isSvg: boolean;
  transformed: boolean;
  models: ActionDiagramModelLayerModel[];
  type: string;
  selected: boolean;
  extras: any;
  id: string;
  locked: boolean;
}

type ActionDiagramModel = {
  offsetX: number;
  offsetY: number;
  zoom: number;
  gridSize: number;
  layers: ActionDiagramModelLayer[];
  id: string;
  locked: boolean;
}

@Injectable({ providedIn: 'root' })
export class ActionDiagramFacade {

  inspectDiagramModel$ = new BehaviorSubject<DiagramModel>(null);

  getActivePageActionDiagram$ = getActivePageActionDiagram;

  constructor(private analytics: AnalyticsService) {
  }

  _syncAppState() {
    dispatch(WorkingAreaActions.SyncState());
    dispatch(ProjectActions.UpdateProject());
    dispatch(HistoryActions.Persist());
  }

  // connectActionDiagram(actionDiagram: ActionDiagram) {
  // }

  createActionDiagram() {

  }

  setInspectDiagramModel(model: DiagramModel) {
    this.inspectDiagramModel$.next(model)
  }

  saveActionDiagram(actionDiagram: ActionDiagram) {
    if (!actionDiagram.model || !actionDiagram.parentSlotId) {
      return;
    }
    dispatch(ActionDiagramActions.UpsertActionDiagram(actionDiagram));
    this._syncAppState();

    // this.analytics.logActionSave(actionDiagram.id, actionDiagram.name, actionDiagram.steps.length);
  }

  updateActionDiagramModel(model: ActionDiagramModel) {
    getActionDiagram(model.id).pipe(
      take(1),
      filter(actionDiagram => !!actionDiagram),
      tap(actionDiagram => {
        dispatch(ActionDiagramActions.UpsertActionDiagram({
          ...actionDiagram,
          model    : model
        }));
        this._syncAppState();

      })
    ).subscribe();
  }
}
