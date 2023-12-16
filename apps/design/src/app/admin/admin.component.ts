import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { OvenPage } from '@common';

import { AdminService } from './admin.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { environment } from '../../environments/environment';
import { IframeProviderService } from '@shared/communication/iframe-provider.service';

@Component({
  selector: 'ub-admin',
  styleUrls: ['./admin.component.scss'],
  templateUrl: './admin.component.html',
  providers: [AdminService]
})
export class AdminComponent implements OnInit, OnDestroy {
  projects$: Observable<ProjectBrief[]> = this.adminService.projects$;
  pages$: Observable<OvenPage[]> = this.adminService.pages$;
  workbenchUrl: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.workbenchUrl);

  @ViewChild('iframe', { read: ElementRef, static: true }) private iframe: ElementRef;

  private destroyed$ = new Subject<void>();
  private email: string = this.route.snapshot.paramMap.get('email');

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private iframeProvider: IframeProviderService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.adminService.loadProjects(this.email);

    this.listenIframe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  loadProject(id: string) {
    this.adminService.loadProject(id);
  }

  navigate(url: string) {
    this.adminService.navigate(url);
  }

  private listenIframe() {
    fromEvent(this.iframe.nativeElement, 'load')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.iframeProvider.setIframeWindow(this.iframe.nativeElement.contentWindow);
      });
  }
}
