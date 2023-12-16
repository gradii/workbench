import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewChild
} from '@angular/core';
import { ComponentLogicPropName, DivideSpaceType } from '@common';

import { VirtualComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { isSpace } from '../util';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { UIActionIntentService } from '../../state/ui-action-intent.service';

@Component({
  selector: 'oven-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./actions.component.scss', './action-button.scss'],
  template: `
    <oven-breadcrumbs [virtualComponent]="vc" (selectComponent)="select($event)"></oven-breadcrumbs>
    <oven-divide-space-button
      *ngIf="splittable"
      [relativeTo]="breadcrumbs"
      (divide)="divide($event)"
    ></oven-divide-space-button>
    <button *ngIf="deletable" nbButton class="action-button clear-icon" size="tiny" (click)="remove()">
      <bc-icon name="trash-2"></bc-icon>
    </button>
    <button
      *ngIf="sequence"
      nbButton
      class="action-button info clear-icon"
      nbTooltip="Sequence"
      nbTooltipStatus="info"
      nbTooltipClass="data-tooltip-info"
      (click)="showSequenceSource()"
      size="tiny"
    >
      <bc-icon name="sequence-selected"></bc-icon>
    </button>
    <oven-data-error [component]="vc.component" (shouldFix)="shouldFixData()"></oven-data-error>
  `
})
export class ActionsComponent {
  @ViewChild(BreadcrumbsComponent, { read: ElementRef }) breadcrumbs: ElementRef;

  @Input()
  set virtualComponent(value: VirtualComponent) {
    this.vc = value;
    this.splittable = this.canSplit();
    this.deletable = this.canRemove();
    this.sequence = this.isSequence();
    this.cd.detectChanges();
  }

  @HostBinding('style.width.px')
  @Input()
  width: number;

  vc: VirtualComponent;
  splittable: boolean;
  deletable: boolean;
  sequence: boolean;

  constructor(
    private renderState: RenderState,
    private uiActionIntent: UIActionIntentService,
    private cd: ChangeDetectorRef
  ) {
  }

  select(vc: VirtualComponent) {
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
    return isSpace(this.vc) && this.vc.component.slots.content.componentList.length === 0;
  }

  private canRemove(): boolean {
    // space can be removed if it's not the last space or it's located inside other space
    if (isSpace(this.vc)) {
      if (isSpace(this.vc.parentComponent)) {
        return true;
      }
      return this.vc.parentSlot.componentList.length > 1;
    }
    return true;
  }

  private isSequence(): boolean {
    return !!this.vc.component.properties[ComponentLogicPropName.SEQUENCE_PROPERTY]?.code;
  }
}
