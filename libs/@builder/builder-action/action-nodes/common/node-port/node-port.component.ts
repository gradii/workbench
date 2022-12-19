import { Component, Input, OnInit } from '@angular/core';
import { DiagramNodeModel } from '@gradii/triangle/diagram';

@Component({
  selector : 'pf-node-port',
  template : `
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
  `,
  host     : {
    'class': 'ports'
  },
  styleUrls: ['./node-port.component.scss']
})
export class NodePortComponent implements OnInit {

  @Input()
  node: DiagramNodeModel;

  trackByFn(index: number, item: any) {
    return item.getType();
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
