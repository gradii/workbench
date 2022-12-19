import { Component } from '@angular/core';


@Component({
  selector: 'deploy-popup',
  template: `
    <div style="width: 250px" class="d-flex">
      <tri-list>
        <tri-list-item>
          <span>部署</span>
        </tri-list-item>
        <tri-list-item>
          <button triButton>查看日志</button>
          <button triButton>部署</button>
        </tri-list-item>
      </tri-list>
    </div>
  `
})
export class DeployPopupComponent {
  constructor() {
  }

}
