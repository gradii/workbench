import { NgForOf } from '@angular/common';
import * as ngCore from '@angular/core';
import { EventEmitter, Injectable, ɵɵFactoryTarget } from '@angular/core';
import { ButtonComponent } from '@gradii/triangle/button';
import {
  CardComponent, TriCardBodyComponent, TriCardFooterComponent, TriCardHeaderComponent
} from '@gradii/triangle/card';
import {
  TriDrag, TriDragDrop, TriDropContainerGroup, TriDropFlexContainer, TriDropListContainer
} from '@gradii/triangle/dnd';
import { IconComponent } from '@gradii/triangle/icon';
import { SplitterComponent, SplitterPaneComponent } from '@gradii/triangle/splitter';

export function getComponentHelper(template?: string) {
  @Injectable({
    providedIn: 'root'
  })
  class _Self {
    static ɵfac = ngCore.ɵɵngDeclareFactory({
      type  : _Self,
      deps  : [],
      target: ɵɵFactoryTarget.Component
    });

    static ɵcmp = ngCore.ɵɵngDeclareComponent({
      type      : _Self,
      selector  : 'oven-outlet',
      template  : template,
      isInline  : true,
      styles    : [
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

.tri-drop-container-dragging .drag-box:not(.tri-drag-placeholder), .tri-drop-flex-container-dragging .drag-box:not(.tri-drag-placeholder) {
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
      outputs   : {
        'slotChange': 'slotChange'
      },
      components: [
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
        }, { type: TriCardFooterComponent, selector: 'tri-card-footer', inputs: ['align'] }, {
          type    : ButtonComponent,
          selector: '[triButton], [tri-button]',
          inputs  : ['variant', 'iconOnly', 'color', 'shape', 'size', 'loading', 'ghost']
        }
      ],
      directives: [
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
        }
      ]
    });

    text: any = null;

    slotChange = new EventEmitter<{
      transferArrayItem?: {
        item: any,
        current: any,
        target: any,
        currentIndex: number,
        targetIndex: number
      },
      moveInArrayItem?: {
        item: any,
        current: any,
        currentIndex: number,
        targetIndex: number
      },
    }>();

    constructor() {
    }

    onDragStart(event: any) {
      console.log('drag start');
    }

    onDragDropped(dragDrop: TriDragDrop<any>) {
      console.log(dragDrop);
      const { container, previousContainer, item, previousIndex, currentIndex } = dragDrop;

      const droppedContainerData = container.data;
      const dragData             = item.data;
      console.log(droppedContainerData);
      console.log(dragData);

      if (previousContainer !== container) {
        // transferArrayItem(previousContainer, container, item);
        this.slotChange.emit({
          transferArrayItem: {
            item        : dragData,
            current     : previousContainer.data,
            target      : container.data,
            currentIndex: previousIndex,
            targetIndex : currentIndex
          }
        });
      } else {
        this.slotChange.emit({
          moveInArrayItem: {
            item        : dragData,
            current     : container.data,
            currentIndex: previousIndex,
            targetIndex : currentIndex
          }
        });
      }
    }

    ngOnInit() {

      console.log(`${_Self.name} ngOnInit...`);
    }

    ngDoCheck() {
      console.log('checking...');
    }

    ngAfterViewInit() {
      console.log(`${_Self.name} ngAfterViewInit...`);
    }
  }

  // const ButtonModule = class {
  //
  // }
  //
  // // @ts-ignore
  // ButtonModule.ɵfac = ɵɵngDeclareFactory({ type: ButtonModule, deps: [], target: ɵɵFactoryTarget.NgModule });
  // // @ts-ignore
  // ButtonModule.ɵmod = ɵɵngDeclareNgModule({
  //   type: ButtonModule, declarations: [ButtonComponent], imports: [CommonModule,
  //     TriCommonModule,
  //     TriButtonModule], exports: [ButtonComponent]
  // });
  // // @ts-ignore
  // ButtonModule.ɵinj = ɵɵngDeclareInjector({
  //   type: ButtonModule, imports: [[
  //     CommonModule,
  //     TriCommonModule,
  //     TriButtonModule,
  //   ]]
  // });
  //
  // return {
  //   module: ButtonModule,
  //   component: ButtonComponent
  // };
  return { Component: _Self };
}