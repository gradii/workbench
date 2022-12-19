// import { Injectable } from '@angular/core';
// import {
//   AddKitchenFeature, AnalyticsService, combineWith, DivideSpace, ExecuteSourceType, KitchenFeature, KitchenType,
//   RemoveKitchenFeature, ResizeKitchenSpace, UpdateProperties
// } from '@common/public-api';
// import { Breakpoint } from '@core/breakpoint/breakpoint';
// import { TriMessageService } from '@gradii/triangle/message';
// import { dispatch } from '@ngneat/effects';
// import { Action } from '@ngneat/effects/lib/actions.types';
// import { AppModelVersionService } from '@shared/app-model-version.service';
// import { CommunicationService } from '@shared/communication/communication.service';
// import { StateConverterService } from '@shared/communication/state-converter.service';
// import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
// import { PuffFeature } from '@tools-state/component/component.model';
//
// import { DivideSpaceService } from '@tools-state/component/divide-space.service';
// import { DynamicSlotsHelper } from '@tools-state/component/dynamic-slots/dynamic-slots.helper';
// import { isLayoutElement, isSpace } from '@tools-state/component/utils';
// import { VariableRenameService } from '@tools-state/data/variable-rename.service';
// import { FeatureActions } from '@tools-state/feature/feature.actions';
// import { HistoryFacadeService } from '@tools-state/history/history-facade.service';
// import { HistoryActions } from '@tools-state/history/history.actions';
// import { LayoutFacade } from '@tools-state/layout/layout-facade.service';
// import { ProjectActions } from '@tools-state/project/project.actions';
// import { SlotActions } from '@tools-state/slot/slot.actions';
// import { Slot } from '@tools-state/slot/slot.model';
// import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
// import { combineLatest, forkJoin, iif, Observable, of, Subject } from 'rxjs';
// import { filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
//
// interface CanRemoveFeature {
//   canRemove: boolean;
//   component: PuffFeature;
// }
//
// @Injectable({ providedIn: 'root' })
// export class FeatureFacade {
//   readonly activeFeature$: Observable<PuffFeature> = getActiveFeature;
//
//   readonly featureList$: Observable<PuffFeature[]> = getFeatureList;
//
//   readonly dataFeatureList$: Observable<PuffFeature[]> = getUiDataSourceFeatures;
//
//   private listenCommunicationUntil: Subject<void> = new Subject();
//
//   constructor(
//     private stateConverter: StateConverterService,
//     private historyFacade: HistoryFacadeService,
//     private layoutFacade: LayoutFacade,
//     private divideSpaceService: DivideSpaceService,
//     private communication: CommunicationService,
//     private appModelVersionService: AppModelVersionService,
//     private analytics: AnalyticsService,
//     private variableRenameService: VariableRenameService,
//     private messageService: TriMessageService
//   ) {
//   }
//
//   attach() {
//     this.communication.addFeature$
//       .pipe(takeUntil(this.listenCommunicationUntil))
//       .subscribe((addKitchenFeature: AddKitchenFeature) => this.addFeature(addKitchenFeature));
//
//     this.communication.removeFeature$
//       .pipe(takeUntil(this.listenCommunicationUntil))
//       .subscribe((data: RemoveKitchenFeature) => this.removeFeature(data, ExecuteSourceType.WorkingArea));
//
//     this.communication.updateFeature$
//       .pipe(takeUntil(this.listenCommunicationUntil))
//       .subscribe((data: UpdateProperties) => this.updateKitchenFeature(data));
//   }
//
//   detach() {
//     this.listenCommunicationUntil.next();
//   }
//
//   undo() {
//     this.historyFacade.back();
//   }
//
//   redo() {
//     this.historyFacade.forward();
//   }
//
//   updateFeature(update: BakeryFeatureUpdate) {
//     combineLatest([
//       this.variableRenameService.getRenameActionsIfNeeded(update),
//       this.variableRenameService.getRenameActionsForSmartTableIfNeeded(update),
//       this.dynamicSlotsHelper.getSyncSlotActionsIfNeeded(update)
//     ]).subscribe(([renameActions, renamePropsActions, syncSlotActions]: [Action[], Action[], Action[]]) => {
//       const actionsToExecute = [
//         ...renameActions,
//         ...renamePropsActions,
//         ...syncSlotActions,
//         FeatureActions.UpdateFeature(update),
//         WorkingAreaActions.SyncState(),
//         ProjectActions.UpdateProject(),
//         HistoryActions.Persist()
//       ];
//       actionsToExecute.forEach((action: Action) => dispatch(action));
//     });
//   }
//
//   private updateKitchenFeature(update: UpdateProperties) {
//     this.updateFeature({
//       id        : update.id,
//       properties: update.properties
//     });
//   }
//
//   private addFeature(addKitchenFeature: AddKitchenFeature) {
//     this.logAddFeature(addKitchenFeature);
//
//     const component: PuffFeature                                    = this.createFeature(addKitchenFeature);
//     const subEntities: { slots: Slot[]; components: PuffFeature[] } = this.stateConverter.getSubEntities(
//       addKitchenFeature.component
//     );
//
//     this.componentNameService
//       .addFeatureIndexIfNeeded([component, ...subEntities.components])
//       .subscribe((componentList: PuffFeature[]) => {
//         dispatch(
//           FeatureActions.ShiftForwardAfterFeature(addKitchenFeature.parentSlotId, component.index, 1)
//         );
//         dispatch(FeatureActions.AddFeatureList(componentList));
//         dispatch(SlotActions.AddSlotList(subEntities.slots));
//         dispatch(WorkingAreaActions.SyncState());
//         dispatch(FeatureActions.SelectFeature([component.id]));
//         dispatch(ProjectActions.UpdateProject());
//         dispatch(HistoryActions.Persist());
//       });
//   }
//
//   public moveFeature(data: MoveFeature, source: ExecuteSourceType) {
//     this.analytics.logDragAndDrop(data.component.definitionId, source);
//     dispatch(FeatureActions.MoveFeature(data.component.id, data.parentSlotId, data.position));
//   }
//
//   public moveItemInArrayFeature(data: MoveItemInArrayFeature, source: ExecuteSourceType) {
//     this.analytics.logDragAndDrop(data.component.definitionId, source);
//     dispatch(FeatureActions.MoveItemInArrayFeature(
//       data.component.id, data.parentSlotId, data.currentIndex, data.targetIndex, data.currentContainer));
//   }
//
//   public transferArrayItemFeature(data: TransferArrayItemFeature, source: ExecuteSourceType) {
//     this.analytics.logDragAndDrop(data.component.definitionId, source);
//     dispatch(FeatureActions.TransferArrayItemFeature(
//       data.component.id,
//       data.currentContainer.id, data.targetContainer.id,
//       data.currentContainer.parentSlotId, data.targetContainer.parentSlotId,
//       data.currentIndex, data.targetIndex));
//   }
//
//   private removeFeature(data: RemoveKitchenFeature, source: ExecuteSourceType) {
//     if (isLayoutElement(data.component)) {
//       return this.removeLayoutElement(data.component);
//     }
//
//     this.logRemoveFeature(data, source);
//
//     getSubFeatureIds({ componentIdList: [data.component.id], slotIdList: [] })
//       .pipe(
//         take(1),
//         combineWith(({ componentIdList, slotIdList }) => {
//           return getNearestSiblingOrParentFeatureId({ componentIdList });
//         }),
//         withLatestFrom(
//           this.divideSpaceService.updateParentContainerOnDelete(data.parentSlotId, data.component.definitionId)
//         )
//       )
//       .subscribe(
//         ([[idsToRemove, componentToSelectId], updateParentAction]: [
//           [{ componentIdList: string[]; slotIdList: string[] }, string],
//           Action,
//         ]) => {
//           if (updateParentAction) {
//             dispatch(updateParentAction);
//           }
//           dispatch(FeatureActions.RemoveFeatureList(idsToRemove.componentIdList));
//           dispatch(SlotActions.RemoveSlotList(idsToRemove.slotIdList));
//           dispatch(WorkingAreaActions.SyncState());
//           dispatch(FeatureActions.SelectFeature([componentToSelectId]));
//           dispatch(ProjectActions.UpdateProject());
//           dispatch(HistoryActions.Persist());
//         }
//       );
//   }
//
//   public removeActiveFeatures(source: ExecuteSourceType) {
//     getActiveFeatureList
//       .pipe(
//         take(1),
//         map((componentList: PuffFeature[]) => {
//           const layoutElement: PuffFeature = componentList.find(c => isLayoutElement(c));
//           const components: PuffFeature[]  = componentList.filter(c => !isLayoutElement(c));
//           this.removeLayoutElement(layoutElement);
//           return components;
//         }),
//         switchMap((componentList: PuffFeature[]) => {
//           return forkJoin(
//             componentList.map((c: PuffFeature) =>
//               iif(() => isSpace(c),
//                 this.canRemoveSlot(c),
//                 of({ canRemove: true, component: c }))
//             )
//           );
//         }),
//         map((tuples: CanRemoveFeature[]) => {
//           return tuples.filter(t => t.canRemove).map(t => t.component);
//         }),
//         filter((componentList: PuffFeature[]) => !!componentList.length),
//         combineWith((componentList: PuffFeature[]) => {
//           const removeList = componentList.map((c: PuffFeature) => ({
//             componentIdList: [c.id],
//             slotIdList     : []
//           }));
//
//           this.logRemoveFeaturesList(componentList, source);
//           return getSubFeatureIdsList(removeList);
//         }),
//         combineWith(([_componentList, idsToRemove]: [PuffFeature[], any]) => {
//           const componentIdList: string[] = [];
//
//           for (const ids of idsToRemove) {
//             componentIdList.push(...ids.componentIdList);
//           }
//
//           return getNearestSiblingOrParentFeatureId({ componentIdList });
//         })
//       )
//       .subscribe(
//         ([[_componentList, idsToRemove], componentToSelectId]: [
//           [PuffFeature[], { componentIdList: string[]; slotIdList: string[] }[]],
//           string,
//         ]) => {
//           idsToRemove.forEach(removeData => {
//             dispatch(FeatureActions.RemoveFeatureList(removeData.componentIdList));
//             dispatch(SlotActions.RemoveSlotList(removeData.slotIdList));
//           });
//           dispatch(WorkingAreaActions.SyncState());
//           dispatch(FeatureActions.SelectFeature([componentToSelectId]));
//           dispatch(ProjectActions.UpdateProject());
//           dispatch(HistoryActions.Persist());
//         }
//       );
//   }
//
//   private resizeSpace(data: ResizeKitchenSpace) {
//     getSelectedBreakpoint.pipe(take(1)).subscribe((breakpoint: Breakpoint) => {
//       const resize = [{ id: data.component.id, width: data.width, height: data.height }];
//       dispatch(FeatureActions.ResizeSpaces(resize, breakpoint));
//     });
//   }
//
//   private commitResizeSpace(stickMode: boolean) {
//     this.analytics.logResizeSpace(stickMode);
//
//     dispatch(ProjectActions.UpdateProject());
//     dispatch(WorkingAreaActions.SyncState());
//     dispatch(HistoryActions.Persist());
//   }
//
//   private divideSpace(data: DivideSpace) {
//     this.divideSpaceService.divide(data);
//     this.analytics.logDivideSpace(data.type);
//   }
//
//   private createFeature(addKitchenFeature: AddKitchenFeature): PuffFeature {
//     return {
//       id          : addKitchenFeature.component.id,
//       type        : KitchenType.Feature,
//       definitionId: addKitchenFeature.component.definitionId,
//       parentSlotId: addKitchenFeature.parentSlotId,
//       styles      : addKitchenFeature.component.styles,
//       properties  : addKitchenFeature.component.properties,
//       actions     : addKitchenFeature.component.actions,
//       index       : addKitchenFeature.index
//     };
//   }
//
//   private logAddFeature(addKitchenFeature: AddKitchenFeature) {
//     if (isSpace(addKitchenFeature.component)) {
//       this.analytics.logAddSpace();
//     } else if (addKitchenFeature.widgetName) {
//       this.analytics.logAddFeature(addKitchenFeature.widgetName, true);
//     } else {
//       this.analytics.logAddFeature(addKitchenFeature.component.definitionId);
//     }
//   }
//
//   private logRemoveFeaturesList(list: PuffFeature[], source: ExecuteSourceType) {
//     // if (list.length > 1) {
//     //   this.analytics.logRemoveFeaturesList(list.map((component: PuffFeature) => component.definitionId));
//     // } else {
//     //   this.analytics.logRemoveFeature(list[0].definitionId, source);
//     // }
//   }
//
//   private removeLayoutElement(layoutElement: KitchenFeature) {
//     // if (layoutElement) {
//     //   this.layoutFacade.removeLayoutFeature(layoutElement.definitionId);
//     // }
//   }
//
//   private canRemoveSlot(space: PuffFeature): Observable<CanRemoveFeature> {
//     return canRemoveSpace(space.id).pipe(
//       take(1),
//       tap(canRemove => {
//         if (!canRemove) {
//           this.messageService.error('The root container can’t be deleted.');
//         }
//       }),
//       // not possible do delete last space
//       filter((canRemove: boolean) => canRemove),
//       map(canRemove => {
//         return { canRemove, component: space };
//       })
//     );
//   }
// }
