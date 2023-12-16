import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Action, select, Store } from '@ngrx/store';
import { combineLatest, forkJoin, iif, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import {
  AccessFeature,
  AddOvenComponent,
  AnalyticsService,
  combineWith,
  DivideSpace,
  ExecuteSourceType,
  MoveComponent,
  OvenComponent,
  PasteComponent,
  RemoveOvenComponent,
  ResizeOvenSpace,
  SelectOvenComponent,
  UpdateProperties
} from '@common';

import {
  canRemoveSpace,
  getActiveComponent,
  getActiveComponentIdList,
  getActiveComponentList,
  getComponentList,
  getComponentMap,
  getNearestSiblingOrParentComponentId,
  getParentListComponent,
  getSubComponentIds,
  getSubComponentIdsList,
  getUiDataSourceComponents
} from '@tools-state/component/component.selectors';
import { VariableRenameService } from '@tools-state/data/variable-rename.service';
import { FeatureActions } from '@root-state/feature/feature.actions';
import { isLayoutElement, isSpace } from '@tools-state/component/utils';
import { LayoutFacade } from '@tools-state/layout/layout-facade.service';
import { DivideSpaceService } from '@tools-state/component/divide-space.service';
import { ComponentNameService } from '@tools-state/component/component-name.service';
import { Slot } from '@tools-state/slot/slot.model';
import { getSlotParent } from '@tools-state/slot/slot.selectors';
import { ClipboardActions } from '@tools-state/clipboard/clipboard.actions';
import { HistoryFacadeService } from '@tools-state/history/history-facade.service';
import { HistoryActions } from '@tools-state/history/history.actions';
import { ProjectActions } from '@tools-state/project/project.actions';
import { WorkingAreaActions } from '@tools-state/working-area/working-area.actions';
import { SlotActions } from '@tools-state/slot/slot.actions';
import { ComponentActions } from '@tools-state/component/component.actions';
import { BakeryComponent, BakeryComponentUpdate } from '@tools-state/component/component.model';
import { DynamicSlotsHelper } from '@tools-state/component/dynamic-slots/dynamic-slots.helper';
import { CommunicationService } from '@shared/communication/communication.service';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { fromTools } from '../tools.reducer';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { ToastrService } from '@shared/toastr/toastr.service';
import { AppModelVersionService } from '@shared/app-model-version.service';

interface CanRemoveComponent {
  canRemove: boolean;
  component: BakeryComponent;
}

@Injectable({ providedIn: 'root' })
export class ComponentFacade {
  readonly activeComponent$: Observable<BakeryComponent> = this.store.pipe(select(getActiveComponent));

  readonly componentList$: Observable<BakeryComponent[]> = this.store.pipe(select(getComponentList));

  readonly dataComponentList$: Observable<BakeryComponent[]> = this.store.pipe(select(getUiDataSourceComponents));

  private listenCommunicationUntil: Subject<void> = new Subject();

  constructor(
    private store: Store<fromTools.State>,
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
    private toastrService: ToastrService
  ) {
  }

  attach() {
    this.communication.addComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((addOvenComponent: AddOvenComponent) => this.addComponent(addOvenComponent));

    this.communication.selectComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: SelectOvenComponent) => this.selectComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.removeComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: RemoveOvenComponent) => this.removeComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.removeActiveComponents$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => this.removeActiveComponents(ExecuteSourceType.WorkingArea));

    this.communication.updateComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: UpdateProperties) => this.updateOvenComponent(data));

    this.communication.resizeSpace$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: ResizeOvenSpace) => this.resizeSpace(data));

    this.communication.commitResizeSpace$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(({ stickMode }) => this.commitResizeSpace(stickMode));

    this.communication.divideSpace$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: DivideSpace) => this.divideSpace(data));

    this.communication.copy$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => this.store.dispatch(new ClipboardActions.Copy()));

    this.communication.paste$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: PasteComponent) => this.store.dispatch(new ClipboardActions.Paste(data)));

    this.communication.cut$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => this.store.dispatch(new ClipboardActions.Cut()));

    this.communication.undo$.pipe(takeUntil(this.listenCommunicationUntil)).subscribe(() => this.historyFacade.back());

    this.communication.redo$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => this.historyFacade.forward());

    this.communication.clearClipboard$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe(() => this.store.dispatch(new ClipboardActions.Clear()));

    this.communication.moveComponent$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: MoveComponent) => this.moveComponent(data, ExecuteSourceType.WorkingArea));

    this.communication.thumbnail$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((image: string) => this.store.dispatch(new ProjectActions.PersistThumbnail(image)));

    this.communication.accessFeature$
      .pipe(takeUntil(this.listenCommunicationUntil))
      .subscribe((data: AccessFeature) => this.store.dispatch(FeatureActions.accessFeature(data)));

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

  updateComponent(update: BakeryComponentUpdate) {
    combineLatest([
      this.variableRenameService.getRenameActionsIfNeeded(update),
      this.variableRenameService.getRenameActionsForSmartTableIfNeeded(update),
      this.dynamicSlotsHelper.getSyncSlotActionsIfNeeded(update)
    ]).subscribe(([renameActions, renamePropsActions, syncSlotActions]: [Action[], Action[], Action[]]) => {
      const actionsToExecute = [
        ...renameActions,
        ...renamePropsActions,
        ...syncSlotActions,
        new ComponentActions.UpdateComponent(update),
        new WorkingAreaActions.SyncState(),
        new ProjectActions.UpdateProject(),
        new HistoryActions.Persist()
      ];
      actionsToExecute.forEach((action: Action) => this.store.dispatch(action));
    });
  }

  isRootComponent(component: BakeryComponent): Observable<boolean> {
    return this.store.pipe(
      select(getSlotParent, component.parentSlotId),
      map((parent: BakeryComponent) => {
        // No parent, it's a root space
        if (!parent) {
          return true;
        }

        // It's a root space for some slot
        return parent.definitionId !== 'space';
      })
    );
  }

  selectComponentById(component: OvenComponent, source: ExecuteSourceType): void {
    this.analytics.logSelectComponent(component.definitionId, source);
    this.store.dispatch(new ComponentActions.SelectComponent([component.id]));
    this.store.dispatch(new HistoryActions.Persist());
  }

  setHoveredComponent(id: string): void {
    this.store.dispatch(new ComponentActions.HoveredComponent(id));
  }

  findParentListComponent(componentId: string): Observable<BakeryComponent[]> {
    return this.store.pipe(select(getParentListComponent, componentId));
  }

  private updateOvenComponent(update: UpdateProperties) {
    this.updateComponent({
      id: update.id,
      changes: {
        properties: update.properties
      }
    });
  }

  private addComponent(addOvenComponent: AddOvenComponent) {
    this.logAddComponent(addOvenComponent);

    const component: BakeryComponent = this.createComponent(addOvenComponent);
    const subEntities: { slots: Slot[]; components: BakeryComponent[] } = this.stateConverter.getSubEntities(
      addOvenComponent.component
    );

    this.componentNameService
      .addComponentIndexIfNeeded([component, ...subEntities.components])
      .subscribe((componentList: BakeryComponent[]) => {
        this.store.dispatch(
          new ComponentActions.ShiftForwardAfterComponent(addOvenComponent.parentSlotId, component.index, 1)
        );
        this.store.dispatch(new ComponentActions.AddComponentList(componentList));
        this.store.dispatch(new SlotActions.AddSlotList(subEntities.slots));
        this.store.dispatch(new WorkingAreaActions.SyncState());
        this.store.dispatch(new ComponentActions.SelectComponent([component.id]));
        this.store.dispatch(new ProjectActions.UpdateProject());
        this.store.dispatch(new HistoryActions.Persist());
      });
  }

  public moveComponent(data: MoveComponent, source: ExecuteSourceType) {
    this.analytics.logDragAndDrop(data.component.definitionId, source);
    this.store.dispatch(new ComponentActions.MoveComponent(data.component.id, data.parentSlotId, data.position));
  }

  private removeComponent(data: RemoveOvenComponent, source: ExecuteSourceType) {
    if (isLayoutElement(data.component)) {
      return this.removeLayoutElement(data.component);
    }

    this.logRemoveComponent(data, source);

    this.store
      .pipe(
        select(getSubComponentIds, { componentIdList: [data.component.id], slotIdList: [] }),
        take(1),
        combineWith(({ componentIdList, slotIdList }) => {
          return this.store.pipe(select(getNearestSiblingOrParentComponentId, { componentIdList }));
        }),
        withLatestFrom(
          this.divideSpaceService.updateParentContainerOnDelete(data.parentSlotId, data.component.definitionId)
        )
      )
      .subscribe(
        ([[idsToRemove, componentToSelectId], updateParentAction]: [
          [{ componentIdList: string[]; slotIdList: string[] }, string],
          Action,
        ]) => {
          if (updateParentAction) {
            this.store.dispatch(updateParentAction);
          }
          this.store.dispatch(new ComponentActions.RemoveComponentList(idsToRemove.componentIdList));
          this.store.dispatch(new SlotActions.RemoveSlotList(idsToRemove.slotIdList));
          this.store.dispatch(new WorkingAreaActions.SyncState());
          this.store.dispatch(new ComponentActions.SelectComponent([componentToSelectId]));
          this.store.dispatch(new ProjectActions.UpdateProject());
          this.store.dispatch(new HistoryActions.Persist());
        }
      );
  }

  public removeActiveComponents(source: ExecuteSourceType) {
    this.store
      .pipe(
        select(getActiveComponentList),
        take(1),
        map((componentList: BakeryComponent[]) => {
          const layoutElement: BakeryComponent = componentList.find(c => isLayoutElement(c));
          const components: BakeryComponent[] = componentList.filter(c => !isLayoutElement(c));
          this.removeLayoutElement(layoutElement);
          return components;
        }),
        switchMap((componentList: BakeryComponent[]) => {
          return forkJoin(
            componentList.map((c: BakeryComponent) =>
              iif(() => isSpace(c), this.canRemoveSlot(c), of({ canRemove: true, component: c }))
            )
          );
        }),
        map((tuples: CanRemoveComponent[]) => {
          return tuples.filter(t => t.canRemove).map(t => t.component);
        }),
        filter((componentList: BakeryComponent[]) => !!componentList.length),
        combineWith((componentList: BakeryComponent[]) => {
          const removeList = componentList.map((c: BakeryComponent) => ({
            componentIdList: [c.id],
            slotIdList: []
          }));

          this.logRemoveComponentsList(componentList, source);
          return this.store.pipe(select(getSubComponentIdsList, removeList));
        }),
        combineWith(([_componentList, idsToRemove]: [BakeryComponent[], any]) => {
          const componentIdList: string[] = [];

          for (const ids of idsToRemove) {
            componentIdList.push(...ids.componentIdList);
          }

          return this.store.pipe(select(getNearestSiblingOrParentComponentId, { componentIdList }));
        })
      )
      .subscribe(
        ([[_componentList, idsToRemove], componentToSelectId]: [
          [BakeryComponent[], { componentIdList: string[]; slotIdList: string[] }[]],
          string,
        ]) => {
          idsToRemove.forEach(removeData => {
            this.store.dispatch(new ComponentActions.RemoveComponentList(removeData.componentIdList));
            this.store.dispatch(new SlotActions.RemoveSlotList(removeData.slotIdList));
          });
          this.store.dispatch(new WorkingAreaActions.SyncState());
          this.store.dispatch(new ComponentActions.SelectComponent([componentToSelectId]));
          this.store.dispatch(new ProjectActions.UpdateProject());
          this.store.dispatch(new HistoryActions.Persist());
        }
      );
  }

  private resizeSpace(data: ResizeOvenSpace) {
    this.store.pipe(take(1), select(getSelectedBreakpoint)).subscribe((breakpoint: Breakpoint) => {
      const resize = [{ id: data.component.id, width: data.width, height: data.height }];
      this.store.dispatch(new ComponentActions.ResizeSpaces(resize, breakpoint));
    });
  }

  private commitResizeSpace(stickMode: boolean) {
    this.analytics.logResizeSpace(stickMode);

    this.store.dispatch(new ProjectActions.UpdateProject());
    this.store.dispatch(new WorkingAreaActions.SyncState());
    this.store.dispatch(new HistoryActions.Persist());
  }

  private divideSpace(data: DivideSpace) {
    this.divideSpaceService.divide(data);
    this.analytics.logDivideSpace(data.type);
  }

  private selectComponent(data: SelectOvenComponent, source: ExecuteSourceType) {
    if (!data) {
      return;
    }

    this.analytics.logSelectComponent(data.component.definitionId, source);

    if (data.multi) {
      combineLatest([this.store.pipe(select(getComponentMap)), this.store.pipe(select(getActiveComponentIdList))])
        .pipe(take(1))
        .subscribe(([entities, oldIdList]: [Dictionary<BakeryComponent>, string[]]) => {
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
            (id: string) => entities[id].definitionId !== 'sidebar' && entities[id].definitionId !== 'header'
          );

          this.store.dispatch(new ComponentActions.SelectComponent(idList));
          this.store.dispatch(new HistoryActions.Persist());
        });
    } else {
      this.store.dispatch(new ComponentActions.SelectComponent([data.component.id]));
      this.store.dispatch(new HistoryActions.Persist());
    }
  }

  private createComponent(addOvenComponent: AddOvenComponent): BakeryComponent {
    return {
      id: addOvenComponent.component.id,
      definitionId: addOvenComponent.component.definitionId,
      parentSlotId: addOvenComponent.parentSlotId,
      styles: addOvenComponent.component.styles,
      properties: addOvenComponent.component.properties,
      actions: addOvenComponent.component.actions,
      index: addOvenComponent.index
    };
  }

  private logAddComponent(addOvenComponent: AddOvenComponent) {
    if (isSpace(addOvenComponent.component)) {
      this.analytics.logAddSpace();
    } else if (addOvenComponent.widgetName) {
      this.analytics.logAddComponent(addOvenComponent.widgetName, true);
    } else {
      this.analytics.logAddComponent(addOvenComponent.component.definitionId);
    }
  }

  private logRemoveComponent(data: RemoveOvenComponent, source: ExecuteSourceType) {
    if (isSpace(data.component)) {
      this.analytics.logRemoveSpace(source);
    } else {
      this.analytics.logRemoveComponent(data.component.definitionId, source);
    }
  }

  private logRemoveComponentsList(list: BakeryComponent[], source: ExecuteSourceType) {
    if (list.length > 1) {
      this.analytics.logRemoveComponentsList(list.map((component: BakeryComponent) => component.definitionId));
    } else {
      this.analytics.logRemoveComponent(list[0].definitionId, source);
    }
  }

  private removeLayoutElement(layoutElement: OvenComponent) {
    if (layoutElement) {
      this.layoutFacade.removeLayoutComponent(layoutElement.definitionId);
    }
  }

  private canRemoveSlot(space: BakeryComponent): Observable<CanRemoveComponent> {
    return this.store.pipe(
      select(canRemoveSpace, space.id),
      take(1),
      tap(canRemove => {
        if (!canRemove) {
          this.toastrService.danger('This Space is a Root Space and can’t be deleted.', {
            preventDuplicates: true,
            limit: 3
          });
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
