import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { ComponentTreeNode, ComponentTreeNodeVisibility } from './components-tree.model';
import { ComponentsTreeService } from './components-tree.service';
import { ComponentSettingsService } from '../component-settings/component-settings.service';

const TOP_GAP = 40;

@Component({
  selector: 'ub-tree-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tree-element.component.scss'],
  template: `
    <span
      class="icon icon-toggler"
      (click)="toggleCollapsed()"
      [class.visible]="isCanBeOpen"
      [class.rotated]="collapsed"
    >
      <nb-icon icon="chevron-up"></nb-icon>
    </span>
    <span class="icon icon-component">
      <bc-icon [name]="iconName"></bc-icon>
    </span>
    <span class="component-name">{{ label }}</span>
    <span class="icon icon-invisible" *ngIf="!invisible?.selfVisible">
      <bc-icon [name]="invisibleIcon"></bc-icon>
    </span>
  `
})
export class TreeElementComponent implements AfterViewInit, OnDestroy {
  private destroyed$ = new Subject();

  @Input() component: ComponentTreeNode;
  @Input() collapsed = false;
  @Input() invisible: ComponentTreeNodeVisibility;

  private _active = false;

  @Input() set active(status: boolean) {
    if (status) {
      this.scrollIfNeed();
    }
    this._active = status;
  }

  @Output() collapsedChange = new EventEmitter<boolean>();

  @HostBinding('style.padding-left') get paddingLeft() {
    return `${this.component.level}rem`;
  }

  @HostBinding('class.invisible') get invisibleClass() {
    if (!this.invisible) {
      return false;
    }
    return !this.invisible.parentVisible;
  }

  @HostBinding('class.active') get activeClass() {
    return this._active;
  }

  constructor(
    private componentsTreeService: ComponentsTreeService,
    private componentFacade: ComponentFacade,
    private componentSettingsService: ComponentSettingsService,
    private ref: ElementRef<HTMLElement>
  ) {
  }

  ngAfterViewInit(): void {
    fromEvent(this.ref.nativeElement, 'mouseenter')
      .pipe(throttleTime(300), takeUntil(this.destroyed$))
      .subscribe(() => this.componentFacade.setHoveredComponent(this.component.ovenComponent.id));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public get label(): string {
    const { fullName, ovenComponent } = this.component;
    return (
      ovenComponent.properties.name || fullName || this.componentSettingsService.splitName(ovenComponent.definitionId)
    );
  }

  public get iconName(): string {
    return this.componentSettingsService.getComponentIconName(
      this.component.ovenComponent.definitionId,
      this.component.fullName,
      this._active
    );
  }

  public get invisibleIcon(): string {
    const name = 'component-icon-invisible';
    return this._active ? name + '-active' : name;
  }

  public get isCanBeOpen() {
    return this.componentsTreeService.isCanBeOpen(this.component);
  }

  public toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  private scrollIfNeed(): void {
    const { parentElement, offsetTop } = this.ref.nativeElement;
    const { offsetHeight } = parentElement;
    if (this.outParentViewport(this.ref.nativeElement, parentElement)) {
      this.scrollTo(parentElement, 0, offsetTop - offsetHeight * 0.5);
    }
  }

  private scrollTo(element: HTMLElement, x: number, y: number): void {
    if (!element.scrollTo || !('scrollBehavior' in document.documentElement.style)) {
      element.scrollTop = y;
      element.scrollLeft = x;
      return;
    }
    element.scrollTo({
      top: y,
      left: x,
      behavior: 'smooth'
    });
  }

  private outParentViewport(element: HTMLElement, parent: HTMLElement): boolean {
    let { offsetTop } = element;
    const { offsetHeight, scrollTop } = parent;
    offsetTop -= TOP_GAP;
    return scrollTop > offsetTop || offsetTop > scrollTop + offsetHeight;
  }
}
