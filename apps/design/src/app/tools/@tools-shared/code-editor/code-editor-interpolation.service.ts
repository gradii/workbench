import { Injectable } from '@angular/core';

@Injectable()
export class CodeEditorInterpolationService {
  readonly interpolationStartText = '{{';

  generateInterpolation(expression: string, path?: string): string {
    path = path ? `.${path}` : '';
    return `{{${expression}${path}}}`;
  }
}
