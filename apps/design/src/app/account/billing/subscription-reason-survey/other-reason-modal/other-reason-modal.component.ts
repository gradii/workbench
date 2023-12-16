import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AnalyticsService, containsAtLeastNChars, getConfigValue } from '@common';
import { DialogRef } from '@shared/dialog/dialog-ref';

@Component({
  selector: 'ub-other-reason-modal',
  templateUrl: './other-reason-modal.component.html',
  styleUrls: ['./other-reason-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherReasonModalComponent {
  @Input() planName: string;

  reasonForm: FormGroup = this.fb.group({
    reason: [
      '',
      [Validators.required, containsAtLeastNChars(getConfigValue('account.subscription.upgradeReasonMinLength'))]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef<OtherReasonModalComponent>,
    private analyticsService: AnalyticsService
  ) {
  }

  sendReason() {
    this.analyticsService.logSubscriptionReason(this.reasonForm.value.reason, this.planName);
    this.dialogRef.close();
  }
}
