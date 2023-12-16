import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Theme } from '@common';

@Component({
  selector: 'ub-other-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./other-colors.component.scss'],
  template: `
    <nb-tabset class="sub-tabs">
      <nb-tab tabTitle="Texts" tabIcon="text-outline">
        <span class="label description">Colors are generated automatically</span>
        <ub-color-input [color]="text" label="Basic text"></ub-color-input>
        <ub-color-input [color]="textHint" label="Hint"></ub-color-input>
        <ub-color-input [color]="textAlternative" label="Alternative"></ub-color-input>
        <ub-color-input [color]="textDisabled" label="Disabled"></ub-color-input>
        <ub-color-input [color]="textAccent" label="Accent (link)"></ub-color-input>
      </nb-tab>
      <nb-tab tabTitle="Grounds" tabIcon="droplet">
        <span class="label description">Default background</span>
        <ub-color-input [color]="cardBg" label="Cards"></ub-color-input>
        <ub-color-input [color]="bg1" label="Background 1"></ub-color-input>
        <ub-color-input [color]="bg2" label="Background 2"></ub-color-input>
        <ub-color-input [color]="bg3" label="Background 3"></ub-color-input>
      </nb-tab>
    </nb-tabset>
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
