import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WidgetMetaDefinition } from '../../definitions/definition';

@Component({
  selector: 'oven-widget-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./widget-item.component.scss'],
  template: `
    <img class="preview-image" [src]="definition.previewImage" />
    <span class="widget-name">{{ definition.name }}</span>

    <div *ngIf="locked" class="lock-container">
      <bc-icon name="lock"></bc-icon>
    </div>
  `
})
export class WidgetItemComponent {
  @Input() definition: WidgetMetaDefinition;
  @Input() locked: boolean;
}
