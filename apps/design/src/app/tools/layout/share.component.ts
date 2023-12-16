import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProjectFacade } from '@tools-state/project/project-facade.service';

@Component({
  selector: 'ub-share-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./share-popup.component.scss'],
  template: `
    <div class="link-container">
      <span *ngIf="enabled" class="share-label">Your read-only link copied to clipboard</span>
      <input *ngIf="enabled" #input class="share-link" [value]="link" disabled />
      <span *ngIf="!enabled" class="share-label">Sharing is disabled</span>
      <span *ngIf="!enabled" class="share-link disabled">https://your-link</span>
      <bc-icon class="loading" *ngIf="loading" name="sync"></bc-icon>
    </div>

    <nb-checkbox
      [checked]="enabled"
      [disabled]="loading"
      [class.disabled]="loading"
      (checkedChange)="enableChange.emit($event)"
    >
      Enable
    </nb-checkbox>
  `
})
export class SharePopupComponent implements OnInit {
  @Input() enabled: boolean;

  @Input() link: string;

  @Input() loading: boolean;

  @ViewChild('input') set input(input: ElementRef) {
    if (input) {
      this.copyLink(input.nativeElement);
    }
  }

  @Output() enableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(@Inject(DOCUMENT) private document) {
  }

  ngOnInit() {
    if (!this.enabled) {
      this.enableChange.emit(true);
    }
  }

  private copyLink(input: HTMLInputElement) {
    input.disabled = false;
    input.focus();
    input.select();
    this.document.execCommand('copy');
    input.setSelectionRange(0, 0, 'none');
    input.disabled = true;
  }
}

@Component({
  selector: 'ub-share-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="bakery-button"
      nbButton
      [nbPopover]="share"
      nbPopoverAdjustment="noop"
      nbPopoverPlacement="bottom-start"
      ghost
    >
      <bc-icon name="share"></bc-icon>
    </button>

    <ng-template #share>
      <ub-share-popup
        [enabled]="shareEnabled$ | async"
        [link]="shareLink$ | async"
        [loading]="shareLoading$ | async"
        (enableChange)="updateShare($event)"
      ></ub-share-popup>
    </ng-template>
  `
})
export class ShareButtonComponent {
  shareLink$: Observable<string> = this.projectFacade.shareLink$;
  shareLoading$: Observable<boolean> = this.projectFacade.shareLoading$;
  shareEnabled$: Observable<boolean> = this.projectFacade.shareLink$.pipe(map((link: string) => !!link));

  constructor(private projectFacade: ProjectFacade) {
  }

  updateShare(enable: boolean) {
    this.projectFacade.updateSharing(enable);
  }
}
