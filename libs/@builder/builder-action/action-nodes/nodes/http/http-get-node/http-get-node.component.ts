import { Component, OnInit } from '@angular/core';
import { DiagramNodeModel } from '@gradii/triangle/diagram';

@Component({
  selector : 'dt-http-get-node',
  template : `
    <pf-common-node [node]="node" style="width: 250px">
      <ng-template pfNodeHeader>
        <div class="title">
          <div *ngIf="node.getPort('in')" class="executed executed-in">
            <x-port-label-widget [port]="node.getPort('in')"></x-port-label-widget>
          </div>
          <div class="titleName">
            {{node?.displayName}} <span class="node-type">/api/v1/users</span>
          </div>
          <div *ngIf="node.getPort('out')" class="executed executed-out">
            <x-port-label-widget [port]="node.getPort('out')"></x-port-label-widget>
          </div>
        </div>
      </ng-template>
      <div style="margin:1rem;">
        <div>
          <span>slug params</span>
          <div style="display: flex">
            <div>param1:</div>
            <div>value1</div>
          </div>
        </div>
        <div>
          <span>query params</span>
          <div style="display: flex">
            <div>param1:</div>
            <div>value1</div>
          </div>
        </div>
      </div>
    </pf-common-node>
  `,
  styleUrls: ['./http-get-node.component.scss']
})
export class HttpGetNodeComponent implements OnInit {

  node: DiagramNodeModel;

  constructor() {
  }

  ngOnInit(): void {
  }

}
