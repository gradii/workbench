import { EmbeddedViewRef, ErrorHandler, Injectable, TemplateRef } from '@angular/core';
import {
  OvenBreakpointStyles,
  OvenComponent,
  StylesCompilerService,
  SyncReasonMsg,
  ComponentMargins,
  ComponentPaddings
} from '@common';

import { ViewDefinitionRegistryService, Slot, View } from '../definitions';
import { DefinitionContext } from '../definitions/definition';
import { RenderState } from '../state/render-state.service';
import { ComponentPropsMapperService } from './component-props-mapper.service';

@Injectable({ providedIn: 'root' })
export class RendererService {
  constructor(
    private viewDefinitionRegistryService: ViewDefinitionRegistryService,
    private renderState: RenderState,
    private stylesCompiler: StylesCompilerService,
    private errorHandler: ErrorHandler,
    private componentPropsMapper: ComponentPropsMapperService
  ) {
  }

  create<T>(component: OvenComponent, slot: Slot, syncReason: SyncReasonMsg): View<T> {
    const view: View<T> = this.createView(slot, component, syncReason);

    this.performBinding(view, component);

    if (view.slots) {
      this.updateSlots(view);
    }

    return view;
  }

  remove<T>(index: number, slot: Slot) {
    const viewRef: any = slot.viewContainerRef.get(index);
    slot.viewContainerRef.remove(index);
    const element: HTMLElement = viewRef.context.$implicit.view.element.nativeElement;
    element.style.display = 'none';
  }

  move<T>(view: View<T>, index: number, slot: Slot) {
    slot.viewContainerRef.move(view.viewRef, index);
  }

  updateSlots<T>(view: View<T>) {
    if (view.updateDynamicSlots) {
      view.updateDynamicSlots();
    }
  }

  performBinding<T>(view: View<T>, component: OvenComponent) {
    try {
      this.executeBinding(view, component);
    } catch (e) {
      this.errorHandler.handleError(e);
    }
  }

  private executeBinding<T>(view: View<T>, component: OvenComponent) {
    const styles = this.stylesCompiler.compileStyles(component.styles);
    const props = this.compileViewProps(styles, component);
    this.componentPropsMapper.mapProps(view, component.definitionId, props);

    this.fixTableRendering(view, component);
    this.hackDisabled(view);
    view.viewRef.detectChanges();
    this.scheduleTableRerendering(view, component);
  }

  private createView<T>(slot: Slot, component: OvenComponent, syncReason: SyncReasonMsg): View<T> {
    const context: { $implicit: DefinitionContext<T> } = {
      $implicit: {
        syncReason,
        component,
        view: null,
        devUIEnabled$: this.renderState.showDevUI$
      }
    };
    const definition: TemplateRef<any> = this.viewDefinitionRegistryService.get(component.definitionId);
    const index = this.resolveIndex(component, slot);
    const embedded: EmbeddedViewRef<any> = slot.viewContainerRef.createEmbeddedView(definition, context, index);
    embedded.detectChanges();

    const view: View<T> = context.$implicit.view;
    view.viewRef = embedded;
    return view;
  }

  // Property grid always has the same object link inside ng2-smart-table.
  // So set object as null for updating table settings
  private fixTableRendering(view, component: OvenComponent) {
    if (component.definitionId === 'smartTable') {
      view.instance.grid = null;
      view.instance.ngOnChanges();
    }
  }

  // I'm not sure why but this call helps smart tables to be rendered first time
  private scheduleTableRerendering(view, component: OvenComponent) {
    if (component.definitionId === 'smartTable') {
      Promise.resolve().then(() => view.viewRef.detectChanges());
    }
  }

  private hackDisabled(view) {
    if ('disabled' in view.instance) {
      view.instance.ovenDisabled = view.instance.disabled;
      view.instance.disabled = false;
    }
  }

  /**
   * HOTFIX:
   * Assigning clearSpacing object before assigning styles and properties to clear previously defined
   * spacing values. Let's imagine the following situation:
   *
   * 1. A new component added (space/card)
   * 2. The user selects Table breakpoint
   * 3. User changes component's paddings
   *
   * At this stage, we assigned paddings to the view like that:
   * {
   *   paddings: {
   *     paddingTop: 16,
   *   }
   * }
   *
   * 4. The user goes to the Desktop breakpoint
   * When the user goes to another breakpoint we're generating new styles object and assigning it to the view.
   * As we stated above, we already assigned objects with paddings to the view and view contains paddings.
   * And now we need to assign a new style object. However, at Desktop breakpoint we haven't got defined styles for paddings.
   * In that case, object assign will not clear paddings at the view.
   *
   * To solve that issue we're assigning clearSpacing object to the view. clearSpacing object contains empty margin and padding
   * styles and just helps us to clear view before assigning new properties.
   *
   * For more information, please check the issue:
   * https://akveo.myjetbrains.com/youtrack/agiles/82-142/83-716?issue=UIB_DEV_UB-1315
   */
  private compileViewProps(styles: OvenBreakpointStyles, component: OvenComponent) {
    const clearSpacing: { margins: ComponentMargins; paddings: ComponentPaddings } = {
      margins: {
        marginTop: undefined,
        marginTopUnit: undefined,
        marginRight: undefined,
        marginRightUnit: undefined,
        marginBottom: undefined,
        marginBottomUnit: undefined,
        marginLeft: undefined,
        marginLeftUnit: undefined
      },
      paddings: {
        paddingTop: undefined,
        paddingTopUnit: undefined,
        paddingRight: undefined,
        paddingRightUnit: undefined,
        paddingBottom: undefined,
        paddingBottomUnit: undefined,
        paddingLeft: undefined,
        paddingLeftUnit: undefined
      }
    };

    return {
      ...clearSpacing,
      ...styles,
      ...component.properties,
      actions: component.actions
    };
  }

  private resolveIndex(component: OvenComponent, slot: Slot): number {
    /**
     * Wondering why do we need this index calculation?
     * That's all because of conditional rendering. Let's take a look at the following example.
     *
     * - For instance I have a space with two cards.
     * - I'm rendering this space in the loop.
     * - And I'm rendering cards inside conditionally.
     * - The first card is rendered when index is odd.
     * - The second card is rendered when index is even.
     *
     * That mean that when we don't have the first card (that has index === 0) and have only second card we're trying
     * to insert a new component at the position 1 in empty container. And in that case ivy just throws the error.
     *
     * If you didn't get the issue, please, ask Nikita Poltoratsky.
     * */
    return Math.min(component.index, slot.viewContainerRef.length);
  }
}
