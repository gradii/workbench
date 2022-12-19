import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { StepInfo } from '../workflow-info.model';

@Component({
  selector: 'ub-step-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['step-item.component.scss'],
  template: `
    <tri-icon [svgIcon]="icon" class="step-icon"></tri-icon>
    <div class="item-text">
      <span class="item-name">{{ stepItem.nameLabel }}</span>
      <span class="item-description" [class.item-description-active]="isActive">{{ stepItem.descriptionLabel }}</span>
    </div>
  `
})
export class StepItemComponent {
  @HostBinding('class.selected')
  @Input()
  isActive: boolean;

  @Input() stepItem: StepInfo;

  get icon() {
    return this.isActive ? this.stepItem.iconActive : this.stepItem.iconInactive;
  }
}
