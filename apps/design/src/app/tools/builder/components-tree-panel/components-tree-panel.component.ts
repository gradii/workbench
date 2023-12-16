import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: `ub-components-tree-panel`,
  styleUrls: ['./component-tree-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel-header">
      <span>COMPONENT TREE</span>
    </div>
    <ub-tree-element-list></ub-tree-element-list>
  `
})
export class ComponentsTreePanelComponent {
}
