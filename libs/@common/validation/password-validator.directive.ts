import { Directive } from '@angular/core';
import { UntypedFormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

const SPACE_REGEXP = /\s/;

@Directive({
  selector: '[bcPasswordValidator][ngModel], [bcPasswordValidator][formControlName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true
    }
  ]
})
export class PasswordValidatorDirective implements Validator {
  validate(control: UntypedFormControl): ValidationErrors {
    if (SPACE_REGEXP.test(control.value)) {
      return {
        space: {
          valid: false
        }
      };
    } else {
      return null;
    }
  }
}
