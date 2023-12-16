import { Injectable } from '@angular/core';
import {
  OvenApp,
  OvenCompiledLayout,
  OvenLayout,
  OvenLayoutStyles,
  OvenPage,
  SpacingService,
  StylesCompilerService
} from '@common';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';

import { RenderState } from '../state/render-state.service';

@Injectable({ providedIn: 'root' })
export class LayoutHelper {
  private compiledLayout$: Observable<OvenCompiledLayout> = combineLatest([
    this.renderState.app$,
    this.renderState.activePage$
  ]).pipe(
    map(([app, page]: [OvenApp, OvenPage]) => this.getActiveCompiledLayout(app, page)),
    filter(layout => !!layout)
  );

  layout$ = this.compiledLayout$.pipe(
    distinctUntilChanged((prev: OvenCompiledLayout, next: OvenCompiledLayout) => this.isLayoutEquals(prev, next))
  );

  layoutChanged$ = this.layout$.pipe(skip(1));

  isLayoutEquals(prev: OvenCompiledLayout, next: OvenCompiledLayout): boolean {
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

  private getActiveCompiledLayout(app: OvenApp, page: OvenPage): OvenCompiledLayout {
    const layout: OvenLayout = (page && page.layout) || app.layout;

    if (!layout) {
      return null;
    }

    const styles: OvenLayoutStyles = this.stylesCompiler.compileStyles(layout.styles) as OvenLayoutStyles;
    const { properties } = layout;
    return { styles, properties };
  }
}
