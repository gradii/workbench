import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BreakpointWidth, ComponentPaddings, StylesCompilerService } from '@common';
import { select, Store } from '@ngrx/store';
import { pluck, take } from 'rxjs/operators';

import { BakeryLayout, BakeryLayoutProperties, BakeryLayoutStyles } from '@tools-state/layout/layout.model';
import { fromTools } from '@tools-state/tools.reducer';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';

@Component({
  selector: 'ub-layout-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./layout-settings.component.scss'],
  template: `
    <span *ngIf="!forPage" class="label type-label">Choose layout for your app</span>
    <nb-checkbox
      *ngIf="forPage"
      class="label type-label"
      [checked]="!!layout"
      (checkedChange)="enablePageLayout($event)"
    >
      Custom layout settings
    </nb-checkbox>
    <ub-layout-type
      [class.disabled]="!layout"
      [header]="layoutProperties?.header"
      [sidebar]="layoutProperties?.sidebar"
      (layoutTypeChange)="onLayoutTypeChange($event)"
    ></ub-layout-type>
    <nb-accordion multi [class.disabled]="!layout">
      <nb-accordion-item expanded>
        <nb-accordion-item-header>
          <ub-setting-label-container notificationPlacement="end">Spacing</ub-setting-label-container>
        </nb-accordion-item-header>
        <nb-accordion-item-body class="with-padding">
          <ub-margin-padding
            [padding]="layoutStyles?.paddings"
            (paddingChange)="onPaddingChange($event)"
            [marginDisabled]="true"
          >
          </ub-margin-padding>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
  `
})
export class LayoutSettingsComponent {
  @Input()
  set layout(layout: BakeryLayout) {
    if (!layout) {
      this.layoutStyles = null;
      this.layoutProperties = null;
      this._layout = null;
      return;
    }

    this.layoutStyles = this.stylesCompiler.compileStyles(layout.styles) as BakeryLayoutStyles;
    this.layoutProperties = layout.properties;
    this._layout = layout;
  }

  get layout(): BakeryLayout {
    return this._layout;
  }

  private _layout: BakeryLayout;

  layoutStyles: BakeryLayoutStyles;
  layoutProperties: BakeryLayoutProperties;

  @Input() globalLayout: BakeryLayout;
  @Input() forPage: boolean;

  @Output() layoutChange: EventEmitter<Partial<BakeryLayout>> = new EventEmitter<Partial<BakeryLayout>>();

  constructor(private stylesCompiler: StylesCompilerService, private store: Store<fromTools.State>) {
  }

  onLayoutTypeChange(properties: BakeryLayoutProperties) {
    this.layoutChange.emit({ properties });
  }

  onPaddingChange(paddings: ComponentPaddings) {
    this.store
      .pipe(select(getSelectedBreakpoint), pluck('width'), take(1))
      .subscribe((activeBreakpoint: BreakpointWidth) => {
        this.layoutChange.emit({
          styles: {
            ...this.layout.styles,
            [activeBreakpoint]: {
              paddings
            }
          }
        });
      });
  }

  enablePageLayout(enabled: boolean) {
    if (enabled) {
      this.layoutChange.emit({ ...this.globalLayout });
    } else {
      this.layoutChange.emit(null);
    }
  }
}
