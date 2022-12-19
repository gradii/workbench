/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/** Home component which includes a welcome message for the puff-app. */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector       : 'puff-designer',
  template       : `
    <router-outlet></router-outlet>
  `,
})
export class PuffDesignerWorkspace {
}
