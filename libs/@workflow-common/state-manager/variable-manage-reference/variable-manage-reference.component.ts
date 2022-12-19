import { Component, OnInit } from '@angular/core';

@Component({
  selector   : 'pf-variable-manage-reference',
  templateUrl: './variable-manage-reference.component.html',
  styleUrls  : ['./variable-manage-reference.component.css']
})
export class VariableManageReferenceComponent implements OnInit {
  referenceList: any[] = [
    {
      componentType: 'card',
      component: 'container1 > card1',
      referenceProperty: 'visible'
    },
    {
      componentType: 'card',
      component: 'container1 > card2',
      referenceProperty: 'visible'
    },
    {
      componentType: 'button',
      component: 'container1 > card2 > card-footer > button2',
      referenceProperty: 'visible'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
