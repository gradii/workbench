import { Injectable } from '@angular/core';
import { DiagramModel } from '@gradii/triangle/diagram';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

export type HintView = {
  type: string;
  hintId: string
}

export const enum HINT_TYPE {
  LINK = 'link',
  NODE = 'node',
}

@Injectable({
  providedIn: 'root'
})
export class ActionDiagramInspectionService {

  createBuilder(actionInspection: ActionInspection): ActionInspectionBuilder {
    return new ActionInspectionBuilder(actionInspection);
  }

  // disconnect(actionInspection: ActionInspection): void {
  // }
}

export class HintStrategy {


  withHighlightColor(color: string) {
    return this;
  }

  hint(hintView: HintView): Observable<any> {
    return of();
  }

  apply() {

  }

  updateHint() {

  }
}

export class NodeManipulation {
  manipulate(actionInspection: ActionInspection): void {
  }
}

export class Telemetry {

}

export class ActionInspectionFactory {
  hint() {
    return new HintStrategy();
  }

}

export class ActionInspectionRef {
  private _actionInspection: ActionInspection;
  private _destroyed = new Subject<void>();

  constructor(actionInspection: ActionInspection) {
    this._actionInspection = actionInspection;
  }

  get HintStrategy() {
    return undefined;
  }
}

export class ActionInspectionBuilder {

  hintStrategy: HintStrategy;
  nodeManipulation: NodeManipulation;
  telemetry: Telemetry;

  constructor(private actionInspection: ActionInspection) {
    // this.hintStrategy     = new HintStrategy();
    // this.nodeManipulation = new NodeManipulation();
  }

  withDiagramModel() {
  }

  withHintStrategy(hintStrategy: HintStrategy) {
    this.hintStrategy = hintStrategy;
    return this;
  }

  withNodeManipulation(nodeManipulation: NodeManipulation) {
    this.nodeManipulation = nodeManipulation;
    return this;
  }

  withTelemetry(telemetry) {
    this.telemetry = telemetry;
    return this;
  }

  asObservable() {
    return combineLatest(
      [
        this.actionInspection.hintView$.pipe(
          switchMap((it: HintView) => {
            if (this.hintStrategy) {
              return of(this.hintStrategy.hint(it));
            } else {
              return EMPTY;
            }
          })
        )
      ]
    ).pipe(
      map(([hint]) => {
        return {
          hint
          // nodeManipulation: this.nodeManipulation
        };
      })
    );
  }
}

export class ActionInspectionDataSource {

  disconnect$ = new Subject();

  constructor(private diagramModel$: Observable<DiagramModel>) {
  }

  connect(collectionViewer: ActionInspectionView): Observable<any | null> {
    return this.diagramModel$.pipe(
      takeUntil(this.disconnect$.pipe(filter(it => it === collectionViewer))),
      switchMap((diagramModel: DiagramModel) => {
        if (!diagramModel) {
          return EMPTY;
        }
        return collectionViewer.viewChange.pipe(
          map((selection) => {
            if (selection) {
              return diagramModel.getNode(selection);
            }
            return null;
          })
        );
      })
    );
  }

  disconnect(collectionViewer: ActionInspectionView): void {
    this.disconnect$.next(collectionViewer);
  }

  disconnectAll() {
    this.disconnect$.complete();
  }
}

export class ActionInspectionView {
  //selection change
  viewChange = new BehaviorSubject<string>(null);

  selectNode(nodeId: string) {
    this.viewChange.next(nodeId);
  }
}


// this is used for handle
export class ActionInspection {
  hintView$ = new BehaviorSubject<HintView>(null);

  constructor() {
  }

  hintLink(linkId: string) {
    console.log('hintLink', linkId);
    this.hintView$.next({ type: HINT_TYPE.LINK, hintId: linkId });
  }

  hintNode(nodeId: string) {
    console.log('hintNode', nodeId);
    this.hintView$.next({ type: HINT_TYPE.NODE, hintId: nodeId });
  }

}