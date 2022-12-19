import { Component, ContentChild, Inject, Input, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { DiagramEngine, DiagramNodeModel, DiagramPortModel, ENGINE, XPortLabelWidget } from '@gradii/triangle/diagram';
import { NodeHeaderDirective } from '../node-header.directive';

@Component({
  selector : 'pf-common-node',
  template : `
    <div (cdkObserveContent)="_onContentChanges()">
      <ng-template [ngIf]="pfNodeHeader" [ngIfElse]="header">
        <ng-template [ngTemplateOutlet]="pfNodeHeader"></ng-template>
      </ng-template>
      <ng-template #header>
        <pf-node-header [node]="node"></pf-node-header>
      </ng-template>
      <div class="description">
        {{node?.description}}
        <ng-content></ng-content>
      </div>
      <pf-node-port [node]="node"></pf-node-port>
    </div>
  `,
  host     : {
    '[style.borderColor]'       : 'node?.isSelected() ? "rgb(0,192,255)" : "black"',
    '[style.backgroundColor]'   : 'node?.color',
    '[attr.dataDefaultNodeName]': 'node?.displayName',
    '[attr.selected]'           : 'node?.isSelected()'
  },
  styleUrls: ['./common-node.component.scss']
})
export class CommonNodeComponent implements OnInit {

  @Input()
  node: DiagramNodeModel;

  @ContentChild(NodeHeaderDirective, { read: TemplateRef })
  pfNodeHeader: TemplateRef<any>;

  executeInPort: DiagramPortModel;

  executeOutPort: DiagramPortModel;


  @ViewChildren(XPortLabelWidget, {})
  ports: QueryList<XPortLabelWidget>;

  constructor(@Inject(ENGINE) public engine: DiagramEngine
              /*@Inject(DIAGRAM_NODE_DATA) public nodeData: any*/) {
    // this.node = nodeData.node;
    // console.log(nodeData.hi);
  }

  _onContentChanges() {
    this.ports.forEach(it => it.report());
  }

  ngOnInit() {
    // this.node.registerListener({
    //   portsUpdated: (event) => {
    //   }
    // });
  }

}
