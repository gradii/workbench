import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsService, ThemeFont } from '@common';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Component({
  selector: 'ub-theme-text-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-text-settings.component.scss'],
  template: `
    <nb-accordion multi>
      <nb-accordion-item expanded>
        <nb-accordion-item-header>WEB FONT</nb-accordion-item-header>
        <nb-accordion-item-body [formGroup]="formGroup">
          <div class="input-container">
            <label class="label setting-field-label">Link</label>
            <input
              type="text"
              nbInput
              fullWidth
              placeholder="https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
              formControlName="link"
            />
          </div>

          <div class="input-container">
            <span>
              <label class="label setting-field-label">Name</label>
              <nb-icon
                icon="question-mark-circle-outline"
                nbTooltipClass="theme-text-settings-name-popover"
                nbTooltip="Write the actual name of your font (f.e. Open Sans)"
              >
              </nb-icon>
            </span>
            <input
              type="text"
              nbInput
              fullWidth
              placeholder="Open Sans"
              (blur)="logFontChanged()"
              formControlName="name"
            />
          </div>

          <div class="input-container">
            <label class="label setting-field-label">Fallback</label>
            <nb-select formControlName="fallback" fullWidth>
              <nb-option *ngFor="let option of fallbackFonts" [value]="option">{{ option }}</nb-option>
            </nb-select>
          </div>

          <div class="input-container">
            <label class="label setting-field-label">Licence</label>
            <textarea nbInput fullWidth formControlName="licence"></textarea>
          </div>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  `
})
export class ThemeTextSettingsComponent implements OnDestroy, OnInit {
  fallbackFonts: string[] = [
    'Open Sans, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Times, serif',
    'Courier New, monospace',
    'Courier, monospace',
    'sans-serif',
    'serif',
    'monospace'
  ];

  defaultThemeFont: ThemeFont = {
    link: '',
    name: '',
    fallback: this.fallbackFonts[0],
    licence: ''
  };

  formGroup: FormGroup = this.fb.group({
    link: this.fb.control(''),
    name: this.fb.control(''),
    fallback: this.fb.control(''),
    licence: this.fb.control('')
  });

  private destroyed$ = new Subject();

  constructor(private themeFacade: ThemeFacade, private analytics: AnalyticsService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.themeFacade.activeTheme$.pipe(takeUntil(this.destroyed$)).subscribe(theme => {
      const fontValue: ThemeFont = theme.font ? theme.font : this.defaultThemeFont;
      this.formGroup.patchValue(fontValue, { emitEvent: false });
    });

    this.formGroup.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(
          (a, b) => a.name === b.name && a.link === b.link && a.fallback === b.fallback && a.licence === b.licence
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe((value: ThemeFont) => this.updateFonts(value));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  updateFonts(value: ThemeFont) {
    this.themeFacade.updateFont(value);
  }

  logFontChanged(): void {
    this.analytics.logFontChanged(this.formGroup.controls.name.value);
  }
}
