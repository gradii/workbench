import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, exhaustMap, filter, map, takeUntil, tap } from 'rxjs/operators';
import { NB_WINDOW } from '@nebular/theme';

import { ComponentsTreePanelComponent } from '../components-tree-panel/components-tree-panel.component';
import { PagePanelComponent } from '../page-panel/page-panel.component';
import { SettingsFacade } from '@tools-state/settings/settings.facade';

const DEFAULT_SCALE = 0.3;

@Component({
  selector: 'ub-navigator-panel',
  styleUrls: ['./navigator-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-page-panel
      [style.height.px]="pagePanelHeight$ | async"
      [style.user-select]="userSelect$ | async"
      [style.pointer-events]="userSelect$ | async"
    ></ub-page-panel>
    <div #resizer class="separator">
      <div></div>
    </div>
    <ub-components-tree-panel
      [style.height.px]="treePanelHeight$ | async"
      [style.user-select]="userSelect$ | async"
      [style.pointer-events]="userSelect$ | async"
    ></ub-components-tree-panel>
  `
})
export class NavigatorPanelComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('resizer') resizer: ElementRef<HTMLElement>;
  @ViewChild(PagePanelComponent, { read: ElementRef }) pagePanel: ElementRef<HTMLElement>;
  @ViewChild(ComponentsTreePanelComponent, { read: ElementRef }) treePanel: ElementRef<HTMLElement>;

  dimensionsInstalled = false;
  elementDimensions: ClientRect;

  readonly destroyed$ = new Subject();

  readonly userSelect = new Subject<boolean>();
  readonly userSelect$ = this.userSelect.pipe(map((isActive: boolean) => (isActive ? 'none' : 'unset')));

  readonly resizerDimensions = new Subject<ClientRect>();
  readonly resizerDimensions$ = this.resizerDimensions.asObservable();

  readonly pagePanelScale = new BehaviorSubject<number>(DEFAULT_SCALE);
  readonly pagePanelScale$ = this.pagePanelScale.asObservable();

  readonly pagePanelHeight$: Observable<number> = combineLatest([this.pagePanelScale$, this.resizerDimensions$]).pipe(
    map(([pagePanelScale, resizer]) => {
      const pagePanel = this.elementDimensions;
      return pagePanel ? Math.ceil(pagePanel.height * pagePanelScale - resizer.height) : 0;
    }),
    filter(height => height >= 0)
  );

  readonly treePanelHeight$: Observable<number> = combineLatest([this.pagePanelScale$, this.resizerDimensions$]).pipe(
    map(([pagePanelScale]) => {
      const dimensions = this.elementDimensions;
      return dimensions ? Math.ceil(dimensions.height * (1 - pagePanelScale)) : 0;
    }),
    filter(height => height >= 0)
  );

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private settingsFacade: SettingsFacade,
    @Inject(NB_WINDOW) private window
  ) {
  }

  ngOnInit(): void {
    this.settingsFacade.componentTreePageSidebarScale$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((scale: number) => this.pagePanelScale.next(scale));
  }

  ngAfterViewInit(): void {
    this.subscribeToMouseMove();
  }

  ngAfterViewChecked(): void {
    if (!this.dimensionsInstalled) {
      const resizerDimensinons = this.getDimensions(this.resizer);
      const elementDimensions = this.getDimensions(this.elementRef);

      if (elementDimensions.height) {
        this.dimensionsInstalled = true;
        this.elementDimensions = elementDimensions;
        this.resizerDimensions.next(resizerDimensinons);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private subscribeToMouseMove(): void {
    const mousedown$ = fromEvent(this.resizer.nativeElement, 'mousedown').pipe(tap(() => this.userSelect.next(true)));
    const mouseup$ = fromEvent(this.window, 'mouseup').pipe(tap(() => this.userSelect.next(false)));
    const mousemove$ = fromEvent(this.window, 'mousemove').pipe(takeUntil(mouseup$));

    mousedown$
      .pipe(
        exhaustMap(() => mousemove$),
        map((event: MouseEvent) => {
          const component: ClientRect = this.elementDimensions;
          return component ? (event.clientY - component.top) / component.height : DEFAULT_SCALE;
        }),
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      )
      .subscribe((scale: number) => this.settingsFacade.updateComponentTreePageSidebarScale(scale));
  }

  private getDimensions(ref: ElementRef<HTMLElement>): ClientRect {
    return ref ? ref.nativeElement.getBoundingClientRect() : null;
  }
}
