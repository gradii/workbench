import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { NbOverlayService, NbPositionBuilderService, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VirtualComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { CalculatorPopoverDirective } from '../calculator/calculator-popover.component';
import { CalculatorOverlayService } from './calculator-overlay.service';
import { PositionBuilderService } from './calculator-adjastment-strategy';

@Component({
  selector: 'oven-component-selector-button',
  styleUrls: ['./component-selector.component.scss'],
  providers: [
    { provide: NbPositionBuilderService, useClass: PositionBuilderService },
    { provide: NbOverlayService, useClass: CalculatorOverlayService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="icon-button" [ovenCalculatorPopover]="selector">
      <bc-icon [name]="icon$ | async"></bc-icon>
    </button>

    <ng-template #selector>
      <oven-calculator [virtualComponent]="virtualComponent"></oven-calculator>
    </ng-template>
  `
})
export class ComponentSelectorComponent implements OnDestroy {
  @Input() virtualComponent: VirtualComponent;

  @ViewChild(CalculatorPopoverDirective) popover: CalculatorPopoverDirective;

  icon$: Observable<string> = this.themeService.onThemeChange().pipe(
    map((themeInfo: { name: string }) => {
      return themeInfo.name === 'dark' ? 'dev-ui-component-selector-dark' : 'dev-ui-component-selector-light';
    })
  );

  constructor(private state: RenderState, private themeService: NbThemeService) {
  }

  ngOnDestroy() {
    this.popover.hide();
  }
}
