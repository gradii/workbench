import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-page-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page-filter.component.scss'],
  template: `
    <tri-input-group>
      <input
        triInput
        fullWidth
        placeholder="Search"
        [ngModel]="pageFilter"
        (ngModelChange)="pageFilterChange.emit($event)"
      />
      <ng-template #prefix>
        <tri-icon svgIcon="eva-outline:search-outline"></tri-icon>
      </ng-template> 
    </tri-input-group>
  `
})
export class PageFilterComponent {
  @Input() pageFilter: string;
  @Output() pageFilterChange: EventEmitter<string> = new EventEmitter();
}
