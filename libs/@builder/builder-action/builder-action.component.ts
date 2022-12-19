import { Component, OnInit, ViewChild } from '@angular/core';
import { DiagramComponent, DiagramModel, DiagramNodeModel, NodeModel } from '@gradii/triangle/diagram';
import { TriDialogService } from '@gradii/triangle/dialog';
import { TriDrag, TriDragDrop, TriDragEnter, TriDropFreeContainer } from '@gradii/triangle/dnd';
import { dispatch } from '@ngneat/effects';
import { ActionDiagramFacade } from '@tools-state/data/action-diagram/action-diagram-facade.service';
import { ActionDiagramActions } from '@tools-state/data/action-diagram/action-diagram.actions';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { Subject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ActionFlowActions } from '@tools-state/data/action-flow/action-flow.actions';
import { ActionType } from '@builder/builder-action/action-nodes/action-type';
import { BuilderActionService } from '@builder/builder-action/builder-action.service';
import { AddCustomTriggerComponent } from '@builder/builder-action/dialogs/add-custom-trigger.component';

@Component({
  selector   : 'pf-builder-action',
  templateUrl: './builder-action.component.html',
  providers  : [BuilderActionService],
  styleUrls  : ['./builder-action.component.scss']
})
export class BuilderActionComponent implements OnInit {

  @ViewChild(DiagramComponent, { static: true })
  diagram?: DiagramComponent;

  private _diagramModel = new DiagramModel();

  dropPredicate: any = (drag: TriDrag, drop: TriDropFreeContainer) => {
    if (drag.data) {
      const { namespace, type, notAllowMulti } = drag.data;
      if (notAllowMulti) {
        if (this.diagramModel.getNodes().find(node => node.type === type)) {
          return false;
        }
      }
    }
    return true;
  };

  get diagramModel(): DiagramModel<any> {
    return this._diagramModel;
  }

  set diagramModel(value: DiagramModel<any>) {
    this._diagramModel = value;
    this.actionDiagramFacade.setInspectDiagramModel(value);
  }

  selection: DiagramNodeModel;

  actionType = ActionType;

  destroy$ = new Subject();

  constructor(
    private actionDiagramFacade: ActionDiagramFacade,
    private pageFacade: PageFacade,
    private builderActionService: BuilderActionService,
    private dialogService: TriDialogService
  ) {
  }

  nodeData(nodeGroup, nodeData) {
    return {
      namespace    : nodeGroup.namespace,
      color        : nodeGroup.color,
      notAllowMulti: nodeGroup.notAllowMulti,
      type         : `${nodeGroup.namespace}:${nodeData.name}`,
      ...nodeData
    };
  }

  onStateChange(evt) {
    console.log(evt);
    const model = this._diagramModel.serialize();
    this.actionDiagramFacade.updateActionDiagramModel(model);
  }

  ngOnInit() {
    this.actionDiagramFacade.getActivePageActionDiagram$.pipe(
      take(1),
      tap((actionDiagram) => {
        if (actionDiagram) {
          const modelRestore = new DiagramModel();
          modelRestore.deserializeModel(actionDiagram.model, this.diagram.engine);

          this.diagramModel = modelRestore;
        }
      })
    ).subscribe();
  }

  getInputTransition(node: DiagramNodeModel) {
    const transition: any = {};
    node.getInPorts().forEach(it => {
      const sourceNodeModels: DiagramNodeModel[] = [];
      it.getLinks().forEach(it => {
        const sourcePort = it.getSourcePort();
        const target     = sourcePort.getParent();
        sourceNodeModels.push(target as DiagramNodeModel);
      });
      transition[it.name] = sourceNodeModels.map(it => it.name);
    });
    return transition;
  }

  getOutputTransition(node: DiagramNodeModel) {
    const transition: any = {};
    node.getOutPorts().forEach(it => {
      const targetNodeModels: DiagramNodeModel[] = [];
      it.getLinks().forEach(it => {
        const targetPort = it.getTargetPort();
        const target     = targetPort.getParent();
        targetNodeModels.push(target as DiagramNodeModel);
      });
      transition[it.name] = targetNodeModels.map(it => it.name);
    });
    return transition;
  }

  onSelectionChange(selection: any[]) {
    selection = selection.filter(it => it instanceof NodeModel);

    if (selection.length > 0 && selection.length === 1) {
      this.selection = selection[0];
      // console.log(this.selection);
      dispatch(ActionDiagramActions.SelectNode(this.selection.id, this.selection));

      // console.log(this._diagramModel.getNode(this.selection.id));
    } else {
      this.selection = undefined;
      dispatch(ActionDiagramActions.SelectNode(undefined));
    }
  }

  onDragEnter(evt: TriDragEnter) {
    console.log(evt);
  }

  onDropped(evt: TriDragDrop<any>) {
    const canvasManager = this.diagram?.engine;
    if (canvasManager) {
      const pointer      = {
        clientX: evt.elementPosition.x,
        clientY: evt.elementPosition.y
      };
      const droppedPoint = canvasManager.getRelativeMousePoint(pointer);

      // const nodeType = evt.item.data.name;
      // const color    = evt.item.data.color;

      const node   = this.createNode(evt.item.data);
      const coords = {
        x: droppedPoint.x,
        y: droppedPoint.y
      };

      if (node.type === 'gradii/action/trigger:custom') {
        this.dialogService.open(AddCustomTriggerComponent, {
          data: {
            coords
          }
        }).afterClosed().subscribe(result => {
          if (result) {
            node.displayName = result;
            node.setPosition(coords.x, coords.y);
            this.diagramModel.addNode(node);
            dispatch(ActionFlowActions.AddActionFlow(node.id, {
              type       : node.type,
              name       : node.name,
              displayName: node.displayName
            }));
            canvasManager.repaintCanvas();
          }
        });
      } else {
        node.setPosition(coords.x, coords.y);
        this.diagramModel.addNode(node);
        dispatch(ActionFlowActions.AddActionFlow(node.id, {
          type       : node.type,
          name       : node.name,
          displayName: node.displayName
        }));
        canvasManager.repaintCanvas();
      }
    }
    console.log(evt);
  }

  createNode(data?: any) {
    const node       = new DiagramNodeModel({
      name       : data.name,
      displayName: data.displayName || data.name,
      namespace  : data.namespace,
      color      : data.color || 'rgb(36,222,255)'
    });
    node.description = data.desc;
    if (data.inPorts && data.inPorts.length) {
      data.inPorts.forEach(it => {
        node.addInPort(it.name, it.desc);
      });
    }
    if (data.outPorts && data.outPorts.length) {
      data.outPorts.forEach(it => {
        node.addOutPort(it.name);
      });
    }

    return node;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.destroy$.complete();
  }
}
