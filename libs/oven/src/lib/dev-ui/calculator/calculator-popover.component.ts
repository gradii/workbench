import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  NbDynamicOverlay,
  NbDynamicOverlayHandler,
  NbOverlayContent,
  NbPopoverComponent,
  NbPopoverDirective
} from '@nebular/theme';
import { animate, style, transition, trigger } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CalculatorDynamicOverlay } from '../component-selector/calculator-overlay.service';
import { RenderState } from '../../state/render-state.service';

@Component({
  selector: 'oven-calculator-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calculator-popover.component.scss'],
  template: `
    <span class="arrow"></span>
    <nb-overlay-container></nb-overlay-container>
  `,
  animations: [
    trigger('calculator', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.15s cubic-bezier(0.445, 0.05, 0.55, 0.95)', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.15s cubic-bezier(0.445, 0.05, 0.55, 0.95)', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CalculatorPopoverComponent extends NbPopoverComponent {
  @HostBinding('@calculator') calculatorAnimation = true;
}

@Directive({
  selector: '[ovenCalculatorPopover]',
  providers: [NbDynamicOverlayHandler, { provide: NbDynamicOverlay, useClass: CalculatorDynamicOverlay }]
})
export class CalculatorPopoverDirective extends NbPopoverDirective implements OnInit, OnDestroy {
  @Input()
  set ovenCalculatorPopover(content: NbOverlayContent) {
    this.content = content;
  }

  private destroyed$ = new Subject<void>();

  constructor(
    private elRef: ElementRef,
    private renderState: RenderState,
    private overlayHandler: NbDynamicOverlayHandler
  ) {
    super(elRef, overlayHandler);
  }

  ngOnInit() {
    this.overlayHandler.host(this.elRef).componentType(CalculatorPopoverComponent);

    this.renderState.closeCalculator$.pipe(takeUntil(this.destroyed$)).subscribe(() => this.hide());
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.destroyed$.next();
  }
}
