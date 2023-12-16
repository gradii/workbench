import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { ActiveRouteId, dataNamespaces, getDeepValue, StoreItemType } from '@common';
import { NbOptionComponent } from '@nebular/theme';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import { ItemSource, ItemSourceType, SOURCE_ICON } from './used-value.service';

export interface SelectorOption {
  id: string | ActiveRouteId; // id of StoreItem or Page
  name: string;
  sourceType: ItemSourceType;
  value: any;
  valueType: StoreItemType;
  path?: string;
}

export interface OptionGroup {
  order?: number;
  itemSource: ItemSource;
  name: string;
  namespace: string;
  options: SelectorOption[];
}

export interface SelectChange {
  itemSource: ItemSource;
  selected: SelectorOption;
  path?: string;
}

interface OptionModel {
  idPart: string;
  valuePart: string;
  originalOption: SelectorOption;
}

interface OptionGroupModel {
  order?: number;
  name: string;
  namespace: string;
  itemSource: ItemSource;
  options: OptionModel[];
}

@Component({
  selector: 'ub-store-item-selector',
  template: `
    <div class="search-container">
      <nb-icon class="search-icon" icon="search-outline" pack="eva"></nb-icon>
      <input (input)="onSearch(searchInput.value)" #searchInput class="search-input" nbInput fullWidth type="text" />
    </div>

    <nb-option-list [style.width.px]="width" size="tiny">
      <nb-option-group
        *ngFor="let optionGroup of optionGroups$ | async"
        [title]="optionGroup.name"
        [bcOptionGroupIcon]="iconTemplate"
      >
        <ng-template #iconTemplate>
          <nb-icon
            *ngIf="getOptionGroupIcon(optionGroup.itemSource)"
            [icon]="getOptionGroupIcon(optionGroup.itemSource)"
            pack="bakery"
          >
          </nb-icon>
        </ng-template>
        <nb-option
          *ngFor="let option of optionGroup.options; trackBy: optionTrackBy"
          [value]="option.originalOption"
          (click)="onOptionSelect(option.originalOption, optionGroup.itemSource)"
        >
          <span class="store-item-id">{{ option.idPart }}</span>
          <span class="store-item-value text-hint">{{ option.valuePart }}</span>
        </nb-option>
      </nb-option-group>
    </nb-option-list>
  `,
  styleUrls: ['./store-item-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreItemSelectorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private search$ = new BehaviorSubject<string>('');
  private readonly searchDebounce = 150;
  private readonly searchTermsSeparator = '.';
  private readonly unknownValueCommonPlaceholder = '{...}';
  private readonly unknownValueListItemPlaceholder = '{}';
  private readonly unknownValueListItemIndexPlaceholder = '0';

  private options$ = new BehaviorSubject<OptionGroupModel[]>([]);

  width: number;

  optionGroups$ = new BehaviorSubject<OptionGroupModel[]>([]);

  @ViewChild('searchInput', { static: true, read: ElementRef }) searchInput: ElementRef<HTMLInputElement>;
  @ViewChildren(NbOptionComponent) optionComponents: QueryList<NbOptionComponent<SelectorOption>>;

  @Output() selectedChange = new EventEmitter<SelectChange>();

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const allOptionGroups$: Observable<OptionGroupModel[]> = this.options$.pipe(
      map((optionalGroups: OptionGroupModel[]) => {
        return optionalGroups
          .map((optionGroup: OptionGroupModel) => {
            const order = typeof optionGroup.order === 'number' ? optionGroup.order : Number.MAX_SAFE_INTEGER;
            return { ...optionGroup, order };
          })
          .sort((x: OptionGroupModel, y: OptionGroupModel) => x.order - y.order);
      }),
      takeUntil(this.destroy$)
    );

    const debouncedSearch$ = this.search$.pipe(debounceTime(this.searchDebounce));

    combineLatest([debouncedSearch$, allOptionGroups$])
      .pipe(
        map(([searchQuery, optionGroups]) => this.filterAndMap(searchQuery, optionGroups)),
        takeUntil(this.destroy$)
      )
      .subscribe((filteredOptionGroups: OptionGroupModel[]) => {
        this.optionGroups$.next(filteredOptionGroups);
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onOptionSelect(selected: SelectorOption, itemSource: ItemSource) {
    const change: SelectChange = { selected, itemSource };
    const { valueQueries } = this.splitSearchQueries(this.search$.value);

    // replace first queries from user search with option.path
    if (selected.path) {
      const optionPaths = selected.path.split(this.searchTermsSeparator);
      for (let i = 0; i < optionPaths.length; i++) {
        valueQueries[i] = optionPaths[i];
      }
    }
    if (valueQueries.length) {
      change.path = valueQueries.join(this.searchTermsSeparator);
    }

    this.selectedChange.emit(change);
  }

  onSearch(query: string) {
    this.search$.next(query);
  }

  setWidth(width: number) {
    this.width = width;
    this.cd.markForCheck();
  }

  optionTrackBy(i, option: OptionModel): string {
    return option.originalOption.id;
  }

  addOptionalGroups(...optionGroups: OptionGroup[]) {
    const mapped: OptionGroupModel[] = optionGroups.map(({ itemSource, name, options, order, namespace }) => {
      return { itemSource, name, options: options.map(o => this.withIdAndValueParts(o)), order, namespace };
    });
    this.options$.next(mapped);
  }

  focusSearch() {
    this.searchInput.nativeElement.focus();
  }

  getOptionGroupIcon(source: ItemSource): string {
    return SOURCE_ICON.get(source);
  }

  selectOption(option: NbOptionComponent<SelectorOption>) {
    const optionGroup = this.optionGroups$.value.find((group: OptionGroupModel) => {
      return group.options.some(o => o.originalOption === option.value);
    });

    if (optionGroup) {
      this.onOptionSelect(option.value, optionGroup.itemSource);
    }
  }

  // I hope this code will be deleted
  private filterAndMap(searchQuery: string, optionGroups: OptionGroupModel[]): OptionGroupModel[] {
    const parsedSearch = this.splitSearchQueries(searchQuery);

    if (!parsedSearch.idQuery) {
      return optionGroups;
    }

    const id = parsedSearch.idQuery.toLowerCase();
    const matchingGroups: OptionGroupModel[] = [];

    for (const { itemSource, options, name, namespace } of optionGroups) {
      let filteredOptions = options.filter(({ originalOption }: OptionModel) => {
        const optionName = originalOption.name.toLowerCase();
        const groupNamespace = namespace.toLowerCase();
        const namespaceIncludes = groupNamespace.includes(id);
        const nameIncludes = optionName.includes(id);
        const nameAndNamespaceIncludes = (groupNamespace + '.' + optionName).includes(id);
        const path = parsedSearch.valueQueries.join(this.searchTermsSeparator);
        let pathIncludes = true;
        if (path && originalOption.path) {
          pathIncludes = originalOption.path.toLowerCase().includes(parsedSearch.valueQueries[0].toLowerCase());
        }
        return (nameIncludes || namespaceIncludes || nameAndNamespaceIncludes) && pathIncludes;
      });

      if (filteredOptions.length) {
        filteredOptions = filteredOptions.map((o: OptionModel) =>
          this.withIdAndValueParts(o.originalOption, parsedSearch.valueQueries)
        );
        matchingGroups.push({ itemSource, options: filteredOptions, name, namespace });
      }
    }

    return matchingGroups;
  }

  // I hope this code will be deleted
  private splitSearchQueries(searchQuery: string): { idQuery: string; valueQueries?: string[] } {
    // Split search string into queries. Search term part before the first separator is a idQuery
    // and we search it against StoreItem.id property. All remaining parts are searched against
    // StoreItem.value property.
    // filter(q => !!q) is used to filter out value queries if just first separator was entered or
    // user entered multiple separators in a row.
    let idQuery: string;
    let valueQueries: string[];
    [idQuery, ...valueQueries] = searchQuery.split(this.searchTermsSeparator).filter(q => !!q);

    if (idQuery && dataNamespaces.includes(idQuery.split(this.searchTermsSeparator)[0])) {
      if (valueQueries.length) {
        idQuery = idQuery + this.searchTermsSeparator + valueQueries[0];
        valueQueries.unshift();
      }
    }

    if (idQuery) {
      const idQueries = idQuery.split(this.searchTermsSeparator);
      const realOptionId = idQueries.length > 1 ? idQueries[1] : null;
      if (realOptionId) {
        valueQueries.shift();
      }
    }

    return { idQuery, valueQueries };
  }

  // I hope this code will be deleted
  private withIdAndValueParts(option: SelectorOption, valueQueries: string[] = []): OptionModel {
    // replace first queries from user search with option.path
    if (option.path) {
      const optionPaths = option.path.split(this.searchTermsSeparator);
      for (let i = 0; i < optionPaths.length; i++) {
        valueQueries[i] = optionPaths[i];
      }
    }

    let idPart = `${option.name}`;
    const propAccessors = valueQueries.join(this.searchTermsSeparator);
    if (propAccessors.length) {
      idPart = `${idPart}.${propAccessors}`;
    }

    if (option.valueType !== StoreItemType.OBJECT && option.valueType !== StoreItemType.ARRAY) {
      return { originalOption: option, idPart, valuePart: option.value };
    }

    let valuePart = this.unknownValueCommonPlaceholder;
    try {
      let { value } = option;
      value = value || {};
      if (typeof value === 'string') {
        value = JSON.parse(value);
      }
      const extractedValue = propAccessors ? getDeepValue(value, propAccessors) : value;
      if (extractedValue != null) {
        valuePart = JSON.stringify(extractedValue);
      }
    } catch {
    }

    if (option.sourceType === ItemSourceType.LIST_ITEM) {
      valuePart = this.unknownValueListItemPlaceholder;
    }
    if (option.sourceType === ItemSourceType.LIST_ITEM_INDEX) {
      valuePart = this.unknownValueListItemIndexPlaceholder;
    }

    return { originalOption: option, idPart, valuePart };
  }
}
