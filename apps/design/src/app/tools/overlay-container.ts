import { NbOverlayContainerAdapter } from '@nebular/theme';
import { Provider } from '@angular/core';

/**
 * This provider ought to be used for each tool in UI Builder.
 *
 * This provider will create a new instance of overlay container and restrict modifying root one.
 * */
export const TOOL_OVERLAY_CONTAINER_ADAPTER: Provider = {
  provide: NbOverlayContainerAdapter,
  useClass: NbOverlayContainerAdapter
};
