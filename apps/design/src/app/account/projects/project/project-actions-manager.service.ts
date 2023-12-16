import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbMenuItem, NbMenuService } from '@nebular/theme';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ProjectBriefFacade } from '@root-state/projects/project-brief-facade.service';
import { ProjectBrief } from '@root-state/projects/project-brief.model';
import { ProjectDialogActionsService } from './project-dialog-actions.service';

export enum ProjectAction {
  DUPLICATE = 'Duplicate',
  DELETE = 'Delete',
  EDIT = 'Edit',
  SETTINGS = 'Settings',
}

export enum ProjectCurrentMode {
  NONE = 'None',
  DELETE = 'Delete',
  EDIT = 'Edit',
}

const duplicateAction = {
  title: ProjectAction.DUPLICATE,
  icon: 'copy'
};

const deleteAction = {
  title: ProjectAction.DELETE,
  icon: 'trash-2'
};

const editAction = {
  title: ProjectAction.EDIT,
  icon: 'edit'
};

const settingsAction = {
  title: ProjectAction.SETTINGS,
  icon: 'settings'
};

// TODO need to disable duplicate when quote exceeded
const defaultActions: NbMenuItem[] = [duplicateAction, deleteAction, settingsAction, editAction];

@Injectable()
export class ProjectActionsManagerFactoryService {
  constructor(
    private menuService: NbMenuService,
    private projectBriefFacade: ProjectBriefFacade,
    private projectDialogActionsService: ProjectDialogActionsService,
    private router: Router
  ) {
  }

  create(project: ProjectBrief): ProjectActionsManager {
    return new ProjectActionsManager(
      project,
      this.menuService,
      this.projectBriefFacade,
      this.projectDialogActionsService,
      this.router
    );
  }
}

export class ProjectActionsManager {
  private actions: BehaviorSubject<NbMenuItem[]> = new BehaviorSubject([...defaultActions]);
  readonly actions$: Observable<NbMenuItem[]> = this.actions.asObservable();
  private currentMode = new Subject<ProjectCurrentMode>();
  readonly currentMode$ = this.currentMode.asObservable();

  private destroyed$ = new Subject();

  constructor(
    private project: ProjectBrief,
    private menuService: NbMenuService,
    private projectBriefFacade: ProjectBriefFacade,
    private projectDialogActionsService: ProjectDialogActionsService,
    private router: Router
  ) {
    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === this.project.viewId),
        map(({ item: { title } }) => title),
        takeUntil(this.destroyed$)
      )
      .subscribe((action: ProjectAction) => this.handle(action));

    this.projectBriefFacade.canCreateProject$.subscribe((canCreate: boolean) => {
      const actions = [editAction, settingsAction, deleteAction];

      if (canCreate) {
        actions.unshift(duplicateAction);
      }

      this.actions.next(actions);
    });
  }

  dispose() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handle(action: ProjectAction) {
    let dialogRef: NbDialogRef<any>;
    const dialogConfig = {
      closeOnBackdropClick: false,
      context: { project: this.project }
    };

    switch (action) {
      case ProjectAction.DUPLICATE:
        this.projectBriefFacade.duplicate(this.project.viewId);
        break;
      case ProjectAction.DELETE:
        dialogRef = this.projectDialogActionsService.delete(this.project);
        this.currentMode.next(ProjectCurrentMode.DELETE);
        break;
      case ProjectAction.EDIT:
        dialogRef = this.projectDialogActionsService.edit(this.project);
        this.currentMode.next(ProjectCurrentMode.EDIT);
        break;
      case ProjectAction.SETTINGS:
        this.router.navigate(['/projects', this.project.viewId]);
        break;
    }

    if (dialogRef) {
      this.resetModeOnDialogClose(dialogRef);
    }
  }

  private resetModeOnDialogClose(dialogRef: NbDialogRef<any>) {
    dialogRef.onClose
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(() => this.currentMode.next(ProjectCurrentMode.NONE));
  }
}
