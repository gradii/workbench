import { DiagramModel } from '@gradii/triangle/diagram';

export class BuilderActionService {
  private diagramModel: DiagramModel;

  constructor() {
  }

  hintLink(linkId: string) {
    // const link = this.diagramModel.getLink(linkId);
    // link.style.strokeDashArray = '4,4';

    // this.diagramModel.startTransaction('hintLink');
    // this.diagramModel.layout.hintLink(this.diagramModel);
    // this.diagramModel.endTransaction('hintLink');
  }

  // activeDiagram$ = new BehaviorSubject(null);
  // disconnected$  = new Subject<ActionDiagramInspectionService>();
  //
  // constructor() {
  // }
  //
  // setActiveDiagram(diagram: any) {
  //   this.activeDiagram$.next(diagram);
  // }
  //
  // connectInspection(inspection: ActionDiagramInspectionService): Observable<any> {
  //   return this.activeDiagram$.pipe(
  //     takeUntil(this.disconnected$.pipe(
  //       filter(it => it === inspection)
  //     )),
  //     switchMap(it => {
  //       return inspection.view(it);
  //     })
  //   );
  // }
  //
  // disconnectInspection(inspection: ActionDiagramInspectionService): void {
  //   this.disconnected$.next(inspection);
  // }
  //
  // ngOnDestroy() {
  //   this.disconnected$.complete();
  // }
}