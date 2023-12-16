import { Injectable } from '@angular/core';
import { InterpolationType, Scope } from '@common';

export const INTERPOLATION_REGEXP = /{{([^}]*)}}/gm;

@Injectable({ providedIn: 'root' })
export class InterpolateService {
  containInterpolation(value: any): boolean {
    return typeof value === 'string' && new RegExp(INTERPOLATION_REGEXP).test(value);
  }

  interpolate(value: string, scope: Scope, interpolationType: InterpolationType): any {
    // value could be an object for charts/smart-table
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }

    let codeString: string;
    if (interpolationType === InterpolationType.STRING) {
      codeString = this.interpolateStringToCode(value);
    } else {
      codeString = this.interpolateCodeToCode(value, interpolationType);
    }

    return this.executeCode(codeString, scope);
  }

  interpolateSafe(value: string, scope: Scope, interpolationType: InterpolationType) {
    try {
      return this.interpolate(value, scope, interpolationType);
    } catch {
      return null;
    }
  }

  // replace all interpolation with variable name
  // examples:
  // 'Math.max({{ $var1 }}, {{ $var2 + $var3 }})' -> 'return Math.max( $var1 ,  $var2 + $var3 )'
  // '{ id: 1, name: `${ {{ var1 }} }` }' => 'return { id: 1, name: `${ var1 }`}'
  public interpolateCodeToCode(str: string, interpolationType: InterpolationType) {
    let codeContent = str.replace(new RegExp(INTERPOLATION_REGEXP), '$1');
    if (!codeContent.includes('return') && interpolationType !== InterpolationType.CUSTOM_CODE) {
      codeContent = `return ${codeContent}`;
    }
    return codeContent;
  }

  // replace all interpolation with js template string
  // example:
  // 'text {{ $var1 }} + {{ $var2 + $var3 }}' -> 'return `text ${ $var1 } + ${ $var2 + $var3 }`'
  private interpolateStringToCode(str: string) {
    const stringContent = str.replace(new RegExp(INTERPOLATION_REGEXP), '${$1}');
    return `return \`${stringContent}\``;
  }

  private executeCode(codeString: string, scope: Scope): any {
    const interpolatedCode: string = this.interpolateCodeToCode(codeString, InterpolationType.CUSTOM_CODE);
    const { names, values } = this.buildCodeArguments(scope);

    return new Function(...names, interpolatedCode)(...values);
  }

  private buildCodeArguments(scope: Scope): { names; values } {
    const names: string[] = [];
    const values: string[] = [];

    for (const [key, val] of Object.entries(scope.values)) {
      names.push(key);
      values.push(val);
    }

    return { names, values };
  }
}
