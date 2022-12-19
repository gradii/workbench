import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentSize, SpaceHeight, SpaceHeightType, SpaceWidth, SpaceWidthType } from '@common/public-api';

/**
 * TODO
 * temporary adapter to match size-settings-field with space sizing model.
 * Since we have different models for space and the rest of components we ought to use adapter for now.
 * As soon as it even possible we ought to write a migration to make model the same for components and spaces.
 * */
export interface SpaceSize {
  width: SpaceWidth;
  height: SpaceHeight;
}

@Component({
  selector: 'pf-space-size-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ub-size-settings-field
      [withAuto]="true"
      [value]="size"
      [widthUnitList]="unitList"
      [widthDisabled]="widthDisabled"
      (valueChange)="updateSize($event)"
    >
    </ub-size-settings-field>
  `
})
export class SpaceSizeFieldComponent {
  @Input() value: SpaceSize;
  @Input() unitList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' },
    { label: 'col', value: 'col' }
  ];
  @Input() widthDisabled = false;

  @Output() valueChange = new EventEmitter<SpaceSize>();

  get size() {
    const { width, height } = this.value;
    const widthValue = width.customValue;
    const widthUnit = width.customUnit;
    const widthAuto = width.type === SpaceWidthType.AUTO;

    const heightValue = height.customValue;
    const heightUnit = height.customUnit;
    const heightAuto = height.type === SpaceHeightType.AUTO;

    return { widthValue, widthUnit, widthAuto, heightValue, heightUnit, heightAuto };
  }

  updateSize(size: ComponentSize) {
    const spaceSize: SpaceSize = {
      width: {
        customValue: size.widthValue,
        customUnit: size.widthUnit,
        type: size.widthAuto ? SpaceWidthType.AUTO : SpaceWidthType.CUSTOM
      },
      height: {
        customValue: size.heightValue,
        customUnit: size.heightUnit,
        type: size.heightAuto ? SpaceHeightType.AUTO : SpaceHeightType.CUSTOM
      }
    };

    this.valueChange.next(spaceSize);
  }
}
