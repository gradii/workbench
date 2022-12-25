import { ActionDiagram } from '@common/public-api';
import { select } from '@ngneat/elf';
import { selectAllEntities, selectEntity } from '@ngneat/elf-entities';
import { fromActionDiagram } from '@tools-state/data/action-diagram/action-diagram.reducer';
import { getActivePageId } from '@tools-state/page/page.selectors';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

export const getActionDiagramState = fromActionDiagram.fromActionDiagramStore;

export const getActionDiagramList = getActionDiagramState.pipe(selectAllEntities());

export const getActionDiagram = (actionDiagramId) => getActionDiagramState.pipe(
  selectEntity(actionDiagramId)
);

export const getActivePageActionDiagram: Observable<ActionDiagram> = getActionDiagramList.pipe(
  withLatestFrom(getActivePageId),
  map(([entityList, pageId]) => entityList.find(
    (entity) => entity.parentSlotId === pageId)
  )
);

export const getActiveNodeId = getActionDiagramState.pipe(
  select(({ activeNodeId }) => activeNodeId)
);

// export const getActiveNodeSelection = getActionDiagramState.pipe(
//   select(({ activeNodeSelection }) => activeNodeSelection)
// );


// export const getActiveActionDiagram = getActionDiagramState.pipe(
//   select((state: fromActionDiagram.State) => state.entities[state.activeActionDiagramId]
// ));

// export const getActiveStepId = getActionDiagramState.pipe(select(({ activeStepId }) => activeStepId));
//
// export const getActionDiagramEntities = getActionDiagramState.pipe(selectAll());
//
// export const getActionDiagramNameById = (id: string) => getActionDiagramState.pipe(
//   selectEntity(id, { pluck: 'name' })
// );
//
// export const getActionDiagramById = (id: string) => getActionDiagramState.pipe(
//   selectEntity(id)
// );
//
// export const getActionDiagramsAssignedStatus = getComponentList.pipe(select((components: BakeryComponent[]): {
//   [key: string]: boolean;
// } => {
//   const workflowAssignedStatus: { [key: string]: boolean } = {};
//
//   for (const component of components) {
//     const actions: { [key: string]: TriggeredAction[] } = component.actions;
//
//     if (!actions) {
//       continue;
//     }
//
//     for (const key in actions) {
//       if (!actions[key]) {
//         continue;
//       }
//       for (const triggeredAction of actions[key]) {
//         const { action }               = triggeredAction;
//         workflowAssignedStatus[action] = true;
//       }
//     }
//   }
//   return workflowAssignedStatus;
// }));

// export const getActionDiagramInfoList = combineLatest(
//   [
//     getActionDiagramList,
//     getActionDiagramsAssignedStatus
//   ]).pipe(
//   select(([
//             workflowList,
//             workflowsAssignedStatus
//           ]): ActionDiagramInfo[] => {
//     return workflowList.map(workflow => ({
//       ...workflow,
//       assigned: workflowsAssignedStatus[workflow.id] || false
//     }));
//   })
// );
