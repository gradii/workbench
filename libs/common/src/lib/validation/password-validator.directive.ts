import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

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
  validate(control: FormControl): ValidationErrors {
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
