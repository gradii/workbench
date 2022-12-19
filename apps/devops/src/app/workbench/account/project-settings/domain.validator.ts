import { UntypedFormControl } from '@angular/forms';

export function validDomain(control: UntypedFormControl) {
  const domainRegExp = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
  const isValid = domainRegExp.test(control.value || '');

  return isValid ? null : { invalidDomain: true };
}
