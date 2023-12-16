import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Theme } from '@common';

@Component({
  selector: 'ub-theme-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-preview.component.scss'],
  template: `
    <div class="card" [ngStyle]="cardStyles">
      <div class="text-container">
        <div>
          <span class="subtitle" [style.color]="subtitleColor">Subtitle</span>
          <nb-icon icon="star-outline" [options]="iconOptions"></nb-icon>
        </div>
        <p class="caption" [style.color]="captionColor">Caption</p>
      </div>
      <div class="colored-container">
        <div class="button" [style.color]="buttonColor" [style.background-color]="buttonBgColor">
          TEXT
        </div>
        <div class="figures-container" [attr.style]="figureColors">
          <div [style.background-color]="theme.colors.info._500">
            <div class="rhombus"></div>
          </div>
          <div [style.background-color]="theme.colors.success._500">
            <div class="circle"></div>
          </div>
          <div [style.background-color]="theme.colors.warning._500">
            <div class="triangle"></div>
          </div>
          <div [style.background-color]="theme.colors.danger._500">
            <div class="stop"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ThemePreviewComponent {
  @Input() theme: Theme;

  @HostBinding('style.background-color') get bg(): string {
    return this.theme.dark ? this.theme.colors.basic._1000 : this.theme.colors.basic._300;
  }

  get cardBgColor(): string {
    return this.theme.dark ? this.theme.colors.basic._800 : this.theme.colors.basic._100;
  }

  get cardStyles() {
    return {
      'background-color': this.cardBgColor,
      'box-shadow': this.theme.shadow
    };
  }

  get buttonBgColor(): string {
    return this.theme.colors.primary._500;
  }

  get buttonColor(): string {
    return this.theme.colors.basic._100;
  }

  get subtitleColor(): string {
    return this.theme.dark ? this.theme.colors.basic._100 : this.theme.colors.basic._1000;
  }

  get captionColor(): string {
    return this.theme.dark ? this.theme.colors.basic._500 : this.theme.colors.basic._700;
  }

  get iconOptions() {
    return { fill: this.captionColor };
  }

  get figureColors() {
    return this.sanitizer.bypassSecurityTrustStyle(`
      --figure-stop-bg: ${this.theme.colors.danger._500};
      --figure-color: ${this.buttonColor};
    `);
  }

  constructor(private sanitizer: DomSanitizer) {
  }
}
