import {
  ChangeDetectionStrategy,
  ɵmarkDirty,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { StoreItem, StoreItemType, Workflow } from '@common/public-api';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { StoreItemUtilService } from '../../util/store-item-util.service';

@Component({
  selector: 'pf-state-variable-list',
  templateUrl: './state-manager-list.component.html',
  styleUrls: ['./state-manager-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateManagerListComponent implements OnDestroy, OnInit {
  @Input() createMode: boolean;

  private destroyed$: Subject<void> = new Subject();
  private filterValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  filteredStoreItemList$: Observable<StoreItem[]> = combineLatest([
    this.storeItemUtils.storeItemList$,
    this.filterValue$.asObservable()
  ]).pipe(map(([itemList, filterString]: [StoreItem[], string]) => this.filterStoreItemList(itemList, filterString)));

  selectedStoreItemId: string;

  get newStoreItemStub() {
    return this.storeItemUtils.getNextUniqueName().pipe(
      map(name => {
        return {
          id: null,
          name,
          value: '',
          valueType: StoreItemType.STRING,
          initialValue: ''
        };
      }),
      takeUntil(this.destroyed$)
    );
  }

  @Output() create: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<StoreItem> = new EventEmitter<StoreItem>();
  @Output() duplicate: EventEmitter<StoreItem> = new EventEmitter<StoreItem>();
  @Output() selectStoreItem: EventEmitter<string> = new EventEmitter<string>();

  constructor(private storeItemUtils: StoreItemUtilService, ) {
  }

  ngOnInit() {
    this.storeItemUtils.selectedStoreItemId$.pipe(takeUntil(this.destroyed$)).subscribe((storeItemId: string) => {
      this.selectedStoreItemId = storeItemId;
      ɵmarkDirty(this);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  trackById(workflow: Workflow) {
    return workflow.id;
  }

  filterByName(filterString: string) {
    this.filterValue$.next(filterString);
  }

  private filterStoreItemList(storeItemList: StoreItem[], searchValue: string) {
    if (!searchValue) {
      return storeItemList;
    }
    return storeItemList.filter(storeItem => {
      if (storeItem.id === this.selectedStoreItemId) {
        return true;
      }
      return storeItem.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    });
  }
}
