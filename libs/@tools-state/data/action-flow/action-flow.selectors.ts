import { ActionFlow } from '@common/public-api';
import { selectAllEntities, selectEntity } from '@ngneat/elf-entities';
import { fromActionFlow } from '@tools-state/data/action-flow/action-flow.reducer';
import { getActivePageId } from '@tools-state/page/page.selectors';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

export const getActionFlowState = fromActionFlow.fromActionFlowStore;

export const getActionFlowList = getActionFlowState.pipe(selectAllEntities());

export const getActionFlow = (actionDiagramId) => getActionFlowState.pipe(
  selectEntity(actionDiagramId)
);

export const getActivePageActionFlow: Observable<ActionFlow> = getActionFlowList.pipe(
  withLatestFrom(getActivePageId),
  map(([entityList, pageId]) => entityList.find(
    (entity) => entity.parentSlotId === pageId)
  )
);
