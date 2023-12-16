import { BehaviorSubject, Subject, EMPTY } from 'rxjs';
import { distinctUntilChanged, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { containsAtLeastNChars, containsNoMoreNChars, getConfigValue } from '@common';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { ProjectSettingsFacade } from '@root-state/project-settings/project-settings-facade.service';
import { ProjectSettings } from '@root-state/project-settings/project-settings.model';
import { convertFileToImage } from '../file-to-image';
import { imageDimesions, ImageFileSizeValidator } from '../image-file.validator';

@Component({
  selector: 'ub-project-settings',
  styleUrls: ['./project-settings-general.component.scss'],
  templateUrl: './project-settings-general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ImageFileSizeValidator]
})
export class ProjectSettingsGeneralComponent implements OnInit, OnDestroy {
  project: FormGroup = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        containsAtLeastNChars(getConfigValue('project.name.minLength')),
        containsNoMoreNChars(getConfigValue('profile.name.maxLength'))
      ]
    ],
    favicon: [null, [this.imageFileSizeValidator], [imageDimesions({ width: 256, height: 256 })]]
  });

  faviconMimeTypes = ['image/x-icon', 'image/png', 'image/jpeg', 'image/svg+xml'];

  faviconSrc$ = new BehaviorSubject('');

  loading$ = this.projectSettingsFacade.loading$;

  private destroyed$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private projectSettingsFacade: ProjectSettingsFacade,
    private imageFileSizeValidator: ImageFileSizeValidator,
    private cd: ChangeDetectorRef
  ) {
  }

  get name(): AbstractControl {
    return this.project && this.project.controls['name'];
  }

  get favicon(): AbstractControl {
    return this.project && this.project.controls['favicon'];
  }

  get isSaveDisabled() {
    return this.name.invalid;
  }

  ngOnInit() {
    this.handleProjectChange();
    this.handleProjectSettingsChange();
    this.notifyOnFaviconChange();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.clearFailed();
  }

  save() {
    this.clearFailed();

    if (this.name.valid) {
      this.projectSettingsFacade.updateProjectName(this.name.value);
    }

    if (this.favicon.valid) {
      this.projectSettingsFacade.updateFavicon(this.favicon.value);
    }
  }

  private handleProjectChange() {
    this.projectSettingsFacade.currentProject$
      .pipe(
        filter(project => !!project),
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      )
      .subscribe((project: ProjectBrief) => {
        this.project.patchValue(project);
      });
  }

  private handleProjectSettingsChange() {
    this.projectSettingsFacade.settings$
      .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((projectSettings: ProjectSettings) => {
        if (projectSettings.favicon) {
          this.faviconSrc$.next(projectSettings.favicon);
          this.favicon.reset();
        }
      });
  }

  private notifyOnFaviconChange() {
    this.favicon.valueChanges
      .pipe(
        distinctUntilChanged(),
        mergeMap(faviconFile => {
          if (!faviconFile) {
            return EMPTY;
          }

          return convertFileToImage(faviconFile);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((image: HTMLImageElement) => {
        if (this.favicon.errors) {
          this.cd.markForCheck();
          return;
        }

        this.faviconSrc$.next(image.src);
      });
  }

  private clearFailed() {
    this.projectSettingsFacade.clearFailed();
  }
}
