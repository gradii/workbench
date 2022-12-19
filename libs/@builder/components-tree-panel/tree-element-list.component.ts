import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, merge, BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { ExecuteSourceType, KeyboardService } from '@common/public-api';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { PuffComponent } from '@tools-state/component/component.model';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { ComponentsTreeService } from './components-tree.service';
import {
  ComponentOrSlotTreeNode, ComponentTreeNode, ComponentTreeNodeVisibility, ComponentTreeRenderNode
} from './components-tree.model';

interface CollapseChangeBag {
  status: boolean;
  componentIndex: number;
}

@Component({
  selector       : 'pf-tree-element-list',
  styleUrls      : ['./tree-element-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div>
      <tri-tree-view
        [nodes]="(components$ | async)"
        textField="text"
        triTreeViewHierarchyBinding
        childrenField="children"
        [filterable]="true"
        triTreeViewExpandable
      >
        <ng-template triTreeViewNodeTemplate let-renderNode>
          {{renderNode.fullName}}
          <!--<ub-tree-element
            [collapsed]="renderNode.isCollapsed"
            [component]="renderNode.component"
            [invisible]="renderNode.visibility"
            [active]="renderNode.isActive"
            (click)="selectComponent(renderNode.component)"
          >
          </ub-tree-element>-->
        </ng-template>
      </tri-tree-view>
    </div>

    <!--  <ng-container *ngFor="let renderNode of components$$ | async; let i = index; trackBy: trackByFunction">
        <ub-tree-element
          *ngIf="!renderNode.isParentCollapsed"
          [collapsed]="renderNode.isCollapsed"
          [component]="renderNode.component"
          [invisible]="renderNode.visibility"
          [active]="renderNode.isActive"
          (collapsedChange)="collapse.next({ status: $event, componentIndex: i })"
          (click)="selectComponent(renderNode.component)"
        >
        </ub-tree-element>
      </ng-container>-->
  `
})
export class TreeElementListComponent implements OnInit, OnDestroy {
  components$ = this.componentsTreeService.componentList$;
  collapse    = new BehaviorSubject<CollapseChangeBag>(null);

  private destroyed$         = new Subject<void>();
  private currentBreakpoint$ = this.componentsTreeService.selectedBreakpoint$;
  private activeComponent$   = this.componentFacade.activeComponent$.pipe(
    filter((activeComponent: PuffComponent) => !!activeComponent)
  );

  private collapsedComponentsIndexes = new BehaviorSubject<Set<number>>(new Set());

  private invisibleComponentsIndexes  = new BehaviorSubject<Set<number>>(new Set());
  private invisibleComponentsIndexes$ = combineLatest([
    this.invisibleComponentsIndexes.asObservable(),
    this.components$,
    this.currentBreakpoint$
  ]).pipe(
    map(([_, components, breakpoint]: [Set<number>, ComponentTreeNode[], Breakpoint]) => {
      const invisibleElements = this.componentsTreeService.getInvisibleChildrenIndexes(components, breakpoint.width);
      return new Set(invisibleElements);
    })
  );

  // components$$: Observable<ComponentTreeRenderNode[]> = combineLatest([
  //   this.components$,
  //   this.invisibleComponentsIndexes$,
  //   this.collapsedComponentsIndexes.asObservable(),
  //   this.currentBreakpoint$,
  //   this.activeComponent$
  // ]).pipe(
  //   map(([
  //          components,
  //          invisibleComponents,
  //          collapsedComponents,
  //          breakpoint,
  //          activeComponent
  //        ]) => {
  //     return components.map((component: ComponentTreeNode, i: number) => ({
  //       component,
  //       id               : i,
  //       parentIndex      : component.parentIndex,
  //       isActive         : this.isActive(activeComponent, component),
  //       isCollapsed      : this.isCollapsed(collapsedComponents, i),
  //       isParentCollapsed: this.isParentCollapsed(collapsedComponents, component),
  //       visibility       : this.getVisibility(invisibleComponents, breakpoint, component, i)
  //     }));
  //   })
  // );

  constructor(
    private componentFacade: ComponentFacade,
    private componentsTreeService: ComponentsTreeService,
    private elementRef: ElementRef,
    private keyboardService: KeyboardService
  ) {
  }

  ngOnInit(): void {
    this.subscribeToKeyboardEvents();
    this.subscribeToCollapse();
    this.subscribeToMouseEvents();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  trackByFunction(index: number, item: ComponentTreeRenderNode): string {
    return item.component.kitchenComponent.id;
  }

  selectComponent(component: ComponentTreeNode): void {
    this.componentFacade.selectComponentById(component.kitchenComponent, ExecuteSourceType.ComponentTree);
  }

  private isActive(activeComponent: PuffComponent, component: ComponentOrSlotTreeNode): boolean {
    if (component instanceof ComponentTreeNode) {
      return activeComponent.id === component.kitchenComponent.id;
    } else {
      return false;
    }
  }

  private isCollapsed(collapsedComponents: Set<number>, componentIndex: number): boolean {
    return collapsedComponents.has(componentIndex);
  }

  private isParentCollapsed(collapsedComponents: Set<number>, { parentIndex }: ComponentTreeNode): boolean {
    return collapsedComponents.has(parentIndex);
  }

  private getVisibility(
    invisibleComponents: Set<number>,
    breakpoint: Breakpoint,
    component: ComponentTreeNode,
    componentIndex: number
  ): ComponentTreeNodeVisibility {
    const parentVisible = !invisibleComponents.has(componentIndex);
    const selfVisible   = this.componentsTreeService.isVisible(component, breakpoint.width);
    return { parentVisible, selfVisible };
  }

  private subscribeToMouseEvents(): void {
    const overEvent$ = fromEvent(this.elementRef.nativeElement, 'mouseover').pipe(
      filter((e: MouseEvent) => e.target === this.elementRef.nativeElement)
    );

    const leaveEvent$ = fromEvent(this.elementRef.nativeElement, 'mouseleave');

    merge(overEvent$, leaveEvent$)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.componentFacade.setHoveredComponent(''));
  }

  private subscribeToKeyboardEvents(): void {
    this.keyboardService.delete$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.componentFacade.removeActiveComponents(ExecuteSourceType.ComponentTree));
    this.keyboardService.redo$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.componentFacade.redo());
    this.keyboardService.undo$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.componentFacade.undo());
  }

  private subscribeToCollapse(): void {
    this.collapse
      .pipe(
        filter(collapse => Boolean(collapse)),
        withLatestFrom(this.components$),
        map(([{ status, componentIndex }, components]: [CollapseChangeBag, ComponentTreeNode[]]) => {
          return this.resolveCollapsedIndexes(status, componentIndex, components);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(this.collapsedComponentsIndexes);

    combineLatest([this.activeComponent$, this.components$])
      .pipe(
        map(([active, components]: [PuffComponent, ComponentTreeNode[]]) => {
          const collapsed: Set<number> = this.collapsedComponentsIndexes.getValue();
          const treeComponent          = components.find(({ kitchenComponent }) => active.id === kitchenComponent.id);
          if (!treeComponent) {
            return collapsed;
          }

          const parents: number[] = this.componentsTreeService.getParentIndexes(components, treeComponent);
          const newCollapsed      = new Set(collapsed);
          parents.forEach(index => newCollapsed.delete(index));
          return newCollapsed;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(collapsed => this.collapsedComponentsIndexes.next(collapsed));
  }

  private resolveCollapsedIndexes(
    status: boolean,
    componentIndex: number,
    components: ComponentTreeNode[]
  ): Set<number> {
    const collapsed    = this.collapsedComponentsIndexes.getValue();
    const newCollapsed = new Set(collapsed);
    if (status) {
      newCollapsed.add(componentIndex);
      this.componentsTreeService.getChildrenIndexes(components, componentIndex).forEach(i => newCollapsed.add(i));
    } else {
      newCollapsed.delete(componentIndex);
    }

    return newCollapsed;
  }
}
