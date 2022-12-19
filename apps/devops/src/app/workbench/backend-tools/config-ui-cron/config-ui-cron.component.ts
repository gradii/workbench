import { Component, OnInit } from '@angular/core';
import { KitchenType, nextComponentId, WorkflowInfo } from '@common';
import { dispatch } from '@ngneat/effects';
import { select } from '@ngneat/elf';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { ComponentActions } from '@tools-state/component/component.actions';
import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentList, getSlotComponentList } from '@tools-state/component/component.selectors';
import { WorkflowFacade } from '@tools-state/data/workflow/workflow-facade.service';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { getActivePage } from '@tools-state/page/page.selectors';
import { ProjectActions } from '@tools-state/project/project.actions';
import { PuffSlot } from '@tools-state/slot/slot.model';
import { getSlotList } from '@tools-state/slot/slot.selectors';
import { WorkingAreaFacade } from '@tools-state/working-area/working-area-facade.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap, share, take, tap } from 'rxjs/operators';

@Component({
  selector   : 'dt-config-ui-cron',
  templateUrl: './config-ui-cron.component.html',
  styleUrls  : ['./config-ui-cron.component.scss']
})
export class ConfigUiCronComponent implements OnInit {
  name: string;
  cronValue: any = '30 */10 * * * *';
  tags: any;


  contentRootSlot$ = combineLatest([
    getComponentList, getSlotList, getActivePage
  ]).pipe(
    select(([
              componentList,
              slotList,
              activePage
            ]) => {
      if (activePage.id) {
        const rootSlot: PuffSlot                   = slotList.find((slot: PuffSlot) => slot.parentPageId === activePage.id);
        const activeComponent: PuffComponent = componentList.find(
          (c: PuffComponent) => c.parentSlotId === rootSlot.id
        );

        return activeComponent;
      }
    }),
    filter(it => !!it),
    take(1),
    mergeMap((activeComponent: PuffComponent) => {
      return getSlotList.pipe(
        map((slotList: PuffSlot[]) => {
          return slotList.find(slot => slot.parentComponentId === activeComponent.id);
        })
      );
    }),
    tap((slot) => {
      console.log(slot);
    }),
    share()
  );
  //
  // actions$ = this.workflowFacade.workflowList$.pipe(
  //   // withLatestFrom(this.workflowFacade.activeWorkflowId$),
  //   // map(([workflowList, activeId]) => workflowList.filter(workflow => workflow.id !== activeId))
  // );

  searchOptions$: Observable<any[]> = this.workflowFacade.workflowInfoList$.pipe(
    map((workflowList: WorkflowInfo[]) => {
      return workflowList.map(item => {
        const endIconData: Partial<any> = {};
        if (!item.assigned) {
          endIconData.endIcon        = 'action-isnt-assigned';
          endIconData.iconPack       = 'bakery';
          endIconData.endIconTooltip = 'Action is not assigned';
        }
        return {
          displayValue: item.name,
          id          : item.id,
          filterValues: [item.name],
          ...endIconData
        };
      });
    })
  );
  selected: any;
  triggers$: Observable<PuffComponent[]>;

  constructor(
    private workflowFacade: WorkflowFacade,
    private workingAreaFacade: WorkingAreaFacade,
    private componentFacade: ComponentFacade,
    private pageFacade: PageFacade
  ) {
  }

  select(trigger, workflowId) {
    // this.componentFacade.add
    this.selected = workflowId;
    this.componentFacade.updateComponent({
      id     : trigger.id,
      actions: {
        'run': [
          { action: workflowId, paramCode: '' }
        ]
      }
    });
  }

  ngOnInit(): void {
    this.searchOptions$.pipe(
      tap(res => {
        console.log(res);
      })
    ).subscribe();

    //getSpace
    // this.rootSlot$.subscribe();
    // this.rootSlot$.subscribe();
    this.triggers$ = this.contentRootSlot$.pipe(
      mergeMap((slot: PuffSlot) => {
        return getSlotComponentList(slot.id).pipe(
          map((componentList) => {
            return { componentList, slotId: slot.id };
          })
        );
      }),
      map(({ componentList, slotId }) => {
        // console.log(componentList);
        const triggerComponentList = componentList.filter(it => it.definitionId === 'trigger');
        if (triggerComponentList.length === 0) {
          dispatch(ComponentActions.AddComponent({
            id          : nextComponentId(),
            type: KitchenType.Component,
            definitionId: 'trigger',
            index       : 0,
            parentSlotId: slotId,
            properties  : {
              name: 'default_trigger',
              type: 'cron',
              cron: '30 */10 * * * *'
            },
            styles      : {}
          }));
          dispatch(ProjectActions.UpdateProject());
        }
        return triggerComponentList;
      })
    );
  }

  getSelect(trigger: PuffComponent) {
    return (trigger.actions?.run || []).find(it => !!it.action)?.action;
  }

  updateTrigger() {
    dispatch(ProjectActions.UpdateProject());
  }
}
