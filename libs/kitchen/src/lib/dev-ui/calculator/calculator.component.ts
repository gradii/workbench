import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { COMPONENT_META_DEFINITION, MetaDefinition, WIDGET_META_DEFINITION } from '../../definitions/definition';
import { FlourComponent } from '../../model';
import { AclService, Feature, Searcher, SearchService } from '@common/public-api';
import { RenderState } from '../../state/render-state.service';
import { inHeader, inSidebar } from '../util';

@Component({
  selector: 'kitchen-calculator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calculator.component.scss'],
  template: `
    <bc-input-icon icon="search-outline">
      <input class="search-input" #search triInput fullWidth placeholder="Search" [(ngModel)]="searchString" />
    </bc-input-icon>
    <tri-tab-group>
      <tri-tab title="Components ({{ componentDefinitionList.length }})">
        <kitchen-component-list
          [definitionList]="componentDefinitionList"
          (select)="addComponent($event)"
        ></kitchen-component-list>
      </tri-tab>
      <tri-tab title="Widgets ({{ widgetDefinitionList.length }})">
        <kitchen-widget-list [definitionList]="widgetDefinitionList" (select)="addWidget($event)"></kitchen-widget-list>
      </tri-tab>
    </tri-tab-group>
  `
})
export class CalculatorComponent implements AfterViewInit {
  @ViewChild('search') search: ElementRef;

  @Input() virtualComponent: FlourComponent;
  searchString = '';

  private componentSearcher: Searcher<MetaDefinition>;
  private widgetSearcher: Searcher<MetaDefinition>;

  constructor(
    @Inject(COMPONENT_META_DEFINITION) private componentDefinitions: MetaDefinition[],
    @Inject(WIDGET_META_DEFINITION) private widgetDefinitions: MetaDefinition[],
    private acl: AclService,
    private renderState: RenderState,
    private searchService: SearchService
  ) {
    this.buildSearchers();
  }

  get componentDefinitionList(): MetaDefinition[] {
    return this.prepareDefinitions(this.componentSearcher, this.componentDefinitions);
  }

  get widgetDefinitionList(): MetaDefinition[] {
    return this.prepareDefinitions(this.widgetSearcher, this.widgetDefinitions);
  }

  addWidget(metaDefinition: MetaDefinition) {
    this.acl
      .canAddWidget(metaDefinition.name)
      .pipe(take(1))
      .subscribe((canAdd: boolean) => this.add(metaDefinition, 'widget', canAdd));
  }

  addComponent(metaDefinition: MetaDefinition) {
    this.acl
      .canAddComponent(metaDefinition.name)
      .pipe(take(1))
      .subscribe((canAdd: boolean) => this.add(metaDefinition, 'component', canAdd));
  }

  ngAfterViewInit() {
    this.search.nativeElement.focus();
  }

  private add(metaDefinition: MetaDefinition, feature: Feature, available: boolean) {
    if (available) {
      this.renderState.addComponentToSlot(this.virtualComponent, metaDefinition);
    } else {
      this.renderState.access(feature, metaDefinition.name);
    }
    this.renderState.closeCalculatorPopover();
  }

  private prepareDefinitions(searcher: Searcher<MetaDefinition>, allItems: MetaDefinition[]): MetaDefinition[] {
    const foundedItems = this.searchString.length > 1 ? searcher.search(this.searchString) : allItems;
    return foundedItems.filter((d: MetaDefinition) => this.canBePlaced(d)).sort((a, b) => a.order - b.order);
  }

  private canBePlaced(d: MetaDefinition): boolean {
    if (inHeader(this.virtualComponent)) {
      return d.headerSupport;
    }
    if (inSidebar(this.virtualComponent)) {
      return d.sidebarSupport;
    }
    return true;
  }

  private buildSearchers() {
    this.componentSearcher = this.searchService.build<MetaDefinition>(this.buildSearchItems(this.componentDefinitions));
    this.widgetSearcher = this.searchService.build<MetaDefinition>(this.buildSearchItems(this.widgetDefinitions));
  }

  private buildSearchItems(meta: MetaDefinition[]) {
    return meta.map((w: MetaDefinition) => ({
      name: w.name,
      tags: w.tags,
      returnInstance: w
    }));
  }
}
