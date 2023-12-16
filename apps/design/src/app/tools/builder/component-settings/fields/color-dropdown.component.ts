import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Theme } from '@common';
import { filter, take } from 'rxjs/operators';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector: 'ub-color-settings-option-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./color-dropdown.component.scss'],
  styles: [
    `
      :host {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `
  ],
  template: `
    <span>{{ option.label }}</span>
    <div class="color-preview" [ngClass]="classString"></div>
  `
})
export class ColorSettingsFieldOptionComponent {
  @Input() option: { label: string; value: string };
  @Input() bg: boolean;

  get classString(): string {
    return this.option.value + ' ' + (this.bg ? 'bg' : '');
  }
}

@Component({
  selector: 'ub-color-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss', './color-dropdown.component.scss'],
  template: `
    <ub-setting-label-container [showNotification]="showStyleNotification">
      <label class="settings-field-label">{{ name }}</label>
    </ub-setting-label-container>

    <div class="color-container" [attr.style]="colorVars">
      <nb-select
        [selected]="selected"
        (selectedChange)="selectedChange.emit($event)"
        #selectRef
        [ubOverlayRegister]="selectRef"
        ubOverlayRegister
        class="bakery-dropdown"
        shape="rectangle"
      >
        <nb-option *ngFor="let option of options" [value]="option.value">
          <ub-color-settings-option-field
            [attr.style]="colorVars"
            [option]="option"
            [bg]="bg"
          ></ub-color-settings-option-field>
        </nb-option>
      </nb-select>
      <div class="color-preview large" [ngClass]="previewClass"></div>
    </div>
  `
})
export class ColorSettingsFieldComponent {
  @Input() name = 'Status';
  @Input() selected: string;
  @Input() bg: boolean;
  @Input() options: { label: string; value: string }[];
  @Output() selectedChange: EventEmitter<string> = new EventEmitter();
  @Input() showStyleNotification = true;

  get colorVars(): SafeStyle {
    if (!this.theme) {
      return null;
    }
    const colors = this.theme.colors;
    const dark = this.theme.dark;
    return this.sanitizer.bypassSecurityTrustStyle(`
      --workbench-primary: ${colors.primary._500};
      --workbench-info: ${colors.info._500};
      --workbench-warning: ${colors.warning._500};
      --workbench-success: ${colors.success._500};
      --workbench-danger: ${colors.danger._500};

      --workbench-bg-color: ${dark ? colors.basic._800 : colors.basic._100};
      --workbench-bg-alternate-color: ${dark ? colors.basic._100 : colors.basic._800};
      --workbench-bg-hint-color: ${dark ? colors.basic._700 : colors.basic._200};
      --workbench-bg-disabled-color: ${dark ? colors.basic._900 : colors.basic._400};
      --workbench-text-color: ${dark ? colors.basic._100 : colors.basic._1000};
      --workbench-text-hint-color: ${dark ? colors.basic._600 : colors.basic._600};
      --workbench-text-alternate-color: ${dark ? colors.basic._800 : colors.basic._100};
      --workbench-text-control-color: ${dark ? colors.basic._100 : colors.basic._100};
      --workbench-text-disabled-color: ${dark ? colors.basic._700 : colors.basic._500};
    `);
  }

  get previewClass(): string {
    return this.selected + ' ' + (this.bg ? 'bg' : '');
  }

  private theme: Theme;

  constructor(private sanitizer: DomSanitizer, private themeFacade: ThemeFacade) {
    // theme cannot be change while builder screen is open;
    this.themeFacade.activeTheme$
      .pipe(
        filter(theme => !!theme),
        take(1)
      )
      .subscribe((theme: Theme) => (this.theme = theme));
  }
}
