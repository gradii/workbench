import { select } from '@ngneat/elf';
import { fromSettings } from '@tools-state/settings/settings.reducer';

export const getSettingsState = fromSettings.fromSettingsStore;

/**
 * @deprecated no usage 没有意义
 */
export const getComponentTreePageSidebarScale = getSettingsState.pipe(
  select((state: fromSettings.State) => state.componentTreePagesSidebarScale
  ));
export const getXRay                          = fromSettings.fromSettingsStore.pipe(
  select((state: fromSettings.State) => state.xray));
