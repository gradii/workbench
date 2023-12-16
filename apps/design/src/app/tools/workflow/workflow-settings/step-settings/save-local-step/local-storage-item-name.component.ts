import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BcInputSearchOption, LocalStorageItem } from '@common';

import { LocalStorageFacadeService } from '../../../util/local-storage-facade.service';

@Component({
  selector: 'ub-local-storage-item-name',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-input-icon icon="workflow-save-local-step" iconPack="bakery">
      <input
        nbInput
        bcInputSearch
        fullWidth
        size="tiny"
        placeholder="Enter name"
        [ngModel]="itemId"
        [searchOptions]="searchOptions$ | async"
        (ngModelChange)="changeValue($event)"
        (selectValue)="selectOption($event)"
      />
    </bc-input-icon>
  `
})
export class LocalStorageItemNameComponent {
  @Input() itemId: string;

  @Output() addItem = new EventEmitter();
  @Output() selectItem = new EventEmitter<string>();

  searchOptions$: Observable<BcInputSearchOption[]> = this.localStorageFacade.getWorkflowItems().pipe(
    map((storageList: LocalStorageItem[]) => {
      return storageList.map(item => ({
        displayValue: item.name,
        id: item.name,
        filterValues: [item.name],
        icon: 'workflow-save-local-step',
        iconPack: 'bakery'
      }));
    })
  );

  constructor(private localStorageFacade: LocalStorageFacadeService) {
  }

  selectOption(item: BcInputSearchOption) {
    this.itemId = item.id;
    this.selectItem.emit(item.id);
  }

  changeValue(value: string) {
    this.itemId = value;
    this.selectItem.emit(value);
  }
}
