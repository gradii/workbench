import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { dataNamespaces } from '../models/data.models';

// needs to validate names of page and workflows
// only words number and spaces, should starts from char
export const COMMON_NAME_PATTERN = /^[A-z]+[A-z\d\s]*$/;
// needs to validate names of components and store variables.
export const COMMON_VARIABLE_NAME_PATTERN = /^[$A-Z_][0-9A-Z_$]*$/i;

export function noWhitespaceValidator(control: UntypedFormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}

export function containsAtLeastNChars(chars: number) {
  return (control: UntypedFormControl) => {
    const charsRegExp = new RegExp(`[\-a-zA-Z0-9_+]{${chars},}`, 'g');
    const isValid = charsRegExp.test(control.value || '');
    return isValid ? null : { notEnoughChars: true };
  };
}

export function containsAtLeastNCharsOrWhitespace(chars: number) {
  return (control: UntypedFormControl) => {
    const charsRegExp = new RegExp(`[\-a-zA-Z0-9_+ ]{${chars},}`, 'g');
    const isValid = charsRegExp.test(control.value || '');
    return isValid ? null : { notEnoughChars: true };
  };
}

export function containsNoMoreNChars(chars: number) {
  return (control: UntypedFormControl) => {
    return (control.value || '').trim().length < chars ? null : { tooManyChars: true };
  };
}

export function reservedNamesValidator(c: UntypedFormControl) {
  return dataNamespaces.includes(c.value) ? { reserved: true } : null;
}

export function childrenValid(control: AbstractControl): ValidationErrors | null {
  if (control instanceof UntypedFormControl) {
    return control.valid ? null : control.errors;
  }

  if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
    const controlNames = Object.keys(control.controls);

    const allErrors = controlNames.reduce((errors: ValidationErrors, controlName: string) => {
      const childrenErrors = childrenValid(control.get(controlName)) || {};
      return { ...errors, ...childrenErrors };
    }, {});

    const hasErrors = !!Object.keys(allErrors).length;
    return hasErrors ? allErrors : null;
  }

  throw new Error(`Unknown control type. Control: ${control}`);
}
