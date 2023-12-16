import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AclService, AnalyticsService } from '@common';

@Component({
  selector: 'ub-download-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./download-popup.component.scss'],
  template: `
    <nb-list>
      <nb-list-item>
        <span class="subtitle-2">Download your project</span>
      </nb-list-item>

      <nb-list-item *ngIf="canDownloadCode$ | async">
        <p class="caption">
          The generated Angular project will include the following assets.
          <span *ngIf="!(canDownloadDataCode$ | async)"
            ><a routerLink="/plans">Upgrade</a> your plan to unlock the full code access.</span
          >
        </p>
        <ul>
          <li *ngFor="let item of downloadCapabilities$ | async">
            <nb-icon
              icon="checkmark-outline"
              [icon]="item.available ? 'checkmark-outline' : 'close-outline'"
              [status]="item.available ? 'success' : 'danger'"
            >
            </nb-icon>
            {{ item.capability }}
          </li>
        </ul>
      </nb-list-item>
      <nb-list-item *ngIf="canDownloadCode$ | async">
        <button
          [disabled]="loading"
          nbButton
          status="primary"
          size="small"
          fullWidth
          [nbSpinner]="loading"
          nbSpinnerSize="tiny"
          nbSpinnerMessage="Generating"
          (click)="emitDownload()"
        >
          Download Code
        </button>
      </nb-list-item>

      <nb-list-item class="no-access" *ngIf="!(canDownloadCode$ | async)">
        <p class="caption">
          Any UI Builder <a routerLink="/projects/create" [queryParams]="{ name: 'New Project' }">templates</a> are
          available for download in Free plan. <a routerLink="/plans">Upgrade</a> your plan to download custom project's
          code.
        </p>
        <picture class="aspect-ratio-100">
          <source srcset="assets/free-plan.png 1x, assets/free-plan@2x.png 2x" />
          <img src="assets/free-plan.png" srcset="assets/free-plan@2x.png 2x" />
        </picture>
      </nb-list-item>
      <nb-list-item *ngIf="!(canDownloadCode$ | async)">
        <button
          [disabled]="loading"
          nbButton
          status="primary"
          size="small"
          fullWidth
          [nbSpinner]="loading"
          nbSpinnerSize="tiny"
          nbSpinnerMessage="Generating"
          (click)="emitDownloadSample()"
        >
          Download Sample
        </button>
      </nb-list-item>
    </nb-list>
  `
})
export class DownloadPopupComponent implements OnInit {
  @Input() loading: boolean;

  @Output() download = new EventEmitter<void>();
  @Output() downloadSample = new EventEmitter<void>();

  canDownloadCode$: Observable<boolean> = this.acl.canDownloadCode();
  canDownloadDataCode$: Observable<boolean> = this.acl.canDownloadDataCode();
  downloadCapabilities$ = combineLatest([this.acl.canDownloadComponentsCode(), this.acl.canDownloadDataCode()]).pipe(
    map(([downloadComponent, downloadCode]) => {
      return [
        {
          available: downloadComponent,
          capability: 'Pages, components and data'
        },
        {
          available: downloadCode,
          capability: 'Actions and business logic'
        }
      ];
    })
  );

  constructor(private analyticsService: AnalyticsService, private acl: AclService) {
  }

  ngOnInit() {
    this.analyticsService.logOpenDownloadPopup();
  }

  emitDownload() {
    this.download.emit();
  }

  emitDownloadSample() {
    this.analyticsService.logDownloadSample();
    this.downloadSample.emit();
  }
}
