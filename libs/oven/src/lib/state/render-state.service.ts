import { Injectable } from '@angular/core';
import {
  ActiveSetting,
  BreakpointWidth,
  DivideSpaceType,
  Feature,
  MessageAction,
  OvenApp,
  OvenComponent,
  OvenPage,
  OvenSettings,
  OvenUserNotifications,
  PasteComponent,
  SpaceHeight,
  SpaceWidth,
  SyncMsg
} from '@common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { MetaDefinition } from '../definitions/definition';

import { VirtualComponent } from '../model';
import { MessageFactoryService } from '../util/message-factory.service';
import { OvenState } from './oven-state.service';

/**
 * Serves as a state for the oven library.
 * Provides functionality to perform state mutations.
 * */
@Injectable({ providedIn: 'root' })
export class RenderState {
  readonly syncMsg$: Observable<SyncMsg> = this.ovenState.syncMsgCompiled$;
  readonly app$: Observable<OvenApp> = this.syncMsg$.pipe(pluck('state'));
  readonly activePage$: Observable<OvenPage> = this.ovenState.activePage$;
  readonly showDevUI$: Observable<boolean> = this.ovenState.showDevUI$;
  readonly privileges$: Observable<string[]> = this.ovenState.privileges$;
  readonly activeBreakpoint$: Observable<BreakpointWidth> = this.ovenState.activeBreakpoint$;
  readonly activeComponentIdList$: Observable<string[]> = this.ovenState.activeComponentIdList$;
  readonly hoveredComponentId$: Observable<string> = this.ovenState.hoveredComponentId$;
  readonly activeSetting$: Observable<ActiveSetting> = this.ovenState.activeSetting$;
  readonly settings$: Observable<OvenSettings> = this.ovenState.settings$;
  readonly userNotifications$: Observable<OvenUserNotifications> = this.ovenState.userNotifications$;

  private readonly breadcrumbsHighlightedComponent = new Subject<VirtualComponent>();
  readonly breadcrumbsHighlightedComponent$: Observable<VirtualComponent> = this.breadcrumbsHighlightedComponent.asObservable();

  private readonly closeCalculator = new Subject<void>();
  readonly closeCalculator$: Observable<void> = this.closeCalculator.asObservable();

  // We need to disable dev-ui during resizing to remove blinking
  readonly highlightEnabled$ = new BehaviorSubject<boolean>(true);

  private readonly parentComponentHighlightDuringResize: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly componentsWithPaddingsToHighlight$: Observable<string[]> = combineLatest([
    this.activeComponentIdList$,
    this.parentComponentHighlightDuringResize.asObservable()
  ]).pipe(
    map(([activeComponents, parentComponentHighlightDuringResize]) => {
      return parentComponentHighlightDuringResize ? [parentComponentHighlightDuringResize] : activeComponents;
    })
  );

  constructor(private ovenState: OvenState, private messageFactoryService: MessageFactoryService) {
  }

  highlightBreadcrumb(vc: VirtualComponent) {
    this.breadcrumbsHighlightedComponent.next(vc);
  }

  closeCalculatorPopover() {
    this.closeCalculator.next();
  }

  cloneSpace(virtualComponent: VirtualComponent, definition: MetaDefinition, index: number, prototype: OvenComponent) {
    const addOvenComponent = this.messageFactoryService.createSpaceFromPrototype(
      virtualComponent,
      definition,
      index,
      prototype
    );
    this.ovenState.emitMessage(MessageAction.ADD_COMPONENT, addOvenComponent);
  }

  addComponentToSlot(virtualComponent: VirtualComponent, definition: MetaDefinition) {
    const addOvenComponent = this.messageFactoryService.createComponent(virtualComponent, definition);
    this.ovenState.emitMessage(MessageAction.ADD_COMPONENT, addOvenComponent);
  }

  remove(virtualComponent: VirtualComponent) {
    const removeComponentMessage = this.messageFactoryService.removeComponent(virtualComponent);
    this.ovenState.emitMessage(MessageAction.REMOVE_COMPONENT, removeComponentMessage);
  }

  divideSpaceComponent(virtualComponent: VirtualComponent, type: DivideSpaceType) {
    this.ovenState.emitMessage(MessageAction.DIVIDE_SPACE, { id: virtualComponent.component.id, type });
  }

  select(virtualComponent: VirtualComponent, multi: boolean) {
    const idList = this.ovenState.activeComponentIdList.getValue();
    // do not allow to be selected zero components
    if (idList.length === 1 && idList[0] === virtualComponent.component.id) {
      return;
    }
    this.ovenState.emitMessage(MessageAction.SELECT_COMPONENT, { component: virtualComponent.component, multi });
  }

  setHoveredComponent(id: string) {
    this.ovenState.setHoveredComponent(id);
  }

  update(id: string, properties: { [key: string]: any }) {
    this.ovenState.emitMessage(MessageAction.UPDATE_BINDINGS, { id, properties });
  }

  access(type: Feature, element?: string) {
    this.ovenState.emitMessage(MessageAction.ACCESS_FEATURE, { feature: type, element });
  }

  resize(virtualComponent: VirtualComponent, width: SpaceWidth, height: SpaceHeight) {
    this.ovenState.emitMessage(MessageAction.RESIZE_SPACE, { component: virtualComponent.component, width, height });
  }

  commitResize(stickMode: boolean) {
    this.ovenState.emitMessage(MessageAction.COMMIT_RESIZE_SPACE, { stickMode });
  }

  move(virtualComponent: VirtualComponent, parentSlotId: string, position: number) {
    const moveMessage = {
      component: virtualComponent.component,
      parentSlotId,
      position
    };
    this.ovenState.emitMessage(MessageAction.MOVE_COMPONENT, moveMessage);
  }

  copy() {
    this.ovenState.emitMessage(MessageAction.COPY);
  }

  paste(data: PasteComponent) {
    this.ovenState.emitMessage(MessageAction.PASTE, data);
  }

  cut() {
    this.ovenState.emitMessage(MessageAction.CUT);
  }

  incViewedResizeAltStick(): void {
    this.ovenState.emitMessage(MessageAction.INC_VIEWED_RESIZE_ALT_STICK_NOTIFICATION);
  }

  highlightComponentPaddings(componentId: string): void {
    this.parentComponentHighlightDuringResize.next(componentId);
    if (componentId) {
      this.ovenState.setActiveSetting('padding');
    } else {
      this.ovenState.setActiveSetting(null);
    }
  }
}
