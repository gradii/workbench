import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ProjectBriefService {
  constructor(private router: Router) {
  }

  openProject(id: string) {
    this.router.navigate([`/tools/${id}`]);
  }
}
