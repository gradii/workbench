import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-page-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page-filter.component.scss'],
  template: `
    <bc-input-icon icon="search-outline">
      <input
        nbInput
        fullWidth
        class="filter-input"
        type="text"
        placeholder="Search"
        [ngModel]="pageFilter"
        (ngModelChange)="pageFilterChange.emit($event)"
      />
    </bc-input-icon>
  `
})
export class PageFilterComponent {
  @Input() pageFilter: string;
  @Output() pageFilterChange: EventEmitter<string> = new EventEmitter();
}
