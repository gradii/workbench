import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: `pf-components-tree-panel`,
  styleUrls: ['./component-tree-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel-header">
      <span>COMPONENT TREE</span>
    </div>
    <pf-tree-element-list></pf-tree-element-list>
  `
})
export class ComponentsTreePanelComponent {
}
