import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Theme } from '@common';

@Component({
  selector: 'len-other-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./other-colors.component.scss'],
  template: `
    <tri-tab-group class="sub-tabs">
      <tri-tab title="Texts">
        <span class="label description">Colors are generated automatically</span>
        <len-color-input [color]="text" label="Basic text"></len-color-input>
        <len-color-input [color]="textHint" label="Hint"></len-color-input>
        <len-color-input [color]="textAlternative" label="Alternative"></len-color-input>
        <len-color-input [color]="textDisabled" label="Disabled"></len-color-input>
        <len-color-input [color]="textAccent" label="Accent (link)"></len-color-input>
      </tri-tab>
      <tri-tab title="Grounds">
        <span class="label description">Default background</span>
        <len-color-input [color]="cardBg" label="Cards"></len-color-input>
        <len-color-input [color]="bg1" label="Background 1"></len-color-input>
        <len-color-input [color]="bg2" label="Background 2"></len-color-input>
        <len-color-input [color]="bg3" label="Background 3"></len-color-input>
      </tri-tab>
    </tri-tab-group>
  `
})
export class OtherColorsComponent {
  @Input() theme: Theme;

  get cardBg(): string {
    return this.theme.dark ? this.theme.colors.basic._800 : this.theme.colors.basic._100;
  }

  get bg1(): string {
    return this.theme.dark ? this.theme.colors.basic._900 : this.theme.colors.basic._200;
  }

  get bg2(): string {
    return this.theme.dark ? this.theme.colors.basic._1000 : this.theme.colors.basic._300;
  }

  get bg3(): string {
    return this.theme.dark ? this.theme.colors.basic._1100 : this.theme.colors.basic._400;
  }

  get text(): string {
    return this.theme.dark ? this.theme.colors.basic._100 : this.theme.colors.basic._900;
  }

  get textHint(): string {
    return this.theme.dark ? this.theme.colors.basic._600 : this.theme.colors.basic._600;
  }

  get textAlternative(): string {
    return this.theme.dark ? this.theme.colors.basic._900 : this.theme.colors.basic._100;
  }

  get textDisabled(): string {
    return this.theme.dark ? this.theme.colors.basic._700 : this.theme.colors.basic._500;
  }

  get textAccent(): string {
    return this.theme.colors.primary._500;
  }
}
