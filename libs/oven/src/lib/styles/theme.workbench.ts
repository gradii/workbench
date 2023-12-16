const primary = '#8a7fff';
const success = '#40dc7e';
const info = '#4ca6ff';
const warning = '#ffa100';
const danger = '#ff4c6a';

const BASE_THEME = {
  variables: {
    primary,
    success,
    info,
    warning,
    danger,
    charts: {
      primary,
      success,
      info,
      warning,
      danger,
      bg: '#ffffff',
      textColor: '#484848',
      axisLineColor: '#bbbbbb',
      splitLineColor: '#ebeef2',
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: '#6a7985',
      areaOpacity: '0.7'
    },
    bubbleMap: {
      primary,
      success,
      info,
      warning,
      danger,
      titleColor: '#484848',
      areaColor: '#dddddd',
      areaHoverColor: '#cccccc',
      areaBorderColor: '#ebeef2'
    }
  }
};

export const WORKBENCH_THEME_LIGHT = {
  name: 'default',
  base: 'default',
  ...BASE_THEME
};

export const WORKBENCH_THEME_DARK = {
  name: 'dark',
  base: 'dark',
  ...BASE_THEME
};
