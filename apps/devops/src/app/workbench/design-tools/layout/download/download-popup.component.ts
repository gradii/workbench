import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AclService, AnalyticsService } from '@common';

@Component({
  selector: 'len-download-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./download-popup.component.scss'],
  template: `
    <tri-list>
      <tri-list-item>
        <span class="subtitle-2">Download your project</span>
      </tri-list-item>

      <tri-list-item *ngIf="canDownloadCode$ | async">
        <p class="caption">
          The generated Angular project will include the following assets.
          <span *ngIf="!(canDownloadDataCode$ | async)"
            ><a routerLink="/plans">Upgrade</a> your plan to unlock the full code access.</span
          >
        </p>
        <ul>
          <li *ngFor="let item of downloadCapabilities$ | async">
            <tri-icon
              svgIcon="checkmark-outline"
              [svgIcon]="item.available ? 'checkmark-outline' : 'close-outline'"
            >
            </tri-icon>
            {{ item.capability }}
          </li>
        </ul>
      </tri-list-item>
      <tri-list-item *ngIf="canDownloadCode$ | async">
        <button
          [disabled]="loading"
          triButton
          color="primary"
          size="small"
          fullWidth
          [loading]="loading"
          (click)="emitDownload()"
        >
          Download Code
        </button>
      </tri-list-item>

      <tri-list-item class="no-access" *ngIf="!(canDownloadCode$ | async)">
        <p class="caption">
          Any UI Bakery <a routerLink="/projects/create" [queryParams]="{ name: 'New Project' }">templates</a> are
          available for download in Free plan. <a routerLink="/plans">Upgrade</a> your plan to download custom project's
          code.
        </p>
        <picture class="aspect-ratio-100">
          <source srcset="assets/free-plan.png 1x, assets/free-plan@2x.png 2x" />
          <img src="assets/free-plan.png" srcset="assets/free-plan@2x.png 2x" />
        </picture>
      </tri-list-item>
      <tri-list-item *ngIf="!(canDownloadCode$ | async)">
        <button
          [disabled]="loading"
          triButton
          color="primary"
          size="small"
          fullWidth
          [loading]="loading"
          (click)="emitDownloadSample()"
        >
          Download Sample
        </button>
      </tri-list-item>
    </tri-list>
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
