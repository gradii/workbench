import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import {
  ComponentMargins,
  ComponentPaddings,
  BoxSide,
  MarginUnit,
  MarginValue,
  PaddingUnit,
  PaddingValue
} from '@common/public-api';
import { CommunicationService } from '@shared/communication/communication.service';

export type SpacingProperty = 'margin' | 'padding';
export type SpacingPropertySides = ['Top', 'Left', 'Right', 'Bottom'];
export type SpacingPropertyValue = MarginValue | PaddingValue;
export type SpacingPropertyUnit = MarginUnit | PaddingUnit;

@Component({
  selector: 'ub-margin-padding',
  templateUrl: './margin-padding.component.html',
  styleUrls: ['./margin-padding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarginPaddingComponent {
  private readonly defaultValue = 0;
  private readonly defaultUnit = 'px';

  readonly orderedSides: SpacingPropertySides = ['Top', 'Left', 'Right', 'Bottom'];

  @Input() margin: ComponentMargins | undefined;
  @Input() marginDisabled = false;

  @Input() padding: ComponentPaddings | undefined;
  @Input() paddingDisabled = false;

  @Output() marginChange = new EventEmitter<ComponentMargins>();
  @Output() paddingChange = new EventEmitter<ComponentPaddings>();

  @ViewChild('paddingBox') paddingBox;

  constructor(private communication: CommunicationService) {
  }

  @HostListener('mouseover', ['$event'])
  mouseOverComponent(event: Event) {
    if (!this.paddingDisabled && this.paddingBox.nativeElement.contains(event.target)) {
      this.communication.setActiveSetting('padding');
    } else {
      this.communication.setActiveSetting('margin');
    }
  }

  @HostListener('mouseleave')
  mouseLeaveComponent() {
    this.communication.setActiveSetting(null);
  }

  getMarginValue(side: BoxSide): MarginValue {
    return this.getPropertyOrDefaultValue('margin', side);
  }

  getMarginUnit(side: BoxSide): MarginUnit {
    return this.getPropertyOrDefaultUnit('margin', side);
  }

  updateMarginValue(side, value: MarginValue) {
    const updatedMargins: Partial<ComponentMargins> = { [`margin${side}`]: value };
    const unitProp = `margin${side}Unit`;

    const shouldRemoveUnitProp = value === 'auto';
    const hasNoUnitSet = !this.margin || !this.margin[unitProp];
    const shouldInitUnitProp = !shouldRemoveUnitProp && hasNoUnitSet;

    if (shouldRemoveUnitProp) {
      updatedMargins[unitProp] = undefined;
    } else if (shouldInitUnitProp) {
      updatedMargins[unitProp] = this.defaultUnit;
    }

    this.emitMarginUpdate(updatedMargins);
  }

  updateMarginUnit(side: BoxSide, unit: MarginUnit) {
    const updatedMargins: Partial<ComponentMargins> = { [`margin${side}Unit`]: unit };
    const valueProp = `margin${side}`;

    const shouldInitValueProp = !this.margin || this.margin[valueProp] === 'auto';
    if (shouldInitValueProp) {
      updatedMargins[valueProp] = this.defaultValue;
    }

    this.emitMarginUpdate(updatedMargins);
  }

  getPaddingValue(side: BoxSide): PaddingValue {
    return this.getPropertyOrDefaultValue('padding', side) as PaddingValue;
  }

  getPaddingUnit(side: BoxSide): PaddingUnit {
    return this.getPropertyOrDefaultUnit('padding', side);
  }

  updatePaddingValue(side: BoxSide, value: PaddingValue) {
    const valueProp = `padding${side}`;
    const unitProp = `${valueProp}Unit`;
    const updatedPaddings: Partial<ComponentPaddings> = { [valueProp]: value };

    const shouldInitUnitProp = !this.padding || !this.padding[unitProp];
    if (shouldInitUnitProp) {
      updatedPaddings[unitProp] = this.defaultUnit;
    }

    this.emitPaddingUpdate(updatedPaddings);
  }

  updatePaddingUnit(side: BoxSide, unit: PaddingUnit) {
    const valueProp = `padding${side}`;
    const unitProp = `${valueProp}Unit`;
    const updatedPaddings: Partial<ComponentPaddings> = { [unitProp]: unit };

    const shouldInitValueProp = !this.padding || !this.padding[valueProp];
    if (shouldInitValueProp) {
      updatedPaddings[valueProp] = this.defaultValue;
    }

    this.emitPaddingUpdate(updatedPaddings);
  }

  private emitMarginUpdate(updatedMargin: Partial<ComponentMargins>) {
    this.marginChange.emit({ ...(this.margin || {}), ...updatedMargin });
  }

  private emitPaddingUpdate(updatedPadding: Partial<ComponentPaddings>) {
    this.paddingChange.emit({ ...(this.padding || {}), ...updatedPadding });
  }

  private getPropertyOrDefaultValue(property: SpacingProperty, side: BoxSide): SpacingPropertyValue {
    let value;

    if (this[property]) {
      const propertySide = `${property}${side}`;
      value = this[property][propertySide];
    }

    return value || this.defaultValue;
  }

  private getPropertyOrDefaultUnit(property: SpacingProperty, side: BoxSide): SpacingPropertyUnit {
    let unit;

    if (this[property]) {
      const unitProperty = `${property}${side}Unit`;
      unit = this[property][unitProperty];
    }

    return unit || this.defaultUnit;
  }
}
