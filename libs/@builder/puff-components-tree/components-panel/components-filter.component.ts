import { Component } from '@angular/core';

@Component({
  selector: 'pf-components-filter',
  template: `
    <tri-input-group>
      <input
        triInput
        fullWidth
        placeholder="Search"
      />
      <ng-template #prefix>
        <tri-icon svgIcon="eva-outline:search-outline"></tri-icon>
      </ng-template>
    </tri-input-group>
  `
})
export class ComponentsFilterComponent {

}