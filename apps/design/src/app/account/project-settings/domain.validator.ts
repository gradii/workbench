import { FormControl } from '@angular/forms';

export function validDomain(control: FormControl) {
  const domainRegExp = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
  const isValid = domainRegExp.test(control.value || '');

  return isValid ? null : { invalidDomain: true };
}
