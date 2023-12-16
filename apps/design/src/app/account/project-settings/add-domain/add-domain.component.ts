import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { validDomain } from '../domain.validator';

@Component({
  selector: 'ub-add-domain',
  templateUrl: './add-domain.component.html',
  styleUrls: ['./add-domain.component.scss']
})
export class AddDomainComponent {
  @Output() addDomain = new EventEmitter<string>();

  form = new FormGroup({ domain: new FormControl('', [validDomain]) });

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
