import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriConfirmPopupModule } from '@gradii/triangle/confirm-popup';
import { DIAGRAM_NODE_COMPONENTS, TriDiagramModule } from '@gradii/triangle/diagram';
import { TriFormFieldModule } from '@gradii/triangle/form-field';
import { TriGridModule } from '@gradii/triangle/grid';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriInputNumberModule } from '@gradii/triangle/input-number';
import { TriSelectModule } from '@gradii/triangle/select';
import { CommonNodeComponent } from './common/common-node/common-node.component';
import { NodeHeaderDirective } from './common/node-header.directive';
import { NodeHeaderComponent } from './common/node-header/node-header.component';
import { NodePortComponent } from './common/node-port/node-port.component';
import { NumericNodeComponent } from './nodes/basic/numeric-node/numeric-node.component';
import { AssignVariableNodeComponent } from './nodes/component/assign-variable-node/assign-variable-node.component';
import { RunActionNodeComponent } from './nodes/component/run-action-node/run-action-node.component';
import { HttpGetNodeComponent } from './nodes/http/http-get-node/http-get-node.component';
import { IfConditionNodeComponent } from './nodes/logic/if-condition-node/if-condition-node.component';
import { LoopNodeComponent } from './nodes/logic/loop-node/loop-node.component';
import { MapNodeComponent } from './nodes/logic/map-node/map-node.component';
import { SwitchCaseNodeComponent } from './nodes/logic/switch-case-node/switch-case-node.component';
import { LifeCycleNodeComponent } from './nodes/trigger/life-cycle-node/life-cycle-node.component';

const COMPONENTS = [
  CommonNodeComponent,
  NodeHeaderComponent,
  NodePortComponent,

  NodeHeaderDirective,

  //trigger
  LifeCycleNodeComponent,

  //component
  RunActionNodeComponent,

  //logic
  IfConditionNodeComponent,
  LoopNodeComponent,
  SwitchCaseNodeComponent,
  MapNodeComponent,

  NumericNodeComponent,
  AssignVariableNodeComponent,

  //http
  HttpGetNodeComponent
];

@NgModule({
  imports     : [
    CommonModule,
    FormsModule,

    ObserversModule,

    TriDiagramModule,
    TriInputModule,
    TriFormFieldModule,
    TriInputNumberModule,
    TriSelectModule,
    TriButtonModule,
    TriIconModule,
    TriConfirmPopupModule,
    TriGridModule,
    TriCheckboxModule
  ],
  declarations: [
    COMPONENTS
  ],
  providers   : [
    { type: 'gradii/action/trigger:constructor', component: LifeCycleNodeComponent },
    { type: 'gradii/action/trigger:on-init', component: LifeCycleNodeComponent },
    { type: 'gradii/action/trigger:do-check', component: LifeCycleNodeComponent },
    { type: 'gradii/action/trigger:on-destroy', component: LifeCycleNodeComponent },
    { type: 'gradii/action/trigger:custom', component: LifeCycleNodeComponent },
    { type: 'gradii/action/component:assign-variable', component: AssignVariableNodeComponent },
    { type: 'gradii/action/component:run-action', component: RunActionNodeComponent },
    { type: 'gradii/action/basic:numeric', component: NumericNodeComponent },
    { type: 'gradii/action/logic:if-condition', component: IfConditionNodeComponent },
    { type: 'gradii/action/logic:switch-case', component: SwitchCaseNodeComponent },
    { type: 'gradii/action/logic:loop', component: LoopNodeComponent },
    { type: 'gradii/action/logic:map', component: MapNodeComponent },
    { type: 'gradii/action/logic:scripts', component: CommonNodeComponent },
    { type: 'gradii/action/http:get', component: HttpGetNodeComponent },
    { type: 'gradii/action/http:post', component: CommonNodeComponent },
    { type: 'gradii/action/observable:observable-map', component: CommonNodeComponent }
  ].map(it => {
    return { provide: DIAGRAM_NODE_COMPONENTS, useValue: it, multi: true };
  }),
  exports     : [
    TriDiagramModule,

    COMPONENTS
  ]
})
export class ActionNodesModule {
}
