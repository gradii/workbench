import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StoreItem } from '@common';
import { StoreItemFacade } from '@tools-state/data/store-item/store-item-facade.service';

@Injectable()
export class UniqueStoreItemNameValidator implements AsyncValidator {
  private originalName: string;
  private createMode = false;

  constructor(private storeItemFacade: StoreItemFacade) {
  }

  setOriginalName(name: string) {
    this.originalName = name;
  }

  setCreateMode(createMode: boolean) {
    this.createMode = createMode;
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.storeItemFacade.storeItemList$.pipe(
      take(1),
      map((data: StoreItem[]) => {
        const usedIds: string[] = data.map(d => d.name);
        if (!this.createMode && ctrl.value === this.originalName) {
          return null;
        }
        const notUnique = usedIds.includes(ctrl.value);
        return notUnique ? { unique: true } : null;
      })
    );
  }
}
