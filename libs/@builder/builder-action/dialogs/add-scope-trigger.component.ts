import { Component } from '@angular/core';


@Component({
  selector: 'pf-add-scope-trigger',
  template: `
    <tri-card>
      <tri-card-header>
        Add Scope Trigger
        <tri-card-header-extra>
          <tri-icon triDialogClose svgIcon="outline:close"></tri-icon>
        </tri-card-header-extra>
      </tri-card-header>
      <tri-card-body>
        <form style="min-width: 300px">
          <div style="display: flex; flex-direction:column">

            <tri-form-field>
              <tri-label>Event Type</tri-label>
              <tri-select>
                <tri-option>
                  Custom
                </tri-option>
                <tri-optgroup>
                  Life Cycle
                  <tri-option>On Init</tri-option>
                  <tri-option>Do Check</tri-option>
                  <tri-option>On Changes</tri-option>
                  <tri-option>After View Init</tri-option>
                  <tri-option>After Children Checked</tri-option>
                  <tri-option>After View Checked</tri-option>
                </tri-optgroup>
              </tri-select>
            </tri-form-field>
            <tri-form-field>
              <tri-label>Trigger Name</tri-label>
              <input triInput />
              <!--              <tri-select></tri-select>-->
            </tri-form-field>
          </div>
        </form>
      </tri-card-body>
      <tri-card-footer>
        <button triButton>Add</button>
      </tri-card-footer>
    </tri-card>
  `
})
export class AddScopeTriggerComponent {

}