import { Component } from '@angular/core';

import { BuilderSidebarService } from '../../builder/builder-sidebar.service';

@Component({
  selector: 'ub-toggle-structure-panel',
  styleUrls: ['./toggle-structure-panel.component.scss'],
  template: `
    <button nbButton ghost title="Structure" class="bakery-button" (click)="toggleSettings()">
      <bc-icon name="layers"></bc-icon>
      <span class="dashboard-link-text">Structure</span>
    </button>
  `
})
export class ToggleStructurePanelComponent {
  constructor(private builderSidebarService: BuilderSidebarService) {
  }

  toggleSettings() {
    this.builderSidebarService.toggle();
  }
}
