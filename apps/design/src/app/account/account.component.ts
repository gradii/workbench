import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ChatService } from '@core/chat.service';

@Component({
  selector: 'ub-account',
  template: `
    <ub-layout>
      <router-outlet></router-outlet>
    </ub-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {
  constructor(private projectBriefFacade: ProjectBriefFacade, private chatService: ChatService) {
    this.chatService.show();
  }

  ngOnInit(): void {
    this.projectBriefFacade.loadProjects();
  }
}
