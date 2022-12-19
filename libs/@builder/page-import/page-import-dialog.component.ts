import { ChangeDetectionStrategy, Component, OnInit, ɵdetectChanges } from '@angular/core';
import { TriDialogRef } from '@gradii/triangle/dialog';
import { ProjectDto } from '@shared/project.service';

import { PageImportService, PageTreeWithProject } from '@tools-state/page/page-import.service';
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
    private dialogRef: TriDialogRef<PageImportDialogComponent>,
    private pageImportService: PageImportService,
    private pageCheckHelperService: PageCheckHelperService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    ɵdetectChanges(this);
    this.pageImportService.loadAllProjects().subscribe((projects: ProjectDto[]) => {
      this.projects = this.pageCheckHelperService.convertProjects(projects);
      this.loading = false;
      ɵdetectChanges(this);
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
    ɵdetectChanges(this);
  }

  checkPage({ page, checked }: { page: CheckablePage; checked: boolean }, project: CheckableProject) {
    this.pageCheckHelperService.checkPage(page, checked, project);
    this.checkedPageCount = this.pageCheckHelperService.countCheckedPages(this.projects);
    ɵdetectChanges(this);
  }

  stopEvent(event: Event) {
    event.stopPropagation();
  }
}
