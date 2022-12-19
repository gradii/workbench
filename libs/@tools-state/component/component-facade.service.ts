import { Injectable } from '@angular/core';
import {
  AddKitchenComponent, AnalyticsService, combineWith, DivideSpace, ExecuteSourceType, KitchenComponent, KitchenType,
  MoveComponent, MoveItemInArrayComponent, PasteComponent, RemoveKitchenComponent, ResizeKitchenSpace,
  SelectKitchenComponent, TransferArrayItemComponent, UpdateProperties
} from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { TriMessageService } from '@gradii/triangle/message';
import { dispatch } from '@ngneat/effects';
import { Action } from '@ngneat/effects/lib/actions.types';
import { AppModelVersionService } from '@shared/app-model-version.service';
import { CommunicationService } from '@shared/communication/communication.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { ClipboardActions } from '@tools-state/clipboard/clipboard.actions';
import { PuffComponentOrDirective } from '@tools-state/common.model';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponentUpdate, PuffComponent } from '@tools-state/component/component.model';
import {
  canRemoveSpace, getActiveComponent, getActiveComponentIdList, getActiveComponentList, getActiveSlot, getComponentList,
  getComponentMap, getNearestSiblingOrParentComponentId, getParentListComponent, getSubComponentIds,
  getSubComponentIdsList, getUiDataSourceComponents
} from '@tools-state/component/component.selectors';
import { DivideSpaceService } from '@tools-state/component/divide-space.service';
import { DynamicSlotsHelper } from '@tools-state/component/dynamic-slots/dynamic-slots.helper';
// import { FeatureActions } from '@root-state/feature/feature.actions';
import { isLayoutElement, isSpace } from '@tools-state/component/utils';
import { VariableRenameService } from '@tools-state/data/variable-rename.service';
import { FeatureActions } from '@tools-state/feature/feature.actions';
import { HistoryFacadeService } from '@tools-state/history/history-facade.service';
import { HistoryActions } from '@tools-state/history/history.actions';
import { LayoutFacade } from '@tools-state/layout/layout-facade.service';
import { ProjectActions } from '@tools-state/project/project.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotParent } from '@tools-state/slot/slot.selectors';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { combineLatest, forkJoin, iif, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { PuffFeature, PuffFeatureUpdate } from '../feature/feature.model';

interface CanRemoveComponent {
  canRemove: boolean;
  component: PuffComponent;
}

@Injectable({ providedIn: 'root' })
export class ComponentFacade {
  readonly activeComponent$: Observable<PuffComponent> = getActiveComponent;

  readonly activeSlot$: Observable<PuffSlot> = getActiveSlot;

  readonly componentList$: Observable<PuffComponent[]> = getComponentList;

  readonly dataComponentList$: Observable<PuffComponent[]> = getUiDataSourceComponents;

  private listenCommunicationUntil: Subject<void> = new Subject();

  constructor(
    private stateConverter: StateConverterService,
    private dynamicSlotsHelper: DynamicSlotsHelper,
    private historyFacade: HistoryFacadeService,
    private layoutFacade: LayoutFacade,
    private componentNameService: ComponentNameService,
    private divideSpaceService: DivideSpaceService,
    private communication: CommunicationService,
    private appModelVersionService: AppModelVersionService,
    private analytics: AnalyticsService,
    private variableRenameService: VariableRenameService,
    private messageService: TriMessageService
  ) {
  }

  attach() {
    this.communication.addComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((addKitchenComponent: AddKitchenComponent) => this.addComponent(addKitchenComponent));

    this.communication.selectComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: SelectKitchenComponent) => this.selectComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.removeComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: RemoveKitchenComponent) => this.removeComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.removeActiveComponents$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => this.removeActiveComponents(ExecuteSourceType.WorkingArea));

    this.communication.updateComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: UpdateProperties) => this.updateKitchenComponent(data));

    this.communication.resizeSpace$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: ResizeKitchenSpace) => this.resizeSpace(data));

    this.communication.commitResizeSpace$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(({ stickMode }) => this.commitResizeSpace(stickMode));

    this.communication.divideSpace$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: DivideSpace) => this.divideSpace(data));

    this.communication.copy$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => dispatch(ClipboardActions.Copy()));

    this.communication.paste$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: PasteComponent) => dispatch(ClipboardActions.Paste(data)));

    this.communication.cut$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => dispatch(ClipboardActions.Cut()));

    this.communication.undo$.pipe(takeUntil(this.listenCommunicationUntil)).subscribe(() => this.historyFacade.back());

    this.communication.redo$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => this.historyFacade.forward());

    this.communication.clearClipboard$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => dispatch(ClipboardActions.Clear()));

    this.communication.moveComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: MoveComponent) => this.moveComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.moveItemInArrayComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(
        (data: MoveItemInArrayComponent) => this.moveItemInArrayComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.transferArrayItemComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(
        (data: TransferArrayItemComponent) => this.transferArrayItemComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.thumbnail$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((image: string) => dispatch(ProjectActions.PersistThumbnail(image)));

    // this.communication.accessFeature$
    //   .pipe(takeUntil(this.listenCommunicationUntil))
    //   .subscribe((data: AccessFeature) => dispatch(FeatureActions.accessFeature(data)));

    this.communication.workbenchVersion$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((version: number) => this.appModelVersionService.verify(version));
  }

  detach() {
    this.listenCommunicationUntil.next();
  }

  undo() {
    this.historyFacade.back();
  }

  redo() {
    this.historyFacade.forward();
  }

  addFeature(feature: PuffFeature) {
    const actionsToExecute = [
      FeatureActions.AddFeature(feature),
      WorkingAreaActions.SyncState(),
      ProjectActions.UpdateProject(),
      HistoryActions.Persist()
    ];
    actionsToExecute.forEach((action: Action) => dispatch(action));
  }

  updateFeature(update: PuffFeatureUpdate) {
    const actionsToExecute = [
      FeatureActions.UpdateFeature(update),
      WorkingAreaActions.SyncState(),
      ProjectActions.UpdateProject(),
      HistoryActions.Persist()
    ];
    actionsToExecute.forEach((action: Action) => dispatch(action));
  }

  updateComponent(update: PuffComponentUpdate) {
    combineLatest([
      this.variableRenameService.getRenameActionsIfNeeded(update),
      this.variableRenameService.getRenameActionsForSmartTableIfNeeded(update),
      this.dynamicSlotsHelper.getSyncSlotActionsIfNeeded(update)
    ]).subscribe(([renameActions, renamePropsActions, syncSlotActions]: [Action[], Action[], Action[]]) => {
      const actionsToExecute = [
        ...renameActions,
        ...renamePropsActions,
        ...syncSlotActions,
        ComponentActions.UpdateComponent(update),
        WorkingAreaActions.SyncState(),
        ProjectActions.UpdateProject(),
        HistoryActions.Persist()
      ];
      actionsToExecute.forEach((action: Action) => dispatch(action));
    });
  }

  isComponent(component: PuffComponentOrDirective): component is PuffComponent {
    return !!(component as PuffComponent).parentSlotId;
  }

  isRootComponent(component: PuffComponentOrDirective): Observable<boolean> {
    if (this.isComponent(component)) {
      return getSlotParent((component as PuffComponent).parentSlotId).pipe(
        map((parent: PuffComponent) => {
          // No parent, it's a root space
          if (!parent) {
            return true;
          }

          // It's a root space for some slot
          return parent.definitionId !== 'space';
        })
      );
    } else {
      return of(false);
    }
  }

  selectComponentById(component: KitchenComponent, source: ExecuteSourceType): void {
    this.analytics.logSelectComponent(component.definitionId, source);
    dispatch(ComponentActions.SelectComponent([component.id]));
    dispatch(HistoryActions.Persist());
  }

  setHoveredComponent(id: string): void {
    dispatch(ComponentActions.HoveredComponent(id));
  }

  findParentListComponent(componentId: string): Observable<PuffComponent[]> {
    return getParentListComponent(componentId);
  }

  private updateKitchenComponent(update: UpdateProperties) {
    this.updateComponent({
      id        : update.id,
      properties: update.properties
    });
  }

  private addComponent(addKitchenComponent: AddKitchenComponent) {
    this.logAddComponent(addKitchenComponent);

    const component: PuffComponent                                        = this.createComponent(addKitchenComponent);
    const subEntities: { slots: PuffSlot[]; components: PuffComponent[] } = this.stateConverter.getSubEntities(
      addKitchenComponent.component
    );

    this.componentNameService
      .addComponentIndexIfNeeded([component, ...subEntities.components])
      .subscribe((componentList: PuffComponent[]) => {
        dispatch(
          ComponentActions.ShiftForwardAfterComponent(addKitchenComponent.parentSlotId, component.index, 1)
        );
        dispatch(ComponentActions.AddComponentList(componentList));
        dispatch(SlotActions.AddSlotList(subEntities.slots));
        dispatch(WorkingAreaActions.SyncState());
        dispatch(ComponentActions.SelectComponent([component.id]));
        dispatch(ProjectActions.UpdateProject());
        dispatch(HistoryActions.Persist());
      });
  }

  public moveComponent(data: MoveComponent, source: ExecuteSourceType) {
    this.analytics.logDragAndDrop(data.component.definitionId, source);
    dispatch(ComponentActions.MoveComponent(data.component.id, data.parentSlotId, data.position));
  }

  public moveItemInArrayComponent(data: MoveItemInArrayComponent, source: ExecuteSourceType) {
    this.analytics.logDragAndDrop(data.component.definitionId, source);
    dispatch(ComponentActions.MoveItemInArrayComponent(
      data.component.id, data.parentSlotId, data.currentIndex, data.targetIndex, data.currentContainer));
  }

  public transferArrayItemComponent(data: TransferArrayItemComponent, source: ExecuteSourceType) {
    this.analytics.logDragAndDrop(data.component.definitionId, source);
    dispatch(ComponentActions.TransferArrayItemComponent(
      data.component.id,
      data.currentContainer.slotId, data.targetContainer.slotId,
      data.currentIndex, data.targetIndex));
  }

  private removeComponent(data: RemoveKitchenComponent, source: ExecuteSourceType) {
    if (isLayoutElement(data.component)) {
      return this.removeLayoutElement(data.component);
    }

    this.logRemoveComponent(data, source);

    getSubComponentIds({ componentIdList: [data.component.id], slotIdList: [] })
      .pipe(
        take(1),
        combineWith(({ componentIdList, slotIdList }) => {
          return getNearestSiblingOrParentComponentId({ componentIdList });
        }),
        // withLatestFrom(
        //   this.divideSpaceService.updateParentContainerOnDelete(data.parentSlotId, data.component.definitionId)
        // )
      )
      .subscribe(
        ([idsToRemove, componentToSelectId]: [
          { componentIdList: string[]; slotIdList: string[] }, string
        ]) => {
          // if (updateParentAction) {
          //   dispatch(updateParentAction);
          // }
          dispatch(ComponentActions.RemoveComponentList(idsToRemove.componentIdList));
          dispatch(SlotActions.RemoveSlotList(idsToRemove.slotIdList));
          dispatch(WorkingAreaActions.SyncState());
          dispatch(ComponentActions.SelectComponent([componentToSelectId]));
          dispatch(ProjectActions.UpdateProject());
          dispatch(HistoryActions.Persist());
        }
      );
  }

  public removeActiveComponents(source: ExecuteSourceType) {
    getActiveComponentList
      .pipe(
        take(1),
        map((componentList: PuffComponent[]) => {
          const layoutElement: PuffComponent = componentList.find(c => isLayoutElement(c));
          const components: PuffComponent[]  = componentList.filter(c => !isLayoutElement(c));
          this.removeLayoutElement(layoutElement);
          return components;
        }),
        switchMap((componentList: PuffComponent[]) => {
          return forkJoin(
            componentList.map((c: PuffComponent) =>
              iif(() => isSpace(c),
                this.canRemoveSlot(c),
                of({ canRemove: true, component: c }))
            )
          );
        }),
        map((tuples: CanRemoveComponent[]) => {
          return tuples.filter(t => t.canRemove).map(t => t.component);
        }),
        filter((componentList: PuffComponent[]) => !!componentList.length),
        combineWith((componentList: PuffComponent[]) => {
          const removeList = componentList.map((c: PuffComponent) => ({
            componentIdList: [c.id],
            slotIdList     : []
          }));

          this.logRemoveComponentsList(componentList, source);
          return getSubComponentIdsList(removeList);
        }),
        combineWith(([_componentList, idsToRemove]: [PuffComponent[], any]) => {
          const componentIdList: string[] = [];

          for (const ids of idsToRemove) {
            componentIdList.push(...ids.componentIdList);
          }

          return getNearestSiblingOrParentComponentId({ componentIdList });
        })
      )
      .subscribe(
        ([[_componentList, idsToRemove], componentToSelectId]: [
          [PuffComponent[], { componentIdList: string[]; slotIdList: string[] }[]],
          string,
        ]) => {
          idsToRemove.forEach(removeData => {
            dispatch(ComponentActions.RemoveComponentList(removeData.componentIdList));
            dispatch(SlotActions.RemoveSlotList(removeData.slotIdList));
          });
          dispatch(WorkingAreaActions.SyncState());
          dispatch(ComponentActions.SelectComponent([componentToSelectId]));
          dispatch(ProjectActions.UpdateProject());
          dispatch(HistoryActions.Persist());
        }
      );
  }

  private resizeSpace(data: ResizeKitchenSpace) {
    getSelectedBreakpoint.pipe(take(1)).subscribe((breakpoint: Breakpoint) => {
      const resize = [{ id: data.component.id, width: data.width, height: data.height }];
      dispatch(ComponentActions.ResizeSpaces(resize, breakpoint));
    });
  }

  private commitResizeSpace(stickMode: boolean) {
    this.analytics.logResizeSpace(stickMode);

    dispatch(ProjectActions.UpdateProject());
    dispatch(WorkingAreaActions.SyncState());
    dispatch(HistoryActions.Persist());
  }

  private divideSpace(data: DivideSpace) {
    this.divideSpaceService.divide(data);
    this.analytics.logDivideSpace(data.type);
  }

  private selectComponent(data: SelectKitchenComponent, source: ExecuteSourceType) {
    if (!data) {
      return;
    }

    this.analytics.logSelectComponent(data.component.definitionId, source);

    if (data.multi) {
      combineLatest([
        getComponentMap,
        getActiveComponentIdList
      ])
        .pipe(take(1))
        .subscribe(([entities, oldIdList]: [Partial<PuffComponent>, string[]]) => {
          let idList;

          // remove/add active element when multi select
          if (oldIdList.includes(data.component.id)) {
            idList = oldIdList.filter((id: string) => id !== data.component.id);
          } else {
            // TODO don't select component if parent already selected
            idList = [...oldIdList, data.component.id];
          }

          // header, sidebar can't be selected with other elements
          idList = idList.filter(
            (id: string) =>
              entities[id].definitionId !== 'sidebar' &&
              entities[id].definitionId !== 'header'
          );

          dispatch(ComponentActions.SelectComponent(idList));
          dispatch(HistoryActions.Persist());
        });
    } else {
      dispatch(ComponentActions.SelectComponent([data.component.id]));
      dispatch(HistoryActions.Persist());
    }
  }

  private createComponent(addKitchenComponent: AddKitchenComponent): PuffComponent {
    return {
      id          : addKitchenComponent.component.id,
      type        : KitchenType.Component,
      definitionId: addKitchenComponent.component.definitionId,
      parentSlotId: addKitchenComponent.parentSlotId,
      styles      : addKitchenComponent.component.styles,
      properties  : addKitchenComponent.component.properties,
      actions     : addKitchenComponent.component.actions,
      index       : addKitchenComponent.index
    };
  }

  private logAddComponent(addKitchenComponent: AddKitchenComponent) {
    // if (isSpace(addKitchenComponent.component)) {
    //   this.analytics.logAddSpace();
    // } else if (addKitchenComponent.widgetName) {
    //   this.analytics.logAddComponent(addKitchenComponent.widgetName, true);
    // } else {
    //   this.analytics.logAddComponent(addKitchenComponent.component.definitionId);
    // }
  }

  private logRemoveComponent(data: RemoveKitchenComponent, source: ExecuteSourceType) {
    if (isSpace(data.component)) {
      this.analytics.logRemoveSpace(source);
    } else {
      this.analytics.logRemoveComponent(data.component.definitionId, source);
    }
  }

  private logRemoveComponentsList(list: PuffComponent[], source: ExecuteSourceType) {
    if (list.length > 1) {
      this.analytics.logRemoveComponentsList(list.map((component: PuffComponent) => component.definitionId));
    } else {
      this.analytics.logRemoveComponent(list[0].definitionId, source);
    }
  }

  private removeLayoutElement(layoutElement: KitchenComponent) {
    if (layoutElement) {
      this.layoutFacade.removeLayoutComponent(layoutElement.definitionId);
    }
  }

  private canRemoveSlot(space: PuffComponent): Observable<CanRemoveComponent> {
    return canRemoveSpace(space.id).pipe(
      take(1),
      tap(canRemove => {
        if (!canRemove) {
          this.messageService.error('The root container can’t be deleted.');
        }
      }),
      // not possible do delete last space
      filter((canRemove: boolean) => canRemove),
      map(canRemove => {
        return { canRemove, component: space };
      })
    );
  }
}
