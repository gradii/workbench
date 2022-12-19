import { createState, Store, withProps } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { Page } from '../page/page.model';

export namespace fromHistory {
  export interface State {
    timeIndex: number;
    historyLength: number;
  }

  const initialState: State = {
    // time index should be less history length
    timeIndex: -1,
    historyLength: 0
  };

  const { state, config } = createState(
    withProps<State>(initialState),
    withEntities<Page>()
  );

  export const fromHistoryStore = new Store({ name: 'kitchen-history', state, config });

  export class ReducerEffect {
  }

  // export function reducer(state = initialState) {
  //   // history state is managed history meta reducer
  //   return state;
  // }
}
