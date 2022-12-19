import { Component, OnInit } from '@angular/core';
import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';

@Component({
  selector   : 'dt-api-action',
  templateUrl: './api-action.component.html',
  styleUrls  : ['./api-action.component.scss']
})
export class ApiActionComponent implements OnInit {

  constructor(private projectBriefFacade: ProjectBriefFacade) {
  }

  ngOnInit(): void {
    this.projectBriefFacade.loadProjects();
  }

}
