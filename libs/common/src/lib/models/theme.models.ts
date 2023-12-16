export interface ShadedColor {
  _100: string;
  _200: string;
  _300: string;
  _400: string;
  _500: string;
  _600: string;
  _700: string;
  _800: string;
  _900: string;
  locked?: boolean;
}

export interface ExtendedShadedColor extends ShadedColor {
  _1000: string;
  _1100: string;
}

export interface ThemeColors {
  basic: ExtendedShadedColor;
  primary: ShadedColor;
  success: ShadedColor;
  info: ShadedColor;
  warning: ShadedColor;
  danger: ShadedColor;
}

export interface Theme {
  id: string;
  name: string;
  createdAt?: Date;
  dark: boolean;
  colors: ThemeColors;
  radius: {
    unit: string;
    value: number;
  };
  shadow: string;
  font: ThemeFont;
}

export interface ThemeFont {
  name: string;
  link: string;
  fallback: string;
  licence: string;
}

export interface ColorInfo {
  name: string;
  color: string;
  inputSource?: string;
  logo?: string;
  locked: boolean;
  shades: {
    number: number;
    color: string;
  }[];
}

export interface ThemeAnalyticItem {
  colors: ColorInfo[];
  theme: string;
  themeId: string;
  user: { id: string };
  version: string;
}

export enum ColorInputSource {
  INPUT = 'input',
  FROM_PRIMARY = 'from_primary',
  REGENERATED = 'regenerated',
  PIKER = 'picker',
  PALETTE = 'palette',
  LOGO = 'logo',
  SHADE = 'shade',
}
