import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AnalyticsService } from '@common';
import { NbDialogRef } from '@nebular/theme';

import { DialogRef } from '@shared/dialog/dialog-ref';
import { DialogService } from '@shared/dialog/dialog.service';
import { OtherReasonModalComponent } from './other-reason-modal/other-reason-modal.component';

class UpgradeReason {
  img: string;
  text: string;
}

const reasons: UpgradeReason[] = [
  {
    img: 'need-more-pages',
    text: 'Need more pages'
  },
  {
    img: 'need-more-apps',
    text: 'Need more apps'
  },
  {
    img: 'want-to-check-all-the-functionality',
    text: 'Want to check all the functionality'
  },
  {
    img: 'need-extended-painter',
    text: 'Need extended Painter'
  },
  {
    img: 'need-more-templates-or-widgets',
    text: 'Need more templates or widgets'
  }
];

const otherReason: UpgradeReason = {
  img: 'other-reason',
  text: 'Other reason'
};

@Component({
  selector: 'ub-subscription-reason-survey',
  templateUrl: './subscription-reason-survey.component.html',
  styleUrls: ['./subscription-reason-survey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionReasonSurveyComponent {
  reasons: UpgradeReason[] = reasons;
  otherReason: UpgradeReason = otherReason;

  @Input() planName: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef<SubscriptionReasonSurveyComponent>,
    private analyticsService: AnalyticsService,
    private dialogService: DialogService
  ) {
  }

  imgPath(reason: string): string {
    return `assets/upgrade-reasons/${reason}.svg`;
  }

  onSelect(reason: UpgradeReason) {
    this.analyticsService.logSubscriptionReason(reason.text, this.planName);
    this.closeModal();
  }

  private closeModal() {
    this.dialogRef.close();
  }

  onOtherReason() {
    const dialogRef: NbDialogRef<OtherReasonModalComponent> = this.dialogService.open(OtherReasonModalComponent, {
      closeOnEsc: false,
      closeOnBackdropClick: false
    });

    dialogRef.componentRef.instance.planName = this.planName;
    this.closeModal();
  }
}
