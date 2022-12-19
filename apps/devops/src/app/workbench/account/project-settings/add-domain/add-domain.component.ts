import { Component, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { validDomain } from '../domain.validator';

@Component({
  selector: 'len-add-domain',
  templateUrl: './add-domain.component.html',
  styleUrls: ['./add-domain.component.scss']
})
export class AddDomainComponent {
  @Output() addDomain = new EventEmitter<string>();

  form = new UntypedFormGroup({ domain: new UntypedFormControl('', [validDomain]) });

  get domain() {
    return this.form.controls['domain'];
  }

  add() {
    if (!this.domain.value) {
      return;
    }

    this.addDomain.next(this.domain.value);
  }
}
