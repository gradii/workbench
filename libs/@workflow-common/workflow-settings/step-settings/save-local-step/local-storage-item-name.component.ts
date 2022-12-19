import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalStorageItem } from '@common/public-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStorageFacadeService } from '../../../util/local-storage-facade.service';

@Component({
  selector       : 'ub-local-storage-item-name',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-form-field>
      <tri-icon triPrefix svgIcon="workbench:workflow-save-local-step"></tri-icon>
      <tri-select
        triInput
        fullWidth
        size="tiny"
        placeholder="Enter name"
        [ngModel]="itemId"
        (ngModelChange)="changeValue($event)"
        (valueChange)="selectOption($event)"
      >
        <tri-option *ngFor="let it of searchOptions$ | async" [value]="it.id">{{it.displayValue}}</tri-option>
      </tri-select>
    </tri-form-field>
  `
})
export class LocalStorageItemNameComponent {
  @Input() itemId: string;

  @Output() addItem    = new EventEmitter();
  @Output() selectItem = new EventEmitter<string>();

  searchOptions$: Observable<any[]> = this.localStorageFacade.getWorkflowItems().pipe(
    map((storageList: LocalStorageItem[]) => {
      return storageList.map(item => ({
        displayValue: item.name,
        id          : item.name,
        filterValues: [item.name],
        icon        : 'workflow-save-local-step',
        iconPack    : 'bakery'
      }));
    })
  );

  constructor(private localStorageFacade: LocalStorageFacadeService) {
  }

  selectOption(item: any) {
    this.itemId = item.id;
    this.selectItem.emit(item.id);
  }

  changeValue(value: string) {
    this.itemId = value;
    this.selectItem.emit(value);
  }
}
