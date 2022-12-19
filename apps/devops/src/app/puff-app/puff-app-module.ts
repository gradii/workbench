/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriNativeDateModule } from '@gradii/triangle/core';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriNavbarModule } from '@gradii/triangle/navbar';
import { TriSidenavModule } from '@gradii/triangle/sidenav';
import { PuffApp404 } from './puff-app-404';
import { PuffAppHome } from './puff-app-home';
import { PuffAppLayout } from './puff-app-layout';
import { PuffAppWorkspace } from './puff-app-workspace';
import { PuffDesignerWorkspace } from './puff-designer-workspace';

@NgModule({
  imports     : [
    CommonModule,
    TriNativeDateModule,

    TriNavbarModule,
    RouterModule,
    TriSidenavModule,
    TriButtonModule,
    TriIconModule,
  ],
  declarations: [
    PuffAppHome,

    PuffAppWorkspace,
    PuffDesignerWorkspace,

    PuffAppLayout,
    PuffApp404,
  ],
})
export class PuffAppModule {
}
