import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { ColorInputSource } from '@common';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { ColorChange } from '@tools-state/theme/theme.models';
import { ColorModalService } from '../color-modal/color-modal.service';

@Component({
  selector: 'ub-color-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./color-input.component.scss'],
  template: `
    <div class="input-container">
      <ub-color-preview
        #preview
        [color]="color"
        [icon]="icon"
        (click)="openModal()"
        [editable]="editable"
      ></ub-color-preview>
      <label>
        <input nbInput [ngModel]="color" (ngModelChange)="updateFromInput($event)" [disabled]="!editable" />
        {{ label }}
      </label>
    </div>

    <button
      *ngIf="lockable"
      nbButton
      ghost
      class="basic lock"
      size="tiny"
      [disabled]="!editable"
      [class.locked]="locked"
      (click)="lock.emit(!locked)"
    >
      <nb-icon [icon]="locked ? 'lock' : 'unlock'"></nb-icon>
    </button>
    <ng-template #colorModal let-data>
      <ub-color-modal [color]="data.color"></ub-color-modal>
    </ng-template>
  `
})
export class ColorInputComponent implements OnDestroy {
  @Input() color: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() editable: boolean;
  @Input() lockable: boolean;
  @Input() locked: boolean;
  @Input() logoInput = false;

  @Output() colorChange: EventEmitter<ColorChange> = new EventEmitter<ColorChange>();
  @Output() lock: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('preview', { read: ElementRef }) previewEl: ElementRef<HTMLElement>;

  private submitSubscription: Subscription;
  private destroyed: Subject<void> = new Subject<void>();

  constructor(private colorModalService: ColorModalService) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  openModal() {
    if (!this.editable) {
      return;
    }
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }

    this.submitSubscription = this.colorModalService
      .show(this.previewEl, this.color, this.logoInput)
      .submit.pipe(takeUntil(this.destroyed))
      .subscribe((color: ColorChange) => this.colorChange.emit(color));
  }

  updateFromInput(color) {
    if (color.length === 6 && color[0] !== '#') {
      color = '#' + color;
      this.color = color;
    }
    if (color.length === 7 && color[0] === '#') {
      this.colorChange.emit({ color, inputSource: ColorInputSource.INPUT });
    }
  }
}
