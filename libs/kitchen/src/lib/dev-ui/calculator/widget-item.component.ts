import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WidgetMetaDefinition } from '../../definitions/definition';

@Component({
  selector: 'kitchen-widget-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./widget-item.component.scss'],
  template: `
    <img class="preview-image" [src]="definition.previewImage" />
    <span class="widget-name">{{ definition.name }}</span>

    <div *ngIf="locked" class="lock-container">
      <tri-icon svgIcon="outline:lock"></tri-icon>
    </div>
  `
})
export class WidgetItemComponent {
  @Input() definition: WidgetMetaDefinition;
  @Input() locked: boolean;
}
