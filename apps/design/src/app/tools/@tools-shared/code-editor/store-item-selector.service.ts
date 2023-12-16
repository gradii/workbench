import {
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Inject,
  Injectable,
  NgZone,
  OnDestroy,
  QueryList
} from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ENTER, ESCAPE, TAB } from '@angular/cdk/keycodes';
import {
  NB_DOCUMENT,
  NbAdjustment,
  NbClickTriggerStrategy,
  NbComponentPortal,
  NbOptionComponent,
  NbOverlayConfig,
  NbOverlayRef,
  NbOverlayService,
  NbPosition,
  NbPositionBuilderService
} from '@nebular/theme';
import { BehaviorSubject, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';

import { SelectorOption, OptionGroup, SelectChange, StoreItemSelectorComponent } from './store-item-selector.component';

function throwNoHostElementRegistered() {
  throw new Error(
    'StoreItemSelectorService: No hostElementRef! Before showing selector,' +
    'call "registerHostElement" and provide a host element ref!'
  );
}

interface StoreItemSelectorStateChangeMeta {
  closedByEscape?: boolean;
  closedOnSelect?: boolean;
}

export type StoreItemSelectorStateChange = { isShown: boolean } & StoreItemSelectorStateChangeMeta;

@Injectable()
export class StoreItemSelectorService implements OnDestroy {
  optionGroup$ = new BehaviorSubject<OptionGroup[]>([]);

  private destroy$ = new Subject<void>();
  private selectorDestroy$ = new Subject<void>();
  private serviceOrSelectorDestroy$ = merge(this.destroy$, this.selectorDestroy$);
  private readonly stateChange$ = new Subject<StoreItemSelectorStateChange>();

  private readonly storeItemSelectorOverlayOffset = 4;
  private hostElementRef: ElementRef;
  private additionalHostElement$ = new ReplaySubject<ElementRef>();
  private triggerStrategy: MultiHostClickTriggerStrategy;
  private keyManager: ActiveDescendantKeyManager<NbOptionComponent<SelectorOption>>;
  private selectorOverlayRef: NbOverlayRef;
  private selectorComponentRef: ComponentRef<StoreItemSelectorComponent>;

  private width$ = new ReplaySubject<number>();

  private selectedChange$ = new Subject<SelectChange>();

  constructor(
    private positionBuilder: NbPositionBuilderService,
    private overlayService: NbOverlayService,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(NB_DOCUMENT) private document,
    private zone: NgZone
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  registerHostElement(hostElementRef: ElementRef) {
    this.hostElementRef = hostElementRef;
    this.initTriggerStrategy();
  }

  registerAdditionalTriggerHost(hostElementRef: ElementRef) {
    this.additionalHostElement$.next(hostElementRef);
  }

  setSelectorWidth(width: number) {
    this.width$.next(width);
  }

  setOptionGroups(optionGroups: OptionGroup[]) {
    this.optionGroup$.next(optionGroups);
  }

  selectedChange(): Observable<SelectChange> {
    return this.selectedChange$.asObservable();
  }

  onStateChange(): Observable<StoreItemSelectorStateChange> {
    return this.stateChange$.pipe(distinctUntilChanged((x, y) => x.isShown === y.isShown));
  }

  show() {
    if (!this.selectorOverlayRef) {
      this.createStoreItemSelectorOverlay();
    }
    if (this.isShown()) {
      return;
    }

    const selectorPortal = new NbComponentPortal<StoreItemSelectorComponent>(
      StoreItemSelectorComponent,
      null,
      null,
      this.componentFactoryResolver
    );
    this.selectorComponentRef = this.selectorOverlayRef.attach(selectorPortal);

    this.selectorComponentRef.onDestroy(() => this.selectorDestroy$.next());

    const selectorComponent = this.selectorComponentRef.instance;
    this.listenToSelectChange(selectorComponent);
    this.listenToWidthChange(selectorComponent);
    this.listenToAdditionalOptionGroups(selectorComponent);
    this.listenToKeys();
    selectorComponent.focusSearch();

    this.stateChange$.next({ isShown: true });
  }

  hide(changeMeta: StoreItemSelectorStateChangeMeta = {}) {
    if (this.isShown()) {
      this.selectorOverlayRef.detach();
      this.selectorComponentRef = null;
      this.stateChange$.next({ isShown: false, ...changeMeta });
    }
  }

  private initTriggerStrategy() {
    this.triggerStrategy = this.createTriggerStrategy();
    this.listenToTriggers();
    this.listenToAdditionalHosts();
  }

  private isShown(): boolean {
    return this.selectorOverlayRef && this.selectorOverlayRef.hasAttached();
  }

  private listenToSelectChange(storeItemSelector: StoreItemSelectorComponent) {
    storeItemSelector.selectedChange
      .pipe(takeUntil(this.serviceOrSelectorDestroy$))
      .subscribe((change: SelectChange) => {
        this.selectedChange$.next(change);
        this.hide({ closedOnSelect: true });
      });
  }

  private listenToWidthChange(storeItemSelector: StoreItemSelectorComponent) {
    this.width$
      .pipe(distinctUntilChanged(), takeUntil(this.serviceOrSelectorDestroy$))
      .subscribe(width => storeItemSelector.setWidth(width));
  }

  private listenToAdditionalOptionGroups(storeItemSelector: StoreItemSelectorComponent) {
    this.optionGroup$
      .pipe(takeUntil(this.serviceOrSelectorDestroy$))
      .subscribe((groups: OptionGroup[]) => storeItemSelector.addOptionalGroups(...groups));
  }

  private listenToTriggers() {
    this.triggerStrategy.show$.pipe(takeUntil(this.destroy$)).subscribe(() => this.show());

    this.triggerStrategy.hide$.pipe(takeUntil(this.destroy$)).subscribe(() => this.hide());
  }

  private listenToAdditionalHosts() {
    this.additionalHostElement$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hostRef: ElementRef) => this.triggerStrategy.registerAdditionalHost(hostRef.nativeElement));
  }

  private listenToKeys() {
    this.selectorOverlayRef
      .keydownEvents()
      .pipe(takeUntil(this.serviceOrSelectorDestroy$))
      .subscribe((e: KeyboardEvent) => this.onOverlayKeyDown(e));

    // Postpone key manager creation as it need selector options which will become available
    // only after view init.
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.keyManager = new ActiveDescendantKeyManager(this.selectorComponentRef.instance.optionComponents);

      this.selectorComponentRef.instance.optionComponents.changes
        .pipe(
          map((options: QueryList<NbOptionComponent<SelectorOption>>) => options.toArray()),
          filter((options: NbOptionComponent<SelectorOption>[]) => !options.includes(this.keyManager.activeItem)),
          takeUntil(this.serviceOrSelectorDestroy$)
        )
        .subscribe(() => {
          this.keyManager.setFirstItemActive();
          this.selectorComponentRef.changeDetectorRef.detectChanges();
        });
    });
  }

  private onOverlayKeyDown(e: KeyboardEvent) {
    if (e.keyCode === ESCAPE || e.keyCode === TAB) {
      this.hide({ closedByEscape: e.keyCode === ESCAPE });
      return;
    }

    if (!this.keyManager) {
      return;
    }

    if (e.keyCode === ENTER && this.keyManager.activeItem) {
      this.selectorComponentRef.instance.selectOption(this.keyManager.activeItem);
      return;
    }

    this.keyManager.onKeydown(e);
  }

  private createStoreItemSelectorOverlay() {
    if (!this.hostElementRef) {
      throwNoHostElementRegistered();
    }

    const positionStrategy = this.createPositionStrategy();
    const scrollStrategy = this.overlayService.scrollStrategies.reposition();
    const config: NbOverlayConfig = { hasBackdrop: false, positionStrategy, scrollStrategy };

    this.selectorOverlayRef = this.overlayService.create(config);

    this.destroy$.pipe(take(1)).subscribe(() => {
      this.selectorOverlayRef.dispose();
      this.triggerStrategy.destroy();
    });
  }

  private createPositionStrategy() {
    return this.positionBuilder
      .connectedTo(this.hostElementRef)
      .position(NbPosition.BOTTOM)
      .offset(this.storeItemSelectorOverlayOffset)
      .withFlexibleDimensions(true)
      .withViewportMargin(this.storeItemSelectorOverlayOffset * 2)
      .adjustment(NbAdjustment.VERTICAL);
  }

  private createTriggerStrategy(): MultiHostClickTriggerStrategy {
    return new MultiHostClickTriggerStrategy(this.document, null, () => this.selectorComponentRef);
  }
}

export class MultiHostClickTriggerStrategy extends NbClickTriggerStrategy {
  private additionalHosts: HTMLElement[] = [];

  registerAdditionalHost(host: HTMLElement) {
    this.additionalHosts.push(host);
  }

  protected isOnHost(e: Event): boolean {
    return this.additionalHosts.some((host: HTMLElement) => host.contains(e.target as Node));
  }
}
