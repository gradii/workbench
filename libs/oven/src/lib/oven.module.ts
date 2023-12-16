import { ScrollDispatcher } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbDatepickerModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule
} from '@nebular/theme';
import { AclModule, ActiveBreakpointProvider, StylesCompilerService } from '@common';
import { NbRoleProvider } from '@nebular/security';

import { DefinitionsModule, DefinitionUtilsModule } from './definitions';
import { DevUIModule } from './dev-ui';
import { ScrollDispatcherAdapter } from './dev-ui/scroll-dispatcher-adapter';
import { PreviewComponent } from './preview/preview.component';
import { HeaderSlotDirective, SidebarSlotDirective, LayoutComponent } from './preview/layout.component';
import { PageComponent } from './preview/page.component';
import { WORKBENCH_THEME_DARK, WORKBENCH_THEME_LIGHT } from './styles/theme.workbench';
import { RoleProvider } from './acl/role-provider';
import { ScrollableColumnsDirective } from './util/scrollable-columns.directive';
import { WorkflowModule } from './workflow/workflow.module';
import { OvenActiveBreakpointProvider } from './util/active-breakpoint-provider';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    DevUIModule,
    DefinitionsModule,
    DefinitionUtilsModule,
    WorkflowModule,
    NbLayoutModule,
    NbIconModule,
    NbButtonModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbEvaIconsModule,
    NbThemeModule.forRoot({ name: 'default' }, [WORKBENCH_THEME_LIGHT, WORKBENCH_THEME_DARK]),
    RouterModule.forRoot([]),
    AclModule
  ],
  declarations: [
    PreviewComponent,
    PageComponent,
    HeaderSlotDirective,
    SidebarSlotDirective,
    ScrollableColumnsDirective,
    LayoutComponent
  ],
  exports: [PreviewComponent],
  entryComponents: [PageComponent],
  providers: [
    { provide: ScrollDispatcher, useClass: ScrollDispatcherAdapter },
    { provide: NbRoleProvider, useClass: RoleProvider },
    { provide: ActiveBreakpointProvider, useClass: OvenActiveBreakpointProvider },
    StylesCompilerService
  ]
})
export class OvenModule {
}
