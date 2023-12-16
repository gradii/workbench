import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsService } from '@common';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { LoaderService } from '@core/loader.service';
import { NbDialogService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { FormBuilderService } from './form-builder.service';
import { ComponentChange, TemplateChanges } from './app-changes';
import { FormTemplate } from './form-template';
import { deepExtend } from './deep-extend';

import 'style-loader!./styles/styles.scss';
import { DownloadFormDialogComponent } from './dialogs/download-form-dialog.component';
import { ContinueEditingDialogComponent } from './dialogs/continue-editing-dialog.component';
import { WelcomeDialogComponent } from './dialogs/welcome-dialog.component';

enum DialogTypes {
  Download,
  Continue,
}

@Component({
  selector: 'ub-form-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./form-builder.component.scss'],
  templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroyed$ = new Subject();

  templates$: BehaviorSubject<FormTemplate[]> = new BehaviorSubject([]);
  selectedTemplate: FormTemplate;
  templateChanges: TemplateChanges = {};

  buttonSize = 'medium';
  canCollapseSidebar = false;

  constructor(
    private loaderService: LoaderService,
    private themeService: NbThemeService,
    private nbDialogService: NbDialogService,
    private formBuilderService: FormBuilderService,
    private sidebarService: NbSidebarService,
    private hostElement: ElementRef,
    private analyticsService: AnalyticsService
  ) {
  }

  ngOnInit(): void {
    this.themeService.changeTheme('form-builder');
    this.loaderService.show();
    this.sidebarService.expand();

    this.setThemeProperties();

    this.formBuilderService
      .loadTemplateList()
      .pipe(
        map(templates => {
          return templates.sort((a, b) => a.priority - b.priority);
        }),
        tap(templates => {
          if (templates.length) {
            this.selectTemplate(templates[0]);
          } else {
            this.loaderService.hide();
          }
        })
        // TODO alive
      )
      .subscribe(templates => this.templates$.next(templates));
  }

  ngAfterViewInit(): void {
    this.nbDialogService.open(WelcomeDialogComponent);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  openDialog(type: DialogTypes) {
    let instance: DownloadFormDialogComponent | ContinueEditingDialogComponent;
    if (type === DialogTypes.Download) {
      this.analyticsService.logFormBuilderOpenDownloadForm();
      instance = this.nbDialogService.open(DownloadFormDialogComponent).componentRef.instance;
      instance.selectedTemplate = this.selectedTemplate;
      return;
    }

    this.analyticsService.logFormBuilderContinueEditing();
    instance = this.nbDialogService.open(ContinueEditingDialogComponent).componentRef.instance;
    instance.selectedTemplate = this.selectedTemplate;
  }

  setThemeProperties(): void {
    this.themeService
      .onMediaQueryChange()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(breakpoints => {
        this.buttonSize = breakpoints.find(breakpoint => breakpoint.name === 'xs') ? 'small' : 'medium';
        this.canCollapseSidebar =
          breakpoints[1].name === 'sm' || Boolean(breakpoints.find(breakpoint => breakpoint.name === 'is'));
      });
  }

  selectTemplate(template: FormTemplate) {
    if (this.canCollapseSidebar) {
      this.sidebarService.collapse();
    }
    this.selectedTemplate = this.applyChanges(template, this.templateChanges);
  }

  changeTemplate(changes: TemplateChanges) {
    this.storeChanges(changes);
    this.selectTemplate(this.selectedTemplate);
  }

  private applyChanges(template: FormTemplate, changes: TemplateChanges) {
    return this.formBuilderService.mergeChanges(template, changes);
  }

  private storeChanges(changes: TemplateChanges) {
    const { componentChanges } = changes;
    delete changes.componentChanges;
    this.templateChanges = deepExtend(this.templateChanges, changes);
    this.templateChanges.componentChanges = this.mergeArrays(this.templateChanges.componentChanges, componentChanges);
  }

  private mergeArrays(old: ComponentChange[], newVal: ComponentChange[]): ComponentChange[] {
    if (!old) {
      return newVal;
    }
    if (!newVal) {
      return old;
    }
    newVal.forEach(changes => {
      const oldIndex = old.findIndex(
        oldChanges => oldChanges.definitionId === changes.definitionId && oldChanges.index === changes.index
      );
      if (oldIndex === -1) {
        old.push(changes);
      } else {
        old[oldIndex] = changes;
      }
    });

    return old;
  }
}
