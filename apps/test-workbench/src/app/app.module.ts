import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BakeryCommonModule, ENVIRONMENT } from '@common';
import { environment } from '@environments';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriDndModule } from '@gradii/triangle/dnd';
import { TriRoleProvider } from '@gradii/triangle/security';
import { KitchenModule } from '@kitchen';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { TestWorkbenchSlotComponent } from './test-workbench-slot/test-workbench-slot.component';
import { TestWorkbenchTransferNodeComponent } from './test-workbench-transfer-node/test-workbench-transfer-node.component';
import { TestGenerateUseAstComponent } from './test-generate-use-ast/test-generate-use-ast.component';
import { TestWorkflowComponent } from './test-workflow/test-workflow.component';

@NgModule({
  declarations: [
    AppComponent,
    TestWorkbenchSlotComponent,
    TestWorkbenchTransferNodeComponent,
    TestGenerateUseAstComponent,
    TestWorkflowComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: 'test-workbench-slot',
          component: TestWorkbenchSlotComponent,
        },
        {
          path: 'test-workbench-transfer-node',
          component: TestWorkbenchTransferNodeComponent,
        },
        {
          path: 'test-generate-use-ast',
          component: TestGenerateUseAstComponent,
        },
        {
          path: 'test-workflow',
          component: TestWorkflowComponent,
        }
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
    KitchenModule,
    BakeryCommonModule,
    TriDndModule,
    TriButtonModule,
  ],
  providers: [
    { provide: ENVIRONMENT, useValue: environment },
    {
      provide: TriRoleProvider,
      useFactory: () => {
        return new (class extends TriRoleProvider {
          getRole() {
            return of(['admin']);
          }
        })();
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
