import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

import { ProjectSettingsFacade } from '@root-state/project-settings/project-settings-facade.service';
import { ProjectSettings } from '@root-state/project-settings/project-settings.model';

@Component({
  selector: 'len-project-settings-code',
  templateUrl: './project-settings-code.component.html',
  styleUrls: ['./project-settings-code.component.scss']
})
export class ProjectSettingsCodeComponent implements OnInit, OnDestroy {
  customCode: UntypedFormGroup = this.fb.group({
    code: ['']
  });

  loading$ = this.projectSettingsFacade.loading$;

  private destroyed$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder, private projectSettingsFacade: ProjectSettingsFacade) {
  }

  get code(): AbstractControl {
    return this.customCode && this.customCode.controls['code'];
  }

  ngOnInit(): void {
    this.projectSettingsFacade.settings$
      .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((projectSettings: ProjectSettings) => {
        this.code.patchValue(projectSettings.code);
      });
  }

  save() {
    this.projectSettingsFacade.updateCode(this.code.value);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.clearFailed();
  }

  private clearFailed() {
    this.projectSettingsFacade.clearFailed();
  }
}
