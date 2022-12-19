import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DiagramEngine, DiagramNodeModel, DiagramPortModel, ENGINE, XPortLabelWidget } from '@gradii/triangle/diagram';
import { TriDialogService } from '@gradii/triangle/dialog';

@Component({
  selector : 'pf-switch-case-node',
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
        <button triButton variant="text" ghost size="xsmall"
                [triConfirmPopup]="addPredicateCase"
                (click)="editingCase=''"
                (onConfirm)="onAddCase($event)">
          <tri-icon svgIcon="outline:plus"></tri-icon>
        </button>
        <ng-template #addPredicateCase>
          <input triInput [(ngModel)]="editingCase" />
        </ng-template>
        <textarea triTextarea></textarea>
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
  styleUrls: ['./switch-case-node.component.scss']
})
export class SwitchCaseNodeComponent implements OnInit {
  editingCase = '';

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

  constructor(@Inject(ENGINE) public engine: DiagramEngine,
              private dialogService: TriDialogService
              /*@Inject(DIAGRAM_NODE_DATA) public nodeData: any*/) {
    // this.node = nodeData.node;
    // console.log(nodeData.hi);
  }

  _onContentChanges() {
    this.ports.forEach(it => it.report());
  }

  onAddCase(event) {
    console.log('add case');
    // this.dialogService.open();
    this.node.addOutPort(this.editingCase);
  }

  ngOnInit() {
    // this.node.registerListener({
    //   portsUpdated: (event) => {
    //   }
    // });
  }
}
