import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DiagramEngine, DiagramNodeModel, DiagramPortModel, ENGINE, XPortLabelWidget } from '@gradii/triangle/diagram';

@Component({
  selector : 'pf-if-condition-node',
  template : `
    <div (cdkObserveContent)="_onContentChanges()">
      <div class="title">
        <div *ngIf="node.getPort('in')" class="executed executed-in">
          <x-port-label-widget [port]="node.getPort('in')"></x-port-label-widget>
        </div>
        <div class="titleName">
          {{node?.displayName}}
        </div>
        <div *ngIf="node.getPort('out')" class="executed executed-out">
          <x-port-label-widget [port]="node.getPort('out')"></x-port-label-widget>
        </div>
      </div>
      <div class="description">
        {{node?.description}}
      </div>
      <div class="ports">
        <div class="portsContainer">
          <ng-container *ngFor="let it of node?.getInPorts(); trackBy: this.trackByFn">
            <x-port-label-widget *ngIf="it.getType() !== 'default/port:in'"
                                 [port]="it"></x-port-label-widget>
          </ng-container>
        </div>
        <div class="portsContainer">
          <ng-container *ngFor="let it of node?.getOutPorts(); trackBy: this.trackByFn">
            <x-port-label-widget *ngIf="it.getType() !== 'default/port:out'"
                                 [port]="it"></x-port-label-widget>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  host     : {
    '[style.borderColor]'       : 'node?.isSelected() ? "rgb(0,192,255)" : "black"',
    '[style.backgroundColor]'   : 'node?.color',
    '[attr.dataDefaultNodeName]': 'node?.displayName',
    '[attr.selected]'           : 'node?.isSelected()'
  },
  styleUrls: ['./if-condition-node.component.scss']
})
export class IfConditionNodeComponent implements OnInit {

  // @Input()
  // one time binding
  node: DiagramNodeModel;

  executeInPort: DiagramPortModel;

  executeOutPort: DiagramPortModel;

  trackByFn(index: number, item: any) {
    return item.getType();
  }

  @ViewChildren(XPortLabelWidget)
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
  }
}
