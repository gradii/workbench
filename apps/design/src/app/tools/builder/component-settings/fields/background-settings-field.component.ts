import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { OvenBackground, OvenImageSrc } from '@common';
import { BakeryComponent } from '@tools-state/component/component.model';

@Component({
  selector: 'ub-background-settings-field',
  styleUrls: ['./field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngClass]="{ 'no-tab-container': !noImage }">
      <ub-color-settings-field
        class="no-top-margin"
        name="Background color"
        [selected]="value?.color"
        [options]="backgroundOptions"
        [bg]="true"
        (selectedChange)="updateBackground({ color: $event })"
      ></ub-color-settings-field>
    </div>

    <ng-container *ngIf="!noImage">
      <ub-image-src-settings-field
        [value]="value?.imageSrc"
        [noTopMargin]="true"
        [component]="component"
        (valueChange)="updateBackground({ imageSrc: $event })"
      ></ub-image-src-settings-field>

      <div class="inner-field no-tab-container">
        <ub-dropdown-settings-field
          name="Fit"
          [showStyleNotification]="true"
          [selected]="value?.imageSize"
          [options]="sizeOptions"
          [disabled]="!canUseSrc"
          (selectedChange)="updateBackground({ imageSize: $event })"
        ></ub-dropdown-settings-field>
      </div>
    </ng-container>
  `
})
export class BackgroundSettingsFieldComponent {
  @Input() value: OvenBackground;
  @Input() backgroundOptions: { label: string; value: string }[];
  @Input() component: BakeryComponent;
  @Input() noImage: boolean;

  @Output() valueChange: EventEmitter<OvenBackground> = new EventEmitter<OvenBackground>();

  get canUseSrc(): boolean {
    if (!this.value || !this.value.imageSrc) {
      return false;
    }
    return this.hasSource(this.value.imageSrc);
  }

  sizeOptions = [
    { label: 'auto', value: 'auto' },
    { label: 'contain', value: 'contain' },
    { label: 'cover', value: 'cover' }
  ];

  updateBackground(background: Partial<OvenBackground>) {
    this.valueChange.emit({ ...this.value, ...background });
  }

  private hasSource(source: OvenImageSrc): boolean {
    if (!source) {
      return false;
    }
    const hasSourceUrl = !!(source.uploadUrl || source.url);

    return hasSourceUrl;
  }
}
