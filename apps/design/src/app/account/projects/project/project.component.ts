import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ProjectBrief } from '@root-state/projects/project-brief.model';
import {
  ProjectActionsManager,
  ProjectActionsManagerFactoryService,
  ProjectCurrentMode
} from './project-actions-manager.service';
import { UserFacade } from '@auth/user-facade.service';
import { getPlanName } from '@account-state/billing/billing.service';

@Component({
  selector: 'ub-project',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./project.component.scss'],
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit, OnDestroy {
  private readonly deleteModeClass = 'delete-shadow';
  private readonly editModeClass = 'edit-shadow';
  private destroy$ = new Subject<void>();

  @Input() project: ProjectBrief;

  @Output() open: EventEmitter<string> = new EventEmitter();

  actions: Observable<NbMenuItem[]>;

  plan$: Observable<string> = this.userFacade.plan$.pipe(map(getPlanName));

  private projectActionsManager: ProjectActionsManager;

  constructor(
    private projectActionsManagerFactory: ProjectActionsManagerFactoryService,
    private el: ElementRef,
    private userFacade: UserFacade,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.projectActionsManager = this.projectActionsManagerFactory.create(this.project);
    this.actions = this.projectActionsManager.actions$;

    this.projectActionsManager.currentMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => this.handleModeChange(mode));
  }

  ngOnDestroy(): void {
    this.projectActionsManager.dispose();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleModeChange(action: ProjectCurrentMode) {
    switch (action) {
      case ProjectCurrentMode.EDIT: {
        this.renderer.addClass(this.el.nativeElement, this.editModeClass);
        break;
      }
      case ProjectCurrentMode.DELETE: {
        this.renderer.addClass(this.el.nativeElement, this.deleteModeClass);
        break;
      }
      case ProjectCurrentMode.NONE: {
        this.renderer.removeClass(this.el.nativeElement, this.editModeClass);
        this.renderer.removeClass(this.el.nativeElement, this.deleteModeClass);
        break;
      }
    }
  }
}
