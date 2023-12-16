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

  export function reducer(state = initialState) {
    // history state is managed history meta reducer
    return state;
  }
}
