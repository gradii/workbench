import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';

@Component({
  selector: 'len-account',
  template: `
      <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {
  constructor(private projectBriefFacade: ProjectBriefFacade) {
  }

  ngOnInit(): void {
    this.projectBriefFacade.loadProjects();
  }
}
