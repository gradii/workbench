import { NgClass, NgForOf } from '@angular/common';
import {
  EventEmitter, Injectable, QueryList, ɵɵFactoryTarget, ɵɵngDeclareComponent, ɵɵngDeclareFactory
} from '@angular/core';
import { ButtonComponent } from '@gradii/triangle/button';
import {
  CardComponent, TriCardBodyComponent, TriCardFooterComponent, TriCardHeaderComponent
} from '@gradii/triangle/card';
import { CheckboxComponent } from '@gradii/triangle/checkbox';
import {
  TriDrag, TriDragDrop, TriDropContainerGroup, TriDropFlexContainer, TriDropListContainer, ɵTriDropContainer
} from '@gradii/triangle/dnd';
import { IconComponent } from '@gradii/triangle/icon';
import { SplitterComponent, SplitterPaneComponent } from '@gradii/triangle/splitter';
import { WithSizeDirective } from '../definitions';
import { RuntimeComponentService } from './runtime-component.service';
import { RuntimeDirective } from './runtime.directive';

export function getComponentHelper(template?: string) {
  @Injectable({
    providedIn: 'root'
  })
  class _ {
    static ɵfac = ɵɵngDeclareFactory({
      type  : _,
      deps  : [
        // {token: /**/}
      ],
      target: ɵɵFactoryTarget.Component
    });

    static ɵcmp = ɵɵngDeclareComponent({
      type       : _,
      selector   : 'oven-outlet',
      viewQueries: [
        { propertyName: 'flourComponents', predicate: RuntimeDirective, descendants: true },
        { propertyName: 'dropContainerGroup', predicate: TriDropContainerGroup, descendants: true, first: true },
      ],
      template   : template,
      isInline   : true,
      styles     : [
        `
.space {
  min-width: 20px;
  min-height: 20px;
  flex: 1;
}
.tri-drag-placeholder.custom-drag-placeholder {
  display: block;
  position: relative;
  width: 100%;
  height: 50px;
  background-color: rgba(218, 99, 93, 0.2);
}
.tri-drag-placeholder.custom-drag-placeholder:after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  right: 3px;
  bottom: 3px;
  display: block;
  border: 1px dashed #a24b46;
}

.tri-drag-preview {
  opacity: 0.4;
}

.tri-drag-preview:not(.tri-drag-animating) {
  transition-property: none !important;
}

.tri-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1) !important;
}

.tri-drop-container-dragging .drag-box:not(.tri-drag-placeholder),
.tri-drop-flex-container-dragging .drag-box:not(.tri-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1) !important;
}

.tri-drag-placeholder {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1) !important;
}

.tri-drop-container-receiving {
  min-height: 40px;
  position: relative;
}
.tri-drop-container-receiving:after {
  content: "";
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  display: block;
  border: 1px dashed #a24b46;
  opacity: 0.2;
  pointer-events: none;
}

.drag-box {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
      `
      ],
      outputs    : {
        'slotChange': 'slotChange'
      },
      components : [
        {
          type    : IconComponent,
          selector: 'tri-icon, i[tri-icon]',
          inputs  : ['inline', 'svgIcon', 'fontSet', 'fontIcon'],
          exportAs: ['triIcon']
        }, {
          type    : SplitterComponent,
          selector: 'tri-splitter',
          inputs  : ['orientation', 'splitBarSize', 'disabledBarSize', 'showCollapseButton'],
          exportAs: ['triSplitter']
        }, {
          type    : SplitterPaneComponent,
          selector: 'tri-splitter-pane',
          inputs  : [
            'minSize', 'maxSize', 'resizable', 'collapsible', 'shrink', 'shrinkWidth', 'collapsed',
            'collapseDirection',
            'size'
          ],
          outputs : ['sizeChange', 'collapsedChange', 'shrinkStatusChange']
        }, {
          type    : CardComponent,
          selector: 'tri-card',
          inputs  : ['bordered', 'loading', 'noHovering']
        }, {
          type    : TriCardHeaderComponent,
          selector: 'tri-card-header'
        }, {
          type    : TriCardBodyComponent,
          selector: 'tri-card-body',
          inputs  : ['loading']
        }, {
          type: TriCardFooterComponent,
          selector: 'tri-card-footer',
          inputs: ['align']
        }, {
          type    : ButtonComponent,
          selector: '[triButton], [tri-button]',
          inputs  : ['variant', 'iconOnly', 'color', 'shape', 'size', 'loading', 'ghost']
        }, {
          type    : CheckboxComponent,
          selector: 'tri-checkbox',
          inputs  : [ "disabled", "indeterminate", "label", "value", "initValue", "checked" ],
          outputs : [ "checkedChange", "indeterminateChange", "checkStateChange" ]
        }
      ],
      directives : [
        {
          type    : TriDropContainerGroup,
          selector: '[triDropContainerGroup]',
          inputs  : ['triDropContainerGroupDisabled'],
          exportAs: ['triDropContainerGroup']
        }, /*{
        type    : CakeFlexSlotDirective,
        selector: "[pfCakeFlexSlot]",
        inputs  : ["gap", "rowGap", "columnGap", "orientation"]
      },*/ {
          type    : TriDropFlexContainer,
          selector: '[triDropFlexContainer], tri-drop-flex-container',
          inputs  : [
            'TriDragContainerDisabled', 'triDropFlexContainerConnectedTo', 'triDropFlexContainerData',
            'triDropFlexContainerOrientation', 'triDropFlexContainerLockAxis', 'triDropFlexContainerSortingDisabled',
            'triDropFlexContainerEnterPredicate', 'triDropFlexContainerSortPredicate',
            'triDropFlexContainerAutoScrollDisabled', 'triDropFlexContainerAutoScrollStep'
          ],
          outputs : [
            'triDropFlexContainerDropped', 'triDropFlexContainerEntered', 'triDropFlexContainerExited',
            'triDropFlexContainerSorted', 'triDropFlexContainerRepositioned'
          ],
          exportAs: ['triDropFlexContainer']
        }, {
          type    : NgClass,
          selector: '[ngClass]',
          inputs  : ['ngClass']
        }, {
          type    : NgForOf,
          selector: '[ngFor][ngForOf]',
          inputs  : ['ngForOf', 'ngForTrackBy', 'ngForTemplate']
        }, {
          type    : TriDrag,
          selector: '[triDrag]',
          inputs  : [
            'triDragData', 'triDragLockAxis', 'triDragRootElement', 'triDragBoundary', 'triDragStartDelay',
            'triDragFreeDragPosition', 'triDragDisabled', 'triDragConstrainPosition', 'triDragPreviewClass',
            'triDragPreviewContainer'
          ],
          outputs : [
            'triDragStarted', 'triDragReleased', 'triDragEnded', 'triDragEntered', 'triDragExited', 'triDragDropped',
            'triDragMoved'
          ],
          exportAs: ['triDrag']
        },/* {type: CakeDefinitionDirective, selector: "[pfCakeDefinition]"}, {
        type    : CakeListSlotDirective,
        selector: "[pfCakeListSlot]"
      },*/ {
          type    : TriDropListContainer,
          selector: '[triDropListContainer], tri-drop-list-container',
          inputs  : [
            'triDropListContainerDisabled', 'triDropListContainerConnectedTo', 'triDropListContainerData',
            'triDropListContainerOrientation', 'triDropListContainerLockAxis', 'triDropListContainerSortingDisabled',
            'triDropListContainerEnterPredicate', 'triDropListContainerSortPredicate',
            'triDropListContainerAutoScrollDisabled', 'triDropListContainerAutoScrollStep'
          ],
          outputs : [
            'triDropListContainerDropped', 'triDropListContainerEntered', 'triDropListContainerExited',
            'triDropListContainerSorted', 'triDropListContainerRepositioned'
          ],
          exportAs: ['triDropListContainer']
        },
        {
          type    : WithSizeDirective,
          selector: '[kitchenWithSize]',
          inputs  : ['kitchenWithSize', 'kitchenWithSizeMargins']
        },
        {
          type    : RuntimeDirective,
          selector: '[_kitchenRuntime]',
          inputs  : ['_kitchenRuntimeComponentId']
        }
      ],
      providers  : [
        RuntimeComponentService,
      ]
    });

    text: any = null;

    slotChange: EventEmitter<{
      transferArrayItem?: {
        dragItem: any,
        dropContainer: any,
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
    }> = new EventEmitter(false);

    /**
     * runtime directive
     */
    flourComponents: QueryList<RuntimeDirective>;

    dropContainerGroup: TriDropContainerGroup<any>;

    ready: EventEmitter<{
      flourComponents: QueryList<RuntimeDirective>
      dropContainerGroup: TriDropContainerGroup<any>
    }> = new EventEmitter();

    constructor() {
    }

    onDragStart(event: any) {
      console.log('drag start');
    }

    onDragDropped(dragDrop: TriDragDrop<any>) {
      const { container, previousContainer, item, previousIndex, currentIndex } = dragDrop;

      const dropData = container.data;
      const dragData = item.data;

      if (previousContainer !== container) {
        // transferArrayItem(previousContainer, container, item);
        this.slotChange.emit({
          transferArrayItem: {
            dragItem        : item,
            dropContainer   : container,
            dragData        : dragData,
            dropData        : dropData,
            currentContainer: previousContainer.data,
            targetContainer : container.data,
            currentIndex    : previousIndex,
            targetIndex     : currentIndex
          }
        });
      } else if (currentIndex !== previousIndex) {
        this.slotChange.emit({
          moveItemInArray: {
            dragItem        : item,
            dragData        : dragData,
            currentContainer: container.data,
            currentIndex    : previousIndex,
            targetIndex     : currentIndex
          }
        });
      }
    }

    ngOnInit() {
      console.log(`${_.name} ngOnInit...`);
    }

    ngAfterViewInit() {
      console.log(`${_.name} ngAfterViewInit...`);

      this.ready.emit({
        flourComponents: this.flourComponents,
        dropContainerGroup: this.dropContainerGroup
      });
    }
  }

  return { Component: _ };
}