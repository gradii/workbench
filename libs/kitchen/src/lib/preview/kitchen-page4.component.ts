import {
  ComponentRef, Directive, EventEmitter, Injector, Input, NgZone, Output, ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KitchenSlot } from '@common/public-api';
import { moveItemInArray, TriDragContainer, ɵTriDropContainer } from '@gradii/triangle/dnd';
import { StateConverterService } from '@shared/communication/state-converter.service';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { DevUIStateService } from '../dev-ui';
import { FlourComponent } from '../model';
import { CodeGenVisitor } from '../runtime/code-gen-visitor';
import { getComponentHelper } from '../runtime/get-component.helper';
import { RuntimeDirective } from '../runtime/runtime.directive';

declare const ngDevMode: boolean;

@Directive({
  selector : 'kitchen-page4',
  providers: []
})
export class KitchenPage4Component {

  componentRef: ComponentRef<any>;

  private _pageData: { content: KitchenSlot };

  destroy$ = new Subject();

  @Input()
  get pageData(): { content: KitchenSlot } {
    return this._pageData;
  }

  set pageData(value: { content: KitchenSlot }) {

    this._pageData = value;
    this.outputComponent(value);
  }

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

  // @Output()
  // readyState = new EventEmitter();

  @Output()
  private dropContainersChange: EventEmitter<ɵTriDropContainer[]> = new EventEmitter<ɵTriDropContainer[]>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private stateConverterService: StateConverterService,
    private injector: Injector,
    private route: ActivatedRoute,
    private devUIStateService: DevUIStateService,
    private _ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
  }

  getComponent(template: string) {
    const { Component } = getComponentHelper(template);
    return Component;
  }

  createComponent(template: string, type: string) {
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
      takeUntil(this.destroy$),
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
          }

          this.transferArrayItem.emit({
            component: dragData,
            currentContainer,
            targetContainer,
            currentIndex,
            targetIndex
          });
          // this.renderState.transferArrayItem({
          //   component: dragData,
          //   currentContainer,
          //   targetContainer,
          //   currentIndex,
          //   targetIndex
          // });
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
      tap(({ flourComponents, dropContainerGroup }) => {
        setTimeout(() => {
          this.dropContainersChange.emit(Array.from(dropContainerGroup._items));
        })
      }),
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

    console.log(elementNode);
    const output = visitor.getElementOutput([elementNode]);

    console.log(output);
    this.createComponent(
      '<div triDropContainerGroup>' + output + '</div>',
      'success'
    );
  }

  ngAfterViewInit() {
    this.destroy$.complete();
  }

}
