import {
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  InjectionToken,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import { combineLatest, iif, merge, NEVER, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AnalyticsService, StylesCompilerService, TriggeredAction } from '@common';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';

import { BakeryComponent } from '@tools-state/component/component.model';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { OverlayDetachHandlerService } from './overlay-detach-handler.service';
import { ComponentSettings, SettingsView } from './settings-view';
import { fromTools } from '@tools-state/tools.reducer';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { getSettingsView } from './component-settings-mapping';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { getWorkflowNameById } from '@tools-state/data/workflow/workflow.selectors';

export const ACTIVATE$ = new InjectionToken<Observable<boolean>>('Activate Component');
export const DEACTIVATE$ = new InjectionToken<Observable<boolean>>('Deactivate Component');

export interface SettingsContext {
  settings: Type<SettingsView>;
  component: BakeryComponent;
}

interface CacheBag {
  ref: ViewRef;
  instance: SettingsView<any>;
  component: BakeryComponent;
}

@Directive({ selector: '[ubSettings]' })
export class SettingsDirective implements OnInit, OnDestroy {
  @Output() binding = new EventEmitter();
  private viewsCache: Map<string, CacheBag> = new Map();
  private selectedBreakpoint$ = this.store.pipe(select(getSelectedBreakpoint));
  private activeComponent$: Observable<BakeryComponent> = this.componentFacade.activeComponent$;
  private destroyPropsChange$ = new Subject();
  private destroy$ = new Subject();
  private context$ = this.activeComponent$.pipe(
    filter(a => !!a),
    distinctUntilChanged((a: BakeryComponent, b: BakeryComponent) => a && b && a.id === b.id),
    map((component: BakeryComponent) => ({ component, settings: getSettingsView(component.definitionId) })),
    takeUntil(this.destroy$)
  );

  constructor(
    private host: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private analytics: AnalyticsService,
    private selectDetachHandlerService: OverlayDetachHandlerService,
    private componentFacade: ComponentFacade,
    private stylesCompiler: StylesCompilerService,
    private store: Store<fromTools.State>,
    private injector: Injector
  ) {
  }

  ngOnInit(): void {
    this.context$.subscribe((context: SettingsContext) => {
      this.renderSettings(context);
    });
  }

  ngOnDestroy(): void {
    this.destroyPropsChange$.next();
    this.destroy$.next();
    this.destroyCache();
  }

  private renderSettings(context: SettingsContext): void {
    const cacheBag: CacheBag = this.renderComponent(context);
    this.subscribeOnBindingsChanges(cacheBag);
  }

  private renderComponent(context: SettingsContext): CacheBag {
    const { component, settings } = context;

    // Remove active settings component
    this.host.detach();
    this.selectDetachHandlerService.detach();

    let cacheBag: CacheBag;

    // Reattach from cache if exist
    if (this.viewsCache.has(component.id)) {
      cacheBag = this.viewsCache.get(component.id);
      this.host.insert(cacheBag.ref);
    } else {
      // Render new instance if not

      const injector = this.createComponentInjector(component);
      const factory = this.componentFactoryResolver.resolveComponentFactory(settings);
      const componentRef = this.host.createComponent(factory, 0, injector);

      // Update component instance
      const { instance } = componentRef;

      // Cache view
      const ref: ViewRef = this.host.get(0);
      cacheBag = { ref, instance, component };
      this.viewsCache.set(component.id, cacheBag);
    }

    return cacheBag;
  }

  /**
   * Create custom injector with two streams
   * So that all children settings components can react to whether they are active or not
   */
  private createComponentInjector(component: BakeryComponent): Injector {
    const { activate$, deactivate$ } = this.createActivationStreams(component);
    return Injector.create({
      providers: [
        {
          provide: ACTIVATE$,
          useValue: activate$
        },
        {
          provide: DEACTIVATE$,
          useValue: deactivate$
        }
      ],
      parent: this.injector
    });
  }

  private createActivationStreams(
    component: BakeryComponent
  ): { activate$: Observable<boolean>; deactivate$: Observable<boolean> } {
    const isActive$ = this.context$.pipe(
      map(({ component: activeComponent }) => activeComponent.id),
      map((activeComponentId: string) => activeComponentId === component.id)
    );

    const activate$ = isActive$.pipe(filter(isActive => isActive));
    const deactivate$ = isActive$.pipe(filter(isActive => !isActive));
    return { activate$, deactivate$ };
  }

  /**
   * Listen for changes for component from multiple places:
   * - active component changes
   * - styles update changes
   * - properties update changes
   * - etc.
   *
   * And send events to update component state at the store
   * */
  private subscribeOnBindingsChanges(cacheBag: CacheBag) {
    this.destroyPropsChange$.next();

    const componentFromStore$: Observable<BakeryComponent> = this.activeComponent$;

    const componentAfterStyleUpdate$: Observable<BakeryComponent> = cacheBag.instance.updateStyleAtActiveBreakpoint.pipe(
      switchMap(style => this.updateStyleAtActiveBreakpoint(cacheBag, style))
    );

    const componentAfterPropertyUpdate$: Observable<BakeryComponent> = cacheBag.instance.updateProperty.pipe(
      map(property => this.updateProperty(cacheBag, property))
    );

    const componentAfterActionsUpdate$: Observable<BakeryComponent> = iif(
      () => !!cacheBag.instance.updateActions,
      cacheBag.instance.updateActions,
      NEVER
    ).pipe(map(actions => this.updateActions(cacheBag, actions)));

    const componentChange$ = merge(
      componentFromStore$,
      componentAfterStyleUpdate$,
      componentAfterPropertyUpdate$,
      componentAfterActionsUpdate$
    );

    combineLatest([componentChange$, this.selectedBreakpoint$])
      .pipe(
        map(([component]) => component),
        filter(c => !!c),
        takeUntil(this.destroyPropsChange$)
      )
      .subscribe((component: BakeryComponent) => this.updateCacheBagWithNewComponent(cacheBag, component));
  }

  private updateStyleAtActiveBreakpoint(cacheBag: CacheBag, style: any): Observable<BakeryComponent> {
    this.logBindingChange(cacheBag.component, style);
    return this.mergeStylesAtActiveBreakpoint(cacheBag.component, style).pipe(
      tap((update: Update<BakeryComponent>) => this.binding.next(update)),
      map((update: Update<BakeryComponent>) => ({
        ...cacheBag.component,
        styles: { ...update.changes.styles }
      }))
    );
  }

  private updateProperty(cacheBag: CacheBag, property: any): BakeryComponent {
    this.logBindingChange(cacheBag.component, property);
    const updatedProperties = this.mergeProperties(cacheBag.component, property);
    this.binding.next(updatedProperties);

    return { ...cacheBag.component, properties: { ...updatedProperties.changes.properties } };
  }

  private updateActions(cacheBag: CacheBag, actions: any): BakeryComponent {
    const { component } = cacheBag;
    this.logActionAssign(component, actions);
    const updatedActions = this.mergeActions(component, actions);
    this.binding.next(updatedActions);

    return { ...component, actions: { ...component.actions, ...updatedActions.changes.actions } };
  }

  private mergeStylesAtActiveBreakpoint(component: BakeryComponent, styles: any): Observable<Update<BakeryComponent>> {
    return this.selectedBreakpoint$.pipe(
      take(1),
      map((breakpoint: Breakpoint) => {
        const updatedStyles = { ...component.styles };
        updatedStyles[breakpoint.width] = {
          ...updatedStyles[breakpoint.width],
          ...styles
        };
        return {
          id: component.id,
          changes: {
            styles: updatedStyles
          }
        };
      })
    );
  }

  private mergeProperties(component: BakeryComponent, properties: any): Update<BakeryComponent> {
    return {
      id: component.id,
      changes: {
        properties: {
          ...component.properties,
          ...properties
        }
      }
    };
  }

  private mergeActions(component: BakeryComponent, actions: any): Update<BakeryComponent> {
    return {
      id: component.id,
      changes: {
        actions: {
          ...component.actions,
          ...actions
        }
      }
    };
  }

  private destroyCache() {
    this.viewsCache.forEach(({ ref }: { ref: ViewRef }) => ref.destroy());
  }

  private updateCacheBagWithNewComponent(cacheBag: CacheBag, component: BakeryComponent) {
    cacheBag.instance.settings = this.createComponentSettings(component);
    cacheBag.component = component;
  }

  private logBindingChange(component: BakeryComponent, binding) {
    const componentName = component.definitionId;
    const configName = Object.keys(binding)[0];
    const configNewParameter = this.createConfigNewParameter(binding[configName]);

    this.analytics.logChangeComponentConfig(componentName, configName, configNewParameter);
  }

  /**
   * Since we're using https://amplitude.com/ for analytics tracking we ought to pay attention to the format of the event.
   * For instance, if we're sending to the amplitude an event with the param configNewParameter which contains primitive it'll be ok.
   * However, if this param contains an object:
   *
   * configNewParameter: {
   *   background: {
   *     color: 'red',
   *     imageSrc: '',
   *     active: false,
   *   }
   * }
   *
   * Amplitude will treat it as a number of the following params:
   * configNewParameter.background.color
   * configNewParameter.background.imageSrc
   * configNewParameter.background.active
   *
   * So, in that case, we're getting three params instead of one. But we have a limitation at the amplitude to the number of params.
   * That's why we decided to send a JSON instead of the object. Primitive values will be sent as raw data as it was before.
   * */
  private createConfigNewParameter(potentialNewParameter): string {
    const impossibleTypes = ['object', 'undefined'];

    if (impossibleTypes.includes(typeof potentialNewParameter)) {
      return JSON.stringify(potentialNewParameter);
    }

    return potentialNewParameter;
  }

  private createComponentSettings(component: BakeryComponent): ComponentSettings {
    const { styles, properties, actions } = component;
    const compiledStyles = this.stylesCompiler.compileStyles(styles);

    return { styles: compiledStyles, properties, actions, component };
  }

  private logActionAssign(component: BakeryComponent, actions: any): void {
    for (const [trigger, triggeredActions] of Object.entries(actions)) {
      for (const triggeredAction of triggeredActions as TriggeredAction[]) {
        if (!triggeredAction.action) {
          continue;
        }

        this.store
          .pipe(select(getWorkflowNameById, triggeredAction.action), take(1))
          .subscribe((actionName: string) => {
            this.analytics.logActionAssign(triggeredAction.action, component.definitionId, trigger, actionName);
          });
      }
    }
  }
}
