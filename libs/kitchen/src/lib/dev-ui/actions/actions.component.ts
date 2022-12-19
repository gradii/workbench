import {
  ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild, ɵdetectChanges
} from '@angular/core';
import { DivideSpaceType } from '@common/public-api';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { UIActionIntentService } from '../../state/ui-action-intent.service';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@Component({
  selector       : 'kitchen-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : [
    './actions.component.scss',
    './action-button.scss'
  ],
  template       : `
    <kitchen-breadcrumbs [virtualComponent]="vc"
                         (selectComponent)="select($event)"></kitchen-breadcrumbs>
    <kitchen-divide-space-button
      *ngIf="splittable"
      [relativeTo]="breadcrumbs"
      (divide)="divide($event)"
    ></kitchen-divide-space-button>
    <button *ngIf="deletable"
            triButton
            variant="text"
            class="action-button clear-icon"
            size="xsmall" (click)="remove()">
      <tri-icon svgIcon="outline:trash"></tri-icon>
    </button>
    <button
      *ngIf="sequence"
      triButton
      class="action-button info clear-icon"
      triTooltip="Sequence"
      triTooltipClass="data-tooltip-info"
      (click)="showSequenceSource()"
      size="xsmall"
    >
      <tri-icon svgIcon="workbench:sequence-selected"></tri-icon>
    </button>
    <kitchen-data-error [component]="vc.component" (shouldFix)="shouldFixData()"></kitchen-data-error>
  `
})
export class ActionsComponent {
  @ViewChild(BreadcrumbsComponent, { read: ElementRef }) breadcrumbs: ElementRef;

  @Input()
  set virtualComponent(value: FlourComponent) {
    this.vc         = value;
    this.splittable = this.canSplit();
    this.deletable  = this.canRemove();
    this.sequence   = this.isSequence();
    ɵdetectChanges(this);
  }

  @HostBinding('style.width.px')
  @Input()
  width: number;

  vc: FlourComponent;
  splittable: boolean;
  deletable: boolean;
  sequence: boolean;

  constructor(
    private renderState: RenderState,
    private uiActionIntent: UIActionIntentService
  ) {
  }

  select(vc: FlourComponent) {
    this.renderState.select(vc, false);
  }

  remove() {
    if (this.deletable) {
      this.renderState.remove(this.vc);
    }
  }

  divide(type: DivideSpaceType) {
    this.renderState.divideSpaceComponent(this.vc, type);
  }

  showSequenceSource() {
    this.uiActionIntent.showSequenceSource();
  }

  shouldFixData() {
    this.uiActionIntent.fixDataSource();
  }

  private canSplit(): boolean {
    return false;
    // return isSpace(this.vc) && this.vc.component.slots.content.componentList.length === 0;
  }

  private canRemove(): boolean {
    // space can be removed if it's not the last space or it's located inside other space
    // if (isSpace(this.vc)) {
    //   if (isSpace(this.vc.parentComponent)) {
    //     return true;
    //   }
    //   return this.vc.parentSlot.componentList.length > 1;
    // }
    return true;
  }

  private isSequence(): boolean {
    return false;
    // return !!this.vc.component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY]?.code;
  }
}
