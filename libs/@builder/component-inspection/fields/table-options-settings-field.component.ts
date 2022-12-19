import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterType } from '../components/smart-table-editor.component';

export interface SmartTableOption {
  id: string;
  title: string;
  filter?: any;
}

@Component({
  selector       : 'ub-table-options-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./options-settings-field.component.scss', 'table-options-settings-field.component.scss'],
  template       : `
    <div class="option" *ngFor="let option of options; let optionIndex = index; trackBy: trackByFn">
      <span class="option-label">Column {{ optionIndex + 1 }} title</span>
      <button *ngIf="canBeDeleted"
              triButton
              class="clear-icon"
              size="tiny"
              (click)="removeOption.emit(option.id)">
        <tri-icon svgIcon="outline:trash"></tri-icon>
      </button>
      <input
        triInput
        fullWidth
        [ngModel]="option.title"
        (ngModelChange)="updateTitle.emit({ id: option.id, value: $event })"
      />

      <div class="row">
        <div class="column">
          <div class="id-title-block">
            <span class="option-label">Id</span>
            <tri-icon
              svgIcon="alert-circle-outline"
              size="xsmall"
              triTooltip="Defines object key for data mapping"
            ></tri-icon>
          </div>
          <input
            triInput
            fullWidth
            [ngModel]="option.id"
            (ngModelChange)="updateId.emit({ id: option.id, value: $event })"
          />
        </div>
        <div class="column">
          <div class="id-title-block">
            <span class="option-label">Filter type</span>
          </div>
          <tri-select
            #selectRef
            class="bakery-dropdown filter-setting"
            shape="rectangle"
            [ubOverlayRegister]="selectRef"
            [value]="option.filter?.type ? option.filter.type : defaultFilterType"
            (valueChange)="updateFilter.emit({ id: option.id, value: $event })"
          >
            <tri-option *ngFor="let type of filterTypes" [value]="type.value">{{ type.label }}</tri-option>
          </tri-select>
        </div>
      </div>
    </div>

    <div class="add-container">
      <button triButton class="clear-icon" size="xsmall" (click)="createOption.emit()">
        <span class="add-label">Add column</span>
        <tri-icon svgIcon="outline:plus"></tri-icon>
      </button>
    </div>
  `
})
export class TableOptionsSettingsFieldComponent {
  @Input() defaultFilterType: string = FilterType.INPUT.value;
  @Input() filterTypes: FilterType[];
  @Input() options: SmartTableOption[];

  @Output() createOption: EventEmitter<void>                          = new EventEmitter<void>();
  @Output() removeOption: EventEmitter<string>                        = new EventEmitter<string>();
  @Output() updateFilter: EventEmitter<{ id: string; value: string }> = new EventEmitter<{
    id: string;
    value: string;
  }>();
  @Output() updateTitle: EventEmitter<{ id: string; value: string }>  = new EventEmitter<{
    id: string;
    value: string;
  }>();
  @Output() updateId: EventEmitter<{ id: string; value: string }>     = new EventEmitter<{ id: string; value: string }>();

  get canBeDeleted() {
    return this.options.length > 1;
  }

  trackByFn(index) {
    return index;
  }
}
