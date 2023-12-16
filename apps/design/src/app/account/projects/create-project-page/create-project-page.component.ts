import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AclService } from '@common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Template } from '@account-state/template/template.model';
import { TemplateFacadeService } from '@account-state/template/template-facade.service';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectProperties } from '@common';
import { ProjectNameValidator } from '../project-name-validator';
import { RequestTemplateComponent } from '../request-template/request-template.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ub-create-project',
  styleUrls: ['./create-project-page.component.scss'],
  templateUrl: './create-project-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectNameValidator]
})
export class CreateProjectComponent implements OnInit, OnDestroy {
  name: string;
  projectProperties: ProjectProperties = { type: '', description: '' };
  disableProjectCreation$: Observable<boolean> = this.projectBriefFacade.canCreateProject$.pipe(
    map((canCreate: boolean) => !canCreate)
  );

  createLoading$: Observable<boolean> = this.projectBriefFacade.createProjectLoading$;

  templateListLoading$: Observable<boolean> = this.templateFacade.loading$;
  templateListLoadingFailed$: Observable<boolean> = this.templateFacade.loadingFailed$;

  codeLoading$: Observable<boolean> = this.templateFacade.codeLoading$;
  codeLoadingTemplateId$: Observable<string> = this.templateFacade.codeLoadingTemplateId$;

  loading$ = combineLatest([this.createLoading$, this.templateListLoading$]).pipe(
    map(([createLoading, templateListLoading]) => {
      return createLoading || templateListLoading;
    })
  );

  nameFilter$ = new BehaviorSubject<string>('');
  selectedTag$ = new BehaviorSubject<string>('');

  templateList$: Observable<Template[]> = this.templateFacade.templateList$;
  filteredTemplates$: Observable<Template[]> = combineLatest([
    this.templateList$,
    this.nameFilter$,
    this.selectedTag$
  ]).pipe(
    map(([templates, nameFilter, selectedTag]) => {
      let filteredTemplates: Template[] = templates;

      filteredTemplates = filteredTemplates.filter((template: Template) => {
        let found = false;
        found = found || template.name.toLowerCase().includes(nameFilter.toLowerCase());
        template.tags.forEach(tag => {
          found = found || tag.toLowerCase().includes(nameFilter.toLowerCase());
        });
        return found;
      });

      if (selectedTag !== '') {
        filteredTemplates = filteredTemplates.filter((template: Template) => {
          return template.tags.includes(selectedTag);
        });
      }

      return filteredTemplates;
    })
  );
  templateTags$: Observable<string[]> = this.templateList$.pipe(
    map((templates: Template[]) => {
      const allTags: string[] = templates.map((template: Template) => template.tags).flat();
      return [...new Set(allTags)];
    })
  );

  private destroyed$ = new Subject();

  constructor(
    private projectBriefFacade: ProjectBriefFacade,
    private route: ActivatedRoute,
    private router: Router,
    private acl: AclService,
    private templateFacade: TemplateFacadeService,
    private dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.templateFacade.load();
    this.route.queryParams.pipe(take(1)).subscribe(params => (this.name = params['name']));

    // TODO Remove call to window.history.state
    const { type, description } = window.history.state;
    this.projectProperties.type = type;
    this.projectProperties.description = description;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  create(template: Template) {
    this.acl
      .canUseProjectTemplate(template.availableFrom)
      .pipe(take(1))
      .subscribe(canUse => {
        if (canUse) {
          this.projectBriefFacade.createProject(this.name, template.id, template.name, this.projectProperties);
        } else {
          this.templateFacade.accessTemplate(template);
        }
      });
  }

  download(template: Template) {
    this.templateFacade.downloadTemplateCode(template, 'template');
  }

  selectTag(tag: string) {
    if (this.selectedTag$.value === tag) {
      this.selectedTag$.next('');
    } else {
      this.selectedTag$.next(tag);
    }
  }

  upgrade() {
    this.router.navigate(['/plans']);
  }

  openOrderDialog() {
    this.dialogService.open(RequestTemplateComponent);
  }
}
