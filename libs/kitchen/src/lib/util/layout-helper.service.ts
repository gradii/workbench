import { Injectable } from '@angular/core';
import {
  KitchenApp,
  KitchenCompiledLayout,
  KitchenLayout,
  KitchenLayoutStyles,
  KitchenPage,
  SpacingService,
  StylesCompilerService
} from '@common/public-api';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';

import { RenderState } from '../state/render-state.service';

@Injectable(/*{ providedIn: 'root' }*/)
export class LayoutHelper {
  private compiledLayout$: Observable<KitchenCompiledLayout> = combineLatest([
    this.renderState.app$,
    this.renderState.activePage$
  ]).pipe(
    map(([app, page]: [KitchenApp, KitchenPage]) => this.getActiveCompiledLayout(app, page)),
    filter(layout => !!layout)
  );

  layout$ = this.compiledLayout$.pipe(
    distinctUntilChanged((prev: KitchenCompiledLayout, next: KitchenCompiledLayout) => this.isLayoutEquals(prev, next))
  );

  layoutChanged$ = this.layout$.pipe(skip(1));

  isLayoutEquals(prev: KitchenCompiledLayout, next: KitchenCompiledLayout): boolean {
    if (!prev) {
      return false;
    }
    const prevPaddings = prev.styles.paddings;
    const nextPaddings = next.styles.paddings;
    const prevProps = prev.properties;
    const nextProps = next.properties;

    return (
      prevProps.header === nextProps.header &&
      prevProps.sidebar === nextProps.sidebar &&
      this.spacingService.isPaddingsEqual(prevPaddings, nextPaddings)
    );
  }

  constructor(
    private renderState: RenderState,
    private stylesCompiler: StylesCompilerService,
    private spacingService: SpacingService
  ) {
  }

  private getActiveCompiledLayout(app: KitchenApp, page: KitchenPage): KitchenCompiledLayout {
    const layout: KitchenLayout = (page && page.layout) || app.layout;

    if (!layout) {
      return null;
    }

    const styles: KitchenLayoutStyles = this.stylesCompiler.compileStyles(layout.styles) as KitchenLayoutStyles;
    const { properties } = layout;
    return { styles, properties };
  }
}
