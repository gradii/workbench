import { Component, Input, OnInit } from '@angular/core';
import { DiagramNodeModel } from '@gradii/triangle/diagram';

@Component({
  selector : 'pf-run-action-node',
  template : `
    <pf-common-node [node]="node">
      <div style="padding: 1rem">
        <tri-select>
          <tri-option value="val1">val1</tri-option>
          <tri-option value="val2">val2</tri-option>
          <tri-option value="val3">val3</tri-option>
          <tri-option value="val4">val4</tri-option>
          <tri-option value="val5">val5</tri-option>
        </tri-select>
      </div>
    </pf-common-node>
  `,
  host     : {},
  styleUrls: ['./run-action-node.component.scss']
})
export class RunActionNodeComponent implements OnInit {

  @Input()
  node: DiagramNodeModel;

  constructor() {
  }

  ngOnInit() {
  }
}
