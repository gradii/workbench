import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { getActiveNodeId } from '@tools-state/data/action-diagram/action-diagram.selectors';
import {
  ActionInspection, ActionInspectionDataSource, ActionInspectionView
} from '../action-diagram-inspection.service';

@Component({
  selector   : 'pf-action-inspection-info',
  templateUrl: './action-inspection-info.component.html',
  styleUrls  : ['./action-inspection-info.component.css']
})
export class ActionInspectionInfoComponent implements OnInit {
  activeDiagramNodeId$ = getActiveNodeId;

  @Input()
  dataSource: ActionInspectionDataSource;

  @Input()
  actionInspection: ActionInspection;

  actionInspectionView: ActionInspectionView = new ActionInspectionView();

  destroy$ = new Subject();

  selectedNode: any;

  constructor() {
  }

  onHintLink() {
    const link = 'abcdefg-aaaa-bbbb-dddd';
    this.actionInspection.hintLink(link);
  }

  onHintNode() {
    const node = 'abcdefg-aaaa-bbbb-dddd';
    this.actionInspection.hintNode(node);
  }

  ngOnInit(): void {
    this.activeDiagramNodeId$.pipe(
      takeUntil(this.destroy$),
      tap((activeNodeId) => {
        this.actionInspectionView.selectNode(activeNodeId);
      })
    ).subscribe();

    this.dataSource.connect(this.actionInspectionView).pipe(
      takeUntil(this.destroy$),
      tap((node) => {
        console.log(node);
        this.selectedNode = node;
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.dataSource.disconnect(this.actionInspectionView);
    this.destroy$.complete();
  }
}
