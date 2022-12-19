import { ObserversModule } from '@angular/cdk/observers';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot } from '@angular/router';
import { ActiveBreakpointProvider, StylesCompilerService } from '@common/public-api';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriLayoutModule } from '@gradii/triangle/layout';
import { Observable } from 'rxjs';

import { DefinitionsModule, DefinitionUtilsModule } from './definitions';
import { DevUIModule } from './dev-ui';
import { ComponentCompilerService } from './model-compiler/component-compiler.service';
import { ModelCompiler } from './model-compiler/model-compiler.service';
import { PageCompilerService } from './model-compiler/page-compiler.service';
import { CustomCodeService } from './preview/custom-code.service';
import { KitchenPage2Component } from './preview/kitchen-page2.component';
import { KitchenPage3Component } from './preview/kitchen-page3.component';
import { KitchenPage4Component } from './preview/kitchen-page4.component';
import { HeaderSlotDirective, LayoutComponent, SidebarSlotDirective } from './preview/layout.component';
import { PageComponent } from './preview/page.component';
import { PreviewComponent } from './preview/preview.component';
import { RouterFeedbackService } from './preview/router-feedback.service';
import { ComponentPropsMapperRegistry } from './renderer/component-props-mapper.registry';
import { ComponentPropsMapperService } from './renderer/component-props-mapper.service';
import { PainterService } from './renderer/painter.service';
import { RendererService } from './renderer/renderer.service';
import { KitchenState } from './state/kitchen-state.service';
import { RenderState } from './state/render-state.service';
import { KitchenActiveBreakpointProvider } from './util/active-breakpoint-provider';
import { WorkflowModule } from './workflow/workflow.module';
import { WorkingAreaRenderComponent } from './working-area-render.component';

@Injectable({ providedIn: 'root' })
export class PageRouteResolver implements Resolve<any> {
  constructor() {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return route.queryParamMap.get('id');
  }
}


@NgModule({
  imports     : [
    CommonModule,
    CommonModule,
    DevUIModule,
    DefinitionsModule,
    DefinitionUtilsModule,

    WorkflowModule,
    TriLayoutModule,
    CdkScrollableModule,
    ObserversModule,
    TriDndModule,

    RouterModule.forChild([
      {
        path     : '',
        component: WorkingAreaRenderComponent
        /*children : [
            {
              path     : '',
              resolve  : {
                id: PageRouteResolver
              },
              component: PageComponent
            }
          ]*/
      }
    ]),


  ],
  declarations: [
    WorkingAreaRenderComponent,
    PreviewComponent,
    PageComponent,
    HeaderSlotDirective,
    SidebarSlotDirective,
    LayoutComponent,
    KitchenPage2Component,
    KitchenPage3Component,
    KitchenPage4Component
  ],
  exports: [
    WorkingAreaRenderComponent,
    KitchenPage3Component,
    KitchenPage4Component
  ],
  providers   : [

    PainterService,
    RendererService,
    ComponentPropsMapperService,
    ComponentPropsMapperRegistry,

    RenderState,
    KitchenState,
    ModelCompiler,
    PageCompilerService,
    ComponentCompilerService,

    RouterFeedbackService,
    CustomCodeService,
    StylesCompilerService,

    { provide: ActiveBreakpointProvider, useClass: KitchenActiveBreakpointProvider },
  ]
})
export class KitchenModule {
}
