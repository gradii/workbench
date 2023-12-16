import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { getUniqueName, nextId, StoreItem, StoreItemType } from '@common';
import { StoreItemFacade } from '@tools-state/data/store-item/store-item-facade.service';

const STORE_ITEM_STUB_NAME = 'newVariable';

@Injectable()
export class StoreItemUtilService {
  private selectedStoreItemId: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  readonly selectedStoreItemId$: Observable<string> = this.selectedStoreItemId.asObservable();

  storeItemList$: Observable<StoreItem[]> = this.storeItemFacade.storeItemList$;

  selectedStoreItem$: Observable<StoreItem> = combineLatest([this.storeItemList$, this.selectedStoreItemId$]).pipe(
    map(([storeItemList, id]: [StoreItem[], string]) => {
      return storeItemList.find((s: StoreItem) => s.id === id);
    })
  );

  constructor(private storeItemFacade: StoreItemFacade) {
  }

  duplicateStoreItem(storeItem: StoreItem): Observable<string> {
    return this.getNextUniqueName().pipe(
      map((newName: string) => {
        const newId: string = nextId();
        const newStoreItem = JSON.parse(JSON.stringify({ ...storeItem, id: newId, name: newName }));
        this.storeItemFacade.createStoreItem(newStoreItem);
        return newId;
      })
    );
  }

  selectStoreItem(storeItemId: string) {
    this.selectedStoreItemId.next(storeItemId);
  }

  saveStoreItem(storeItem: StoreItem): Observable<string> {
    if (!storeItem.id) {
      storeItem.id = nextId();
      this.storeItemFacade.createStoreItem(storeItem);
    } else {
      this.storeItemFacade.updateStoreItem({ id: storeItem.id, changes: { ...storeItem } });
    }
    return of(storeItem.id);
  }

  initializeOrCopy(storeItem?: StoreItem): Observable<StoreItem> {
    if (!storeItem || storeItem.id === null) {
      return this.getNextUniqueName().pipe(
        map((newName: string) => {
          return this.copy({
            id: null,
            name: newName,
            value: '',
            valueType: StoreItemType.STRING,
            initialValue: ''
          });
        })
      );
    } else {
      return of(this.copy(storeItem));
    }
  }

  getTypedValue(value: any, valueType: StoreItemType) {
    if (valueType === StoreItemType.OBJECT || (valueType === StoreItemType.ARRAY && typeof value === 'string')) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = null;
      }
    }
    return value;
  }

  getNextUniqueName(stubName?: string): Observable<string> {
    const previousName = stubName ? stubName : STORE_ITEM_STUB_NAME;
    return this.storeItemFacade.storeItemList$.pipe(
      take(1),
      map((storeItemList: StoreItem[]) => this.generateUniqueName(previousName, storeItemList))
    );
  }

  private copy(storeItem: StoreItem) {
    return JSON.parse(JSON.stringify(storeItem));
  }

  private generateUniqueName(nextName: string, list: StoreItem[]) {
    const takenNames: string[] = list.map((item: StoreItem) => item.name);
    return getUniqueName(takenNames, nextName);
  }
}
