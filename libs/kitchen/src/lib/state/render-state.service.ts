import { Injectable } from '@angular/core';
import {
  ActiveSetting, AddKitchenComponent, BreakpointWidth, DivideSpaceType, Feature, KitchenApp, KitchenComponent,
  KitchenPage, KitchenSettings,
  KitchenUserNotifications, MessageAction, PasteComponent, SpaceHeight, SpaceWidth, SyncMsg
} from '@common/public-api';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { MetaDefinition } from '../definitions/definition';

import { FlourComponent } from '../model';
import { MessageFactoryService } from '../util/message-factory.service';
import { KitchenState } from './kitchen-state.service';

/**
 * Serves as a state for the kitchen library.
 * Provides functionality to perform state mutations.
 * */
@Injectable(/*{ providedIn: 'root' }*/)
export class RenderState {
  readonly syncMsg$: Observable<SyncMsg>                            = this.kitchenState.syncMsgCompiled$;
  readonly app$: Observable<KitchenApp>                             = this.syncMsg$.pipe(pluck('state'));
  readonly activePage$: Observable<KitchenPage>                     = this.kitchenState.activePage$;
  readonly showDevUI$: Observable<boolean>                          = this.kitchenState.showDevUI$;
  readonly privileges$: Observable<string[]>                        = this.kitchenState.privileges$;
  readonly activeBreakpoint$: Observable<BreakpointWidth>           = this.kitchenState.activeBreakpoint$;
  readonly activeComponentIdList$: Observable<string[]>             = this.kitchenState.activeComponentIdList$;
  readonly hoveredComponentId$: Observable<string>                  = this.kitchenState.hoveredComponentId$;
  readonly activeSetting$: Observable<ActiveSetting>                = this.kitchenState.activeSetting$;
  readonly settings$: Observable<KitchenSettings>                   = this.kitchenState.settings$;
  readonly userNotifications$: Observable<KitchenUserNotifications> = this.kitchenState.userNotifications$;


  // readonly containerClipPath$ = this.kitchenState.previewContainerElement$.pipe(
  //   map((container: HTMLElement): string => {
  //     const rect = container.getBoundingClientRect();
  //     return `polygon(${rect.left}px ${rect.top}px, ${rect.right}px ${rect.top}px, ${rect.right}px ${rect.bottom}px, ${rect.left}px ${rect.bottom}px)`;
  //   })
  // );

  private readonly breadcrumbsHighlightedComponent = new Subject<FlourComponent>();

  readonly breadcrumbsHighlightedComponent$: Observable<FlourComponent> = this.breadcrumbsHighlightedComponent.asObservable();

  private readonly closeCalculator            = new Subject<void>();
  readonly closeCalculator$: Observable<void> = this.closeCalculator.asObservable();

  // We need to disable dev-ui during resizing to remove blinking
  readonly highlightEnabled$ = new BehaviorSubject<boolean>(true);

  private readonly parentComponentHighlightDuringResize: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly componentsWithPaddingsToHighlight$: Observable<string[]>              = combineLatest([
    this.activeComponentIdList$,
    this.parentComponentHighlightDuringResize.asObservable()
  ]).pipe(
    map(([activeComponents, parentComponentHighlightDuringResize]) => {
      return parentComponentHighlightDuringResize ? [parentComponentHighlightDuringResize] : activeComponents;
    })
  );

  i = -1;
  constructor(private kitchenState: KitchenState, private messageFactoryService: MessageFactoryService) {
    if (this.i > 0) {
      throw new Error('RenderState is singleton');
    }
  }

  highlightBreadcrumb(vc: FlourComponent) {
    this.breadcrumbsHighlightedComponent.next(vc);
  }

  closeCalculatorPopover() {
    this.closeCalculator.next();
  }

  cloneSpace(virtualComponent: FlourComponent, definition: MetaDefinition, index: number,
             prototype: KitchenComponent) {
    // const addKitchenComponent = this.messageFactoryService.createSpaceFromPrototype(
    //   virtualComponent,
    //   definition,
    //   index,
    //   prototype
    // );
    // this.kitchenState.emitMessage(MessageAction.ADD_COMPONENT, addKitchenComponent);
  }

  addComponentToSlot(virtualComponent: FlourComponent, definition: MetaDefinition) {
    const addKitchenComponent = this.messageFactoryService.createComponent(virtualComponent, definition);
    this.kitchenState.emitMessage(MessageAction.ADD_COMPONENT, addKitchenComponent);
  }

  remove(virtualComponent: FlourComponent) {
    const removeComponentMessage = this.messageFactoryService.removeComponent(virtualComponent);
    this.kitchenState.emitMessage(MessageAction.REMOVE_COMPONENT, removeComponentMessage);
  }

  divideSpaceComponent(virtualComponent: FlourComponent, type: DivideSpaceType) {
    this.kitchenState.emitMessage(MessageAction.DIVIDE_SPACE, { id: virtualComponent.component.id, type });
  }

  select(virtualComponent: FlourComponent, multi: boolean) {
    const idList = this.kitchenState.activeComponentIdList.getValue();
    // do not allow to be selected zero components
    if (idList.length === 1 && idList[0] === virtualComponent.component.id) {
      return;
    }
    this.kitchenState.emitMessage(MessageAction.SELECT_COMPONENT, {
      component: virtualComponent.component, multi
    });
  }

  setHoveredComponent(id: string) {
    this.kitchenState.setHoveredComponent(id);
  }

  update(id: string, properties: { [key: string]: any }) {
    this.kitchenState.emitMessage(MessageAction.UPDATE_BINDINGS, { id, properties });
  }

  access(type: Feature, element?: string) {
    this.kitchenState.emitMessage(MessageAction.ACCESS_FEATURE, { feature: type, element });
  }

  resize(virtualComponent: FlourComponent, width: SpaceWidth, height: SpaceHeight) {
    this.kitchenState.emitMessage(MessageAction.RESIZE_SPACE, { component: virtualComponent.component, width, height });
  }

  commitResize(stickMode: boolean) {
    this.kitchenState.emitMessage(MessageAction.COMMIT_RESIZE_SPACE, { stickMode });
  }

  move(virtualComponent: FlourComponent, parentSlotId: string, position: number) {
    const moveMessage = {
      component: virtualComponent.component,
      parentSlotId,
      position
    };
    this.kitchenState.emitMessage(MessageAction.MOVE_COMPONENT, moveMessage);
  }

  moveItemInArray(moveMessage: {
    component: KitchenComponent,
    currentContainer?: any,
    parentSlotId: string,
    currentIndex: number,
    targetIndex: number,
  }) {
    this.kitchenState.emitMessage(MessageAction.MOVE_ITEM_IN_ARRAY, moveMessage);
  }

  transferArrayItem(moveMessage: {
    component: KitchenComponent,
    currentContainer: string,
    targetContainer: string,
    currentIndex: number,
    targetIndex: number,
  }) {
    this.kitchenState.emitMessage(MessageAction.TRANSFER_ARRAY_ITEM, moveMessage);
  }

  addItem(moveMessage: {
    component: KitchenComponent,
    parentSlotId: string,
    index: number,
  }) {
    this.kitchenState.emitMessage<AddKitchenComponent>(MessageAction.ADD_COMPONENT, moveMessage);
  }

  copy() {
    this.kitchenState.emitMessage(MessageAction.COPY);
  }

  paste(data: PasteComponent) {
    this.kitchenState.emitMessage(MessageAction.PASTE, data);
  }

  cut() {
    this.kitchenState.emitMessage(MessageAction.CUT);
  }

  incViewedResizeAltStick(): void {
    this.kitchenState.emitMessage(MessageAction.INC_VIEWED_RESIZE_ALT_STICK_NOTIFICATION);
  }

  highlightComponentPaddings(componentId: string): void {
    this.parentComponentHighlightDuringResize.next(componentId);
    if (componentId) {
      this.kitchenState.setActiveSetting('padding');
    } else {
      this.kitchenState.setActiveSetting(null);
    }
  }
}
