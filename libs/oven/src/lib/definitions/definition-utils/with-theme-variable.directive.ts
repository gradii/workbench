import { Directive, Input } from '@angular/core';

import { PainterService } from '../../renderer/painter.service';

export const layoutBackgrounds = {
  primary: 'var(--color-primary-default)',
  success: 'var(--color-success-default)',
  warning: 'var(--color-warning-default)',
  danger: 'var(--color-danger-default)',
  info: 'var(--color-info-default)',
  alternate: 'var(--background-alternative-color-1)',
  disabled: 'var(--bg-disabled-color)',
  hint: 'var(--bg-hint-color)',
  default: 'var(--background-basic-color-1)'
};

export const textColors = {
  basic: 'var(--text-basic-color)',
  primary: 'var(--text-primary-color)',
  success: 'var(--text-success-color)',
  warning: 'var(--text-warning-color)',
  danger: 'var(--text-danger-color)',
  info: 'var(--text-info-color)',
  alternate: 'var(--text-alternative-color)',
  disabled: 'var(--text-disabled-color)',
  hint: 'var(--text-hint-color)',
  white: '#ffffff'
};

@Directive({ selector: '[ovenWithThemeVariable]' })
export class OvenWithThemeVariableDirective {
  @Input() set ovenWithThemeVariable(themeVariables: { [varName: string]: string }) {
    for (const varName in themeVariables) {
      if (themeVariables.hasOwnProperty(varName)) {
        this.painterService.updateVariable(varName, themeVariables[varName]);
      }
    }
  }

  constructor(private painterService: PainterService) {
  }
}
