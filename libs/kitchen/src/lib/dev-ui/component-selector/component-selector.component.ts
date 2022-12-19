import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { PopoverDirective } from '@gradii/triangle/popover';
// import { NbThemeService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';

@Component({
  selector       : 'kitchen-component-selector-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <button class="icon-button"
            [triPopover]="selector"
            triPopoverTrigger="hint">
      <tri-icon svgIcon="fill:plus-circle"></tri-icon>
    </button>

    <ng-template #selector>
      <kitchen-calculator [virtualComponent]="virtualComponent"></kitchen-calculator>
    </ng-template>
  `,
  providers      : [],
  styleUrls      : ['./component-selector.component.scss']
})
export class ComponentSelectorComponent implements OnDestroy {
  @Input() virtualComponent: FlourComponent;

  @ViewChild(PopoverDirective) popover: PopoverDirective;

/*  icon$: Observable<string> = this.themeService.onThemeChange().pipe(
    map((themeInfo: { name: string }) => {
      return themeInfo.name === 'dark' ? 'workbench:dev-ui-component-selector-dark' : 'workbench:dev-ui-component-selector-light';
    })
  );*/

  private destroyed$ = new Subject<void>();

  constructor(private renderState: RenderState,/* private themeService: NbThemeService*/) {
  }

  ngOnInit() {
    this.renderState.closeCalculator$.pipe(
      takeUntil(this.destroyed$),
      tap(() => {
        this.popover.hide();
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.popover.hide();

    this.destroyed$.complete();
  }
}
