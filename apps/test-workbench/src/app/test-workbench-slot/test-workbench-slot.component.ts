import { Component, OnInit } from '@angular/core';
import { data } from '../data';

@Component({
  selector: 'devops-tools-test-workbench-slot',
  templateUrl: './test-workbench-slot.component.html',
  styleUrls: ['./test-workbench-slot.component.scss'],
})
export class TestWorkbenchSlotComponent implements OnInit {
  title = 'test-workbench';

  pageData: any = data;

  constructor() {}

  ngOnInit(): void {}
}
