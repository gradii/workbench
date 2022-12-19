import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BreakpointWidth, ComponentPaddings, StylesCompilerService } from '@common/public-api';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';

import { BakeryLayout, BakeryLayoutProperties, BakeryLayoutStyles } from '@tools-state/layout/layout.model';
import { pluck, take } from 'rxjs/operators';

@Component({
  selector       : 'pf-layout-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./layout-editor.component.scss'],
  template       : `
    <span *ngIf="!forPage" class="label type-label">Choose layout for your app</span>
    <tri-checkbox
      *ngIf="forPage"
      class="label type-label"
      [value]="!!layout"
      (checkedChange)="enablePageLayout($event)"
    >
      Custom layout settings
    </tri-checkbox>
    <pf-layout-type
      [class.disabled]="!layout"
      [header]="layoutProperties?.header"
      [sidebar]="layoutProperties?.sidebar"
      (layoutTypeChange)="onLayoutTypeChange($event)"
    ></pf-layout-type>
    <tri-accordion [class.disabled]="!layout">
      <tri-accordion-item expanded>
        <pf-setting-label-container accordion-title notificationPlacement="end">Spacing</pf-setting-label-container>
        <div class="with-padding">
          <ub-margin-padding
            [padding]="layoutStyles?.paddings"
            (paddingChange)="onPaddingChange($event)"
            [marginDisabled]="true"
          >
          </ub-margin-padding>
        </div>
      </tri-accordion-item>
    </tri-accordion>
  `
})
export class LayoutEditorComponent {
  @Input()
  set layout(layout: BakeryLayout) {
    if (!layout) {
      this.layoutStyles     = null;
      this.layoutProperties = null;
      this._layout          = null;
      return;
    }

    this.layoutStyles     = this.stylesCompiler.compileStyles(layout.styles) as BakeryLayoutStyles;
    this.layoutProperties = layout.properties;
    this._layout          = layout;
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

  constructor(private stylesCompiler: StylesCompilerService) {
  }

  onLayoutTypeChange(properties: BakeryLayoutProperties) {
    this.layoutChange.emit({ properties });
  }

  onPaddingChange(paddings: ComponentPaddings) {
    getSelectedBreakpoint
      .pipe(pluck('width'), take(1))
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
