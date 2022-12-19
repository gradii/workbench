import { KitchenComponentDataState } from '@common/public-api';
import stringifyObject from 'stringify-object';

export function dataPropsFactory(
  value: any,
  dataKey: string = 'data'
): { [key: string]: any; dataState: KitchenComponentDataState } {
  value = stringifyObject(value, { indent: '  ', singleQuotes: true, inlineCharacterLimit: 80 });
  return {
    dataState: {
      empty: true,
      error: false,
      actualValue: value,
      sampleValue: value,
      connected: false,
      dataKey
    },
    [dataKey]: value
  };
}
