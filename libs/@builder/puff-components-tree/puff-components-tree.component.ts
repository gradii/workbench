import { Component, OnInit } from '@angular/core';
import { fromComponents } from '@tools-state/component/component.reducer';
import { fromSlots } from '@tools-state/slot/slot.reducer';
import {
  buttonFactory, cardFactory, checkboxFactory, inputFactory
} from 'libs/kitchen/src/lib/definitions/components-definitions';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector   : 'puff-components-tree',
  templateUrl: './puff-components-tree.component.html',
  styleUrls  : ['./puff-components-tree.component.scss']
})
export class PuffComponentsTreeComponent implements OnInit {

  connectedTo$ = combineLatest(
    [
      fromComponents.fromComponentsStore,
      fromSlots.fromSlotsStore
    ]
  ).pipe(
    map(([components, slots]) => {
        return [...components.ids, ...slots.ids];
      }
    ),
    // map(()=>{
    //
    // })
  );

  list = [
    {
      accordionTitle: '布局容器类',
      children      : [
        {
          label   : 'Box',
          factory: checkboxFactory
        },
        {
          label   : 'Grid',
          factory: checkboxFactory
        },
        {
          label: 'Flex',
          factory: cardFactory
        }
      ]
    },
    {
      accordionTitle: '表单类',
      children      : [
        {
          label: 'Input',
          factory: inputFactory
        },
        {
          label: 'Select',
        },
        {
          label: 'Radio',
        },
        {
          label: 'Checkbox',
        },
        {
          label: 'Switch',
        },
        {
          label: 'Slider',
        },
        {
          label: 'DatePicker',
        }
      ]
    },
    {
      accordionTitle: '通用',
      children      : [
        {
          label: 'Button',
          factory: buttonFactory
        }
      ]
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
