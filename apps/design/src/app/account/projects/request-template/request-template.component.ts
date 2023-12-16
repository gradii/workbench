import { AfterViewInit, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

declare var hbspt;

@Component({
  selector: 'ub-request-template',
  templateUrl: './request-template.component.html',
  styleUrls: ['./request-template.component.scss']
})
export class RequestTemplateComponent implements AfterViewInit {
  constructor(private dialogRef: NbDialogRef<RequestTemplateComponent>) {
  }

  close() {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    hbspt.forms.create({
      portalId: '2452262',
      formId: '258d2c0a-255d-4dc6-a087-b93f050eabb3',
      target: '#hubsport-order-form'
    });
  }
}
