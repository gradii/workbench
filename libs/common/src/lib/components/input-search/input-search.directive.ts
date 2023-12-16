import { FlexibleConnectedPositionStrategy, OverlayContainer, OverlayRef, ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  TemplateRef
} from '@angular/core';
import {
  NB_DOCUMENT,
  NbComponentPortal,
  NbDynamicOverlay,
  NbDynamicOverlayHandler,
  NbOverlayService,
  NbTrigger,
  NbTriggerStrategyBuilderService
} from '@nebular/theme';
import { Subscription } from 'rxjs';
import { Searcher, SearchService } from '../../@core/search.service';

import { InputSearchResultsComponent } from './input-search-results.component';

export interface BcInputSearchOption {
  id?: string;
  displayValue: string;
  filterValues: string[];
  resultValue?: string;
  icon?: string;
  iconPack?: string;
  endIcon?: string;
  endIconTooltip?: string;
}

@Directive({
  selector: '[bcInputSearch]',
  providers: [NbDynamicOverlayHandler, NbDynamicOverlay],
  exportAs: 'bcInputSearch'
})
export class InputSearchDirective implements OnDestroy, AfterViewInit {
  @Input() set searchOptions(options: BcInputSearchOption[]) {
    this.options = options;
    this.searcher = this.searchService.build(
      options.map(option => ({
        name: option.displayValue,
        tags: option.filterValues,
        returnInstance: option
      }))
    );
    this.updateResults();
  }

  @Input() topItem: TemplateRef<any>;
  @Output() selectValue: EventEmitter<BcInputSearchOption> = new EventEmitter<BcInputSearchOption>();

  private searcher: Searcher<any>;
  private options: BcInputSearchOption[];
  private overlayRef: OverlayRef;

  private resultsRef: ComponentRef<InputSearchResultsComponent>;
  private selectSubscription: Subscription;

  private get inputValue(): string {
    return this.inputRef.nativeElement.value.toLowerCase().trim();
  }

  constructor(
    private inputRef: ElementRef<HTMLInputElement>,
    private overlay: NbOverlayService,
    @Inject(NB_DOCUMENT) protected document,
    private overlayContainer: OverlayContainer,
    private platform: Platform,
    private triggerStrategyBuilder: NbTriggerStrategyBuilderService,
    private cfr: ComponentFactoryResolver,
    private searchService: SearchService,
    private viewportRuler: ViewportRuler
  ) {
  }

  ngAfterViewInit() {
    this.createTriggerStrategy();
  }

  @HostListener('input') onInput() {
    this.updateResults();
  }

  ngOnDestroy() {
    this.hide();
  }

  hide() {
    if (this.overlayRef) {
      this.selectSubscription.unsubscribe();
      this.overlayRef.dispose();
      this.resultsRef = null;
    }
  }

  private filterOptions(): BcInputSearchOption[] {
    const searchString = this.inputValue;
    return searchString.length > 1 ? this.searcher.search(searchString) : this.options;
  }

  private show() {
    this.overlayRef = this.createOverlay();
    this.resultsRef = this.overlayRef.attach(new NbComponentPortal(InputSearchResultsComponent, null, null, this.cfr));
    this.updateResults();

    this.selectSubscription = this.resultsRef.instance.select.subscribe((option: BcInputSearchOption) => {
      this.selectValue.emit(option);
      this.hide();
    });
  }

  private updateResults() {
    if (this.resultsRef) {
      this.resultsRef.instance.hostWidth = this.inputRef.nativeElement.offsetWidth;
      this.resultsRef.instance.options = this.filterOptions();
      this.resultsRef.instance.topItem = this.topItem;
      this.resultsRef.changeDetectorRef.detectChanges();
    }
  }

  private createOverlay() {
    const positionStrategy = new FlexibleConnectedPositionStrategy(
      this.inputRef,
      this.viewportRuler,
      this.document,
      this.platform,
      this.overlayContainer
    )
      .withFlexibleDimensions(true)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4
        }
      ]);
    return this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createTriggerStrategy() {
    const triggerStrategy = this.triggerStrategyBuilder
      .trigger(NbTrigger.FOCUS)
      .host(this.inputRef.nativeElement)
      .container(() => this.getContainer())
      .build();

    triggerStrategy.show$.subscribe(() => this.show());
    triggerStrategy.hide$.subscribe(() => this.hide());
  }

  private getContainer() {
    return (
      this.overlayRef &&
      this.overlayRef.hasAttached() &&
      <ComponentRef<any>>{
        location: {
          nativeElement: this.overlayRef.overlayElement
        }
      }
    );
  }
}
