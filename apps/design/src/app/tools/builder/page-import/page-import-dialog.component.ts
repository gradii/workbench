import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { PageImportService, PageTreeWithProject } from '@tools-state/page/page-import.service';
import { ProjectDto } from '@shared/project.service';
import { CheckablePage, CheckableProject, PageCheckHelperService } from './page-check-helper.service';

@Component({
  selector: 'ub-page-import-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page-import-dialog.component.scss'],
  templateUrl: './page-import-dialog.component.html'
})
export class PageImportDialogComponent implements OnInit {
  projects: CheckableProject[] = [];
  checkedPageCount = 0;
  loading: boolean;

  constructor(
    private dialogRef: NbDialogRef<PageImportDialogComponent>,
    private pageImportService: PageImportService,
    private pageCheckHelperService: PageCheckHelperService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.cd.detectChanges();
    this.pageImportService.loadAllProjects().subscribe((projects: ProjectDto[]) => {
      this.projects = this.pageCheckHelperService.convertProjects(projects);
      this.loading = false;
      this.cd.detectChanges();
    });
  }

  import() {
    const pagesToImport: PageTreeWithProject[] = this.pageCheckHelperService.computeImportPages(this.projects);
    this.pageImportService.import(pagesToImport);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  checkProject(project: CheckableProject, checked: boolean) {
    this.pageCheckHelperService.checkProject(project, checked);
    this.checkedPageCount = this.pageCheckHelperService.countCheckedPages(this.projects);
    this.cd.detectChanges();
  }

  checkPage({ page, checked }: { page: CheckablePage; checked: boolean }, project: CheckableProject) {
    this.pageCheckHelperService.checkPage(page, checked, project);
    this.checkedPageCount = this.pageCheckHelperService.countCheckedPages(this.projects);
    this.cd.detectChanges();
  }

  stopEvent(event: Event) {
    event.stopPropagation();
  }
}
