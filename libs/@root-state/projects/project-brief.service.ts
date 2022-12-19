import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ProjectBriefService {
  constructor(private router: Router) {
  }

  openProject(id: string, type?: string, project?: any) {
    if (project?.projectType == 'frontend') {
      this.router.navigate([`/workbench/design-tools/${id}/builder`]);
    } else if (project?.projectType === 'backend') {
      this.router.navigate([`/workbench/backend-tools/${id}/workflow`]);
      // }else if (type === 'ApiTest') {
    } else {
      this.router.navigate([`/workbench/tools/${id}`]);
    }
  }
}
