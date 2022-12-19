import { Component, Input, OnInit } from '@angular/core';
import { DiagramNodeModel } from '@gradii/triangle/diagram';

@Component({
  selector: 'pf-node-header',
  template: `
    <div *ngIf="node.getPort('in')" class="executed executed-in">
      <x-port-label-widget [port]="node.getPort('in')"></x-port-label-widget>
    </div>
    <div class="titleName">
      {{node?.displayName}}
    </div>
    <div *ngIf="node.getPort('out')" class="executed executed-out">
      <x-port-label-widget [port]="node.getPort('out')"></x-port-label-widget>
    </div>
  `,
  host    : {
    'class': 'title'
  },
  styleUrls  : ['./node-header.component.scss']
})
export class NodeHeaderComponent implements OnInit {

  @Input()
  node: DiagramNodeModel;

  constructor() {
  }

  ngOnInit(): void {
  }

}
