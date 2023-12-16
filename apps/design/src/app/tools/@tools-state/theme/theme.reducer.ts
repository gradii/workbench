import { Theme } from '@common';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ThemeActions } from '@tools-state/theme/theme.actions';

export namespace fromTheme {
  export interface State extends EntityState<Theme> {
    ids: string[];
    supportLoading: boolean;
    shadesLoading: boolean;
  }

  const adapter: EntityAdapter<Theme> = createEntityAdapter<Theme>();

  const initialState: State = adapter.getInitialState({
    ids: [],
    supportLoading: false,
    shadesLoading: false
  });

  export const reducer = createReducer(
    initialState,
    on(ThemeActions.loadThemeList, (state, action) => adapter.addMany(action.themeList, initialState)),
    on(ThemeActions.updateTheme, (state, action) => adapter.updateOne(action.update, state)),
    on(ThemeActions.addTheme, (state, action) => adapter.addOne(action.theme, state)),
    on(ThemeActions.removeTheme, (state, action) => adapter.removeOne(action.themeId, state)),
    on(ThemeActions.startSupportLoading, state => ({ ...state, supportLoading: true })),
    on(ThemeActions.stopSupportLoading, state => ({ ...state, supportLoading: false })),
    on(ThemeActions.startShadesLoading, state => ({ ...state, shadesLoading: true })),
    on(ThemeActions.stopShadesLoading, state => ({ ...state, shadesLoading: false }))
  );

  export const { selectAll } = adapter.getSelectors();
}

export const defaultTheme = {
  id: '1',
  name: 'My theme',
  dark: false,
  radius: {
    unit: 'rem',
    value: 0.25
  },
  shadow: '0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1)',
  font: {
    name: 'Open Sans',
    link: '',
    licence: '',
    fallback: 'sans-serif'
  },
  colors: {
    basic: {
      _100: '#FFFFFF',
      _200: '#F7F9FC',
      _300: '#EDF1F7',
      _400: '#E4E9F2',
      _500: '#C5CEE0',
      _600: '#8F9BB3',
      _700: '#2E3A59',
      _800: '#222B45',
      _900: '#1A2138',
      _1000: '#151A30',
      _1100: '#101426'
    },
    primary: {
      _100: '#F2F6FF',
      _200: '#D9E4FF',
      _300: '#A6C1FF',
      _400: '#598BFF',
      _500: '#3366FF',
      _600: '#274BDB',
      _700: '#1A34B8',
      _800: '#102694',
      _900: '#091C7A'
    },
    success: {
      _100: '#F0FFF5',
      _200: '#CCFCE3',
      _300: '#8CFAC7',
      _400: '#2CE69B',
      _500: '#00D68F',
      _600: '#00B887',
      _700: '#00997A',
      _800: '#007D6C',
      _900: '#004A42'
    },
    info: {
      _100: '#F2F8FF',
      _200: '#C7E2FF',
      _300: '#94CBFF',
      _400: '#42AAFF',
      _500: '#0095FF',
      _600: '#006FD6',
      _700: '#0057C2',
      _800: '#0041A8',
      _900: '#002885'
    },
    warning: {
      _100: '#FFFDF2',
      _200: '#FFF1C2',
      _300: '#FFE59E',
      _400: '#FFC94D',
      _500: '#FFAA00',
      _600: '#DB8B00',
      _700: '#B86E00',
      _800: '#945400',
      _900: '#703C00'
    },
    danger: {
      _100: '#FFF2F2',
      _200: '#FFD6D9',
      _300: '#FFA8B4',
      _400: '#FF708D',
      _500: '#FF3D71',
      _600: '#DB2C66',
      _700: '#B81D5B',
      _800: '#94124E',
      _900: '#700940'
    }
  }
};

export const lightTheme: Theme = {
  ...defaultTheme,
  id: '-1',
  name: 'Eva Light',
  dark: false
};

export const darkTheme: Theme = {
  ...defaultTheme,
  id: '-2',
  name: 'Eva Dark',
  dark: true,
  shadow: 'none'
};
