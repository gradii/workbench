import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyticsService, OvenApp } from '@common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NB_DOCUMENT, NB_WINDOW } from '@nebular/theme';

import { environment } from '../../../../environments/environment';
import { calcPagesNumber } from '@tools-state/download/download-util';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private window: Window;
  private document: Document;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private analytics: AnalyticsService,
    @Inject(NB_DOCUMENT) document,
    @Inject(NB_WINDOW) window
  ) {
    this.window = window;
    this.document = document;
  }

  generateApplication(app: OvenApp, name: string, template: boolean = false, source: string): Observable<void> {
    return this.http
      .post(environment.downloadCodeUrl, { app: JSON.stringify(app), name, template }, { responseType: 'arraybuffer' })
      .pipe(map((zip: ArrayBuffer) => this.downloadFile(zip, name, app, source)));
  }

  private downloadFile(zip: ArrayBuffer, name: string, app: OvenApp, source: string) {
    const blob = new Blob([zip], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const element = this.document.createElement('a');
    element.setAttribute('href', url.toString());
    element.setAttribute('download', `${name}.zip`);
    element.style.display = 'none';
    this.document.body.appendChild(element);
    element.click();
    this.document.body.removeChild(element);

    const size = blob.size / 1024;
    const pagesNumber = calcPagesNumber(app);
    this.analytics.logDownloadCode(name, pagesNumber, `${Math.round(size)} Kb`, source);
  }
}
