import { ComponentRef, Directive, EventEmitter, Injector, Input, Output, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KitchenPage, KitchenSlot, SyncMsg } from '@common/public-api';
import { moveItemInArray, TriDragContainer, DragDropRegistry, ɵTriDropContainer } from '@gradii/triangle/dnd';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { DevUIStateService } from '../dev-ui';
import { FlourComponent } from '../model';
import { CodeGenVisitor } from '../runtime/code-gen-visitor';
import { getComponentHelper } from '../runtime/get-component.helper';
import { RuntimeDirective } from '../runtime/runtime.directive';
import { KitchenState } from '../state/kitchen-state.service';
import { RenderState } from '../state/render-state.service';
import { SyncPage } from './page.component';

declare const ngDevMode: boolean;

@Directive({
  selector : 'kitchen-page2',
  providers: [
  ]
})
export class KitchenPage2Component {
  componentRef: ComponentRef<any>;

  private destroyed = new Subject<void>();

  private page$: Observable<SyncPage> = combineLatest([
    this.renderState.syncMsg$, this.route.data
  ]).pipe(
    takeUntil(this.destroyed),
    map(([{ state, syncReason }, routePage]: [SyncMsg, KitchenPage]) => {
      const pagesToSearch = [...state.pageList];
      for (const page of pagesToSearch) {
        if (page.id === '1') {
          return { page, syncReason, state };
        }
        pagesToSearch.push(...page.pageList);
      }
    }),
    filter((m: SyncPage) => m && !!m.page),
  );

  @Output()
  transferArrayItem: EventEmitter<{
    component: any,
    currentContainer: any,
    targetContainer: any,
    currentIndex: number,
    targetIndex: number
  }> = new EventEmitter();

  @Output()
  moveItemInArray: EventEmitter<{
    component: any,
    currentContainer: any,
    currentIndex: number,
    targetIndex: number
  }> = new EventEmitter();

  activeComponentIdList: string[] = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private stateConverterService: StateConverterService,
    private injector: Injector,
    private route: ActivatedRoute,
    private devUIStateService: DevUIStateService,
    private renderState: RenderState,
    private kitchenState: KitchenState
  ) {
  }

  ngOnInit(): void {
    // this.init();
  }

  ngAfterViewInit() {
    this.page$.subscribe(({ page, syncReason }: SyncPage) => {
      // console.log(JSON.stringify(page.slots));
      // this.kitchenState.setActiveComponentIdList()
      this.activeComponentIdList = this.kitchenState.activeComponentIdList.getValue();
      this.kitchenState.setActiveComponentIdList([]);
      this.outputComponent(page.slots);
    });
  }

  getComponent(template: string) {
    const { Component } = getComponentHelper(template);
    return Component;
  }

  createComponent(template: string, type: string) {
    // console.info(template);


    const Comp = this.getComponent(template);
    // setScopeOnDeclaredComponents(ButtonModule, Comp);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    this.componentRef = this.viewContainerRef.createComponent(Comp, {injector: this.injector});


    // @ts-ignore
    this.componentRef.instance.text = type;
    this.componentRef.instance.slotChange.pipe(
      takeUntil(this.destroyed),
      tap((transferData: {
        transferArrayItem?: {
          dragItem: any,
          dropContainer: ɵTriDropContainer,
          dragData: any,
          dropData: any,
          currentContainer: any,
          targetContainer: any,
          currentIndex: number,
          targetIndex: number
        },
        moveItemInArray?: {
          dragItem: any,
          dragData: any,
          currentContainer: any,
          currentIndex: number,
          targetIndex: number
        },
      }) => {
        if (transferData.transferArrayItem) {
          const {
                  dragItem,
                  dropContainer,
                  dragData,
                  currentContainer, targetContainer,
                  currentIndex, targetIndex
                }           = transferData.transferArrayItem;
          const element     = dragItem._dragRef.getRootElement();
          const dropElement = dropContainer.element.nativeElement;

          if (!(dragItem.dropContainer instanceof TriDragContainer)) {
            this._domPolyfillTransferArrayItem(element, dropElement, currentIndex, targetIndex);
            // this.renderState.transferArrayItem({
            //   component: dragData,
            //   currentContainer,
            //   targetContainer,
            //   currentIndex,
            //   targetIndex
            // });

          }else {
            // const addKitchenComponent = dragData.factory();
            // addKitchenComponent.parentSlotId = targetContainer.slotId;
            // this.renderState.addItem({
            //   component: addKitchenComponent,
            //   parentSlotId: targetContainer.slotId,
            //   index: targetIndex
            // })
          }

          this.transferArrayItem.emit({
            component: dragData,
            currentContainer,
            targetContainer,
            currentIndex,
            targetIndex
          });

        } else if (transferData.moveItemInArray) {
          const {
                  dragItem,
                  dragData,
                  currentContainer, currentIndex, targetIndex
                } = transferData.moveItemInArray;

          const element = dragItem._dragRef.getRootElement();
          this._domPolyfillMoveItemInArray(element, currentIndex, targetIndex);

          this.moveItemInArray.emit({
            component       : dragData,
            currentContainer: currentContainer,
            currentIndex,
            targetIndex
          });

          // this.renderState.moveItemInArray({
          //   component       : dragData,
          //   currentContainer: currentContainer,
          //   parentSlotId    : dragData.parentSlotId,
          //   currentIndex,
          //   targetIndex
          // });

        }
      })
    ).subscribe();

    this.componentRef.instance.ready.pipe(
      take(1),
      tap(() => {
        const instance = this.componentRef.instance;

        const updates = instance.flourComponents.toArray();

        const buildComponentTree = (item: RuntimeDirective | null)/*: FlourComponent*/ => {
          if (item == null) {
            return null;
          }
          return {
            htmlElement    : item.elementRef.nativeElement,
            index          : -1,
            parentSlot     : null,
            component      : {
              definitionId: item.definitionId,
              id          : item.componentId,
              properties: {}
            },
            parentComponent: buildComponentTree(item.parent)
          };
        };

        this.devUIStateService.setFlourComponents({
          virtualComponents: new Map<string, FlourComponent>(updates.map(it => [
              it.componentId,
              buildComponentTree(it)
            ])
          ),
          updates          : updates
        });

        this.kitchenState.setActiveComponentIdList(this.activeComponentIdList);
        this.activeComponentIdList = [];
      })
    ).subscribe();


    this.componentRef.changeDetectorRef.detectChanges();
    this.viewContainerRef.insert(this.componentRef.hostView);
    // });
  }

  /**
   * @param element
   * @param targetContainer
   * @param currentIndex
   * @param targetIndex
   */
  _domPolyfillTransferArrayItem(element: HTMLElement, targetContainer: HTMLElement,
                                currentIndex: number, targetIndex: number) {
    const insertBeforeElement = targetContainer.children[targetIndex];
    if (insertBeforeElement) {
      targetContainer.insertBefore(element, insertBeforeElement);
    } else {
      // single one appendChild will cause animation. since no text node, it's safe to use appendChild
      // targetContainer.appendChild(element);
      Array.from(targetContainer.children).forEach(child => {
        targetContainer.appendChild(child);
      });
      targetContainer.appendChild(element);
    }
  }

  /**
   *
   * @param element
   * @param currentIndex
   * @param targetIndex
   */
  _domPolyfillMoveItemInArray(element: HTMLElement, currentIndex: number, targetIndex: number) {
    if (element.parentElement) {
      const parent = element.parentElement;
      const list   = Array.from(parent.children);

      // single one appendChild will cause animation. since no text node, it's safe to use appendChild
      moveItemInArray(list, currentIndex, targetIndex);
      list.forEach(it => {
        parent.appendChild(it);
      });
    } else if (ngDevMode) {
      // tslint:disable-next-line:no-console
      throw new Error('element parent is not exist');
    }
  }

  outputComponent(data: { content: KitchenSlot }) {
    const visitor = new CodeGenVisitor();
    const slot    = data.content;

    const elementNode = visitor.visitElement(slot);

    const output = visitor.getElementOutput([elementNode]);

    console.log(output);
    this.createComponent(
      '<div triDropContainerGroup>' + output + '</div>',
      'success'
    );
  }
}
