import {
  Directive, EventEmitter, InjectionToken, Injector, Input, OnDestroy, OnInit, Output, Type, ViewContainerRef, ViewRef
} from '@angular/core';
import { AnalyticsService, StylesCompilerService, TriggeredAction } from '@common/public-api';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { getSelectedBreakpoint } from '@tools-state/breakpoint/breakpoint.selectors';
import { ComponentFacade } from '@tools-state/component/component-facade.service';

import { PuffComponent } from '@tools-state/component/component.model';
import { getWorkflowNameById } from '@tools-state/data/workflow/workflow.selectors';
import { combineLatest, iif, merge, mergeMap, NEVER, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PuffFeature } from '../../@tools-state/feature/feature.model';
import { fromFeatures } from '../../@tools-state/feature/feature.reducer';
import { getFeatureListFromSlotId } from '../../@tools-state/feature/feature.selectors';
import { PuffSlot } from '../../@tools-state/slot/slot.model';
import { getSettingsView } from './component-settings-mapping';
import { SlotEditorComponent } from './components/slot-editor.component';
import { OverlayDetachHandlerService } from './overlay-detach-handler.service';
import { ComponentSettings, SettingsView } from './settings-view';

export const ACTIVATE$   = new InjectionToken<Observable<boolean>>('Activate Component');
export const DEACTIVATE$ = new InjectionToken<Observable<boolean>>('Deactivate Component');

export interface ComponentEditorContext {
  settings: Type<SettingsView>;
  component: PuffComponent;
}

interface CacheBag {
  ref: ViewRef;
  instance: SettingsView<any>;
  // optional in slot editor
  component?: PuffComponent;
  slot?: PuffSlot;
  featureList?: PuffFeature[];
}

@Directive({ selector: '[pfEditor]' })
export class EditorDirective implements OnInit, OnDestroy {
  @Input()
  selectedBreakpoint: Breakpoint;

  @Output()
  componentBinding: EventEmitter<Partial<PuffComponent>> = new EventEmitter();

  @Output()
  featureBinding: EventEmitter<Partial<PuffFeature>> = new EventEmitter();

  @Output()
  addFeatureBinding: EventEmitter<PuffFeature> = new EventEmitter();

  private viewsCache: Map<string, CacheBag>           = new Map();
  private selectedBreakpoint$                         = getSelectedBreakpoint;
  private activeComponent$: Observable<PuffComponent> = this.componentFacade.activeComponent$;
  private activeSlot$: Observable<PuffSlot>           = this.componentFacade.activeSlot$;

  private destroyPropsChange$ = new Subject<void>();
  private destroy$            = new Subject<void>();
  private context$            = this.activeComponent$.pipe(
    filter(a => !!a),
    distinctUntilChanged((a: PuffComponent, b: PuffComponent) => a && b && a.id === b.id),
    map((component: PuffComponent) => ({ component, settings: getSettingsView(component.definitionId) })),
    takeUntil(this.destroy$)
  );

  constructor(
    private host: ViewContainerRef,
    private analytics: AnalyticsService,
    private selectDetachHandlerService: OverlayDetachHandlerService,
    private componentFacade: ComponentFacade,
    private stylesCompiler: StylesCompilerService,
    private injector: Injector
  ) {
  }

  ngOnInit(): void {
    this.context$.subscribe((context: ComponentEditorContext) => {
      this.renderEditor(context);
    });

    this.activeSlot$.pipe(
      filter(a => !!a),
      switchMap((slot: PuffSlot) => {
        return getFeatureListFromSlotId(slot.id).pipe(
          map((featureList: PuffFeature[]) => ({ slot, featureList }))
        );
      }),
      tap(({ slot, featureList }) => {
        console.log(slot);

        if (slot) {
          const cacheBag = this.renderSlotEditor({ slot, featureList });
          this.subscribeOnSlotEditorBindingsChanges(cacheBag);
        }

      })).subscribe();
  }

  private renderSlotEditor(context: { slot: PuffSlot, featureList: PuffFeature[] }): CacheBag {
    const { slot, featureList } = context;

    this.host.detach();
    this.selectDetachHandlerService.detach();

    let cacheBag: CacheBag;

    // Reattach from cache if exist
    if (this.viewsCache.has(slot.id)) {
      cacheBag = this.viewsCache.get(slot.id);
      this.host.insert(cacheBag.ref);
    } else {
      // Render new instance if not

      const componentRef = this.host.createComponent(
        SlotEditorComponent, {
          index   : 0,
          injector: this.injector
        }
      );

      componentRef.changeDetectorRef.detectChanges();

      // Update component instance
      const { instance } = componentRef;

      // Cache view
      const ref: ViewRef = this.host.get(0);
      cacheBag           = { ref, instance, slot, featureList };
      this.viewsCache.set(slot.id, cacheBag);
    }

    return cacheBag;
  }

  private renderEditor(context: ComponentEditorContext): void {
    const cacheBag: CacheBag = this.renderComponent(context);
    this.subscribeOnBindingsChanges(cacheBag);
  }

  private renderComponent(context: ComponentEditorContext): CacheBag {
    const { component, settings } = context;

    // Remove active editor component
    this.host.detach();
    this.selectDetachHandlerService.detach();

    let cacheBag: CacheBag;

    // Reattach from cache if exist
    if (this.viewsCache.has(component.id)) {
      cacheBag = this.viewsCache.get(component.id);
      this.host.insert(cacheBag.ref);
    } else {
      // Render new instance if not

      const injector     = this.createComponentInjector(component);
      const componentRef = this.host.createComponent(settings,
        { index: 0, injector }
      );

      // Update component instance
      const { instance } = componentRef;

      // Cache view
      const ref: ViewRef = this.host.get(0);
      cacheBag           = { ref, instance, component };
      this.viewsCache.set(component.id, cacheBag);
    }

    return cacheBag;
  }

  /**
   * Create custom injector with two streams
   * So that all children settings components can react to whether they are active or not
   */
  private createComponentInjector(component: PuffComponent): Injector {
    const { activate$, deactivate$ } = this.createActivationStreams(component);
    return Injector.create({
      providers: [
        {
          provide : ACTIVATE$,
          useValue: activate$
        },
        {
          provide : DEACTIVATE$,
          useValue: deactivate$
        }
      ],
      parent   : this.injector
    });
  }

  private createActivationStreams(
    component: PuffComponent
  ): { activate$: Observable<boolean>; deactivate$: Observable<boolean> } {
    const isActive$ = this.context$.pipe(
      map(({ component: activeComponent }) => activeComponent.id),
      map((activeComponentId: string) => activeComponentId === component.id)
    );

    const activate$   = isActive$.pipe(filter(isActive => isActive));
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

    const componentFromStore$: Observable<PuffComponent> = this.activeComponent$;

    const componentAfterStyleUpdate$: Observable<PuffComponent> = cacheBag.instance.updateStyleAtActiveBreakpoint.pipe(
      switchMap(style => this.updateStyleAtActiveBreakpoint(cacheBag, style))
    );

    const componentAfterPropertyUpdate$: Observable<PuffComponent> = cacheBag.instance.updateProperty.pipe(
      map(property => this.updateProperty(cacheBag, property))
    );

    const componentAfterActionsUpdate$: Observable<PuffComponent> = iif(
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
      .subscribe((component: PuffComponent) => this.updateCacheBagWithNewComponent(cacheBag, component));
  }

  private subscribeOnSlotEditorBindingsChanges(cacheBag: CacheBag) {
    this.destroyPropsChange$.next();

    cacheBag.instance.settings = { id: cacheBag.slot.id, name: cacheBag.slot.name };
    cacheBag.instance.featureList = cacheBag.featureList || [];
    cacheBag.instance.selectedBreakpoint = this.selectedBreakpoint;

    const slotFromStore$: Observable<PuffSlot> = this.activeSlot$;

    const componentAfterAddFeature$: Observable<PuffSlot> = cacheBag.instance.addFeature.pipe(
      map(feature => this.addSlotFeature(cacheBag, feature))
    );

    cacheBag.instance.updateFeature.pipe(
      takeUntil(this.destroyPropsChange$),
      tap(feature => this.featureBinding.emit(feature))
    ).subscribe()

    const slotChange$ = merge(
      slotFromStore$,
      componentAfterAddFeature$
    );

    combineLatest([slotChange$, this.selectedBreakpoint$])
      .pipe(
        map(([slot]) => slot),
        filter(c => !!c),
        takeUntil(this.destroyPropsChange$),
        mergeMap((slot: PuffSlot) => {
          return getFeatureListFromSlotId(slot.id);
        }),
        tap((features: PuffFeature[]) => {
          cacheBag.instance.featureList = features || [];
        })
      )
      .subscribe();
  }

  private addSlotFeature(cacheBag: CacheBag, feature: PuffFeature): PuffSlot & { featureList: PuffFeature[] } {
    const updatedFeatures = this.addFeature(cacheBag.slot, cacheBag.featureList, feature);
    this.addFeatureBinding.emit(feature);

    return { ...cacheBag.slot, featureList: [...updatedFeatures.featureList] };
  }

  private updateStyleAtActiveBreakpoint(cacheBag: CacheBag, style: any): Observable<PuffComponent> {
    this.logBindingChange(cacheBag.component, style);
    return this.mergeStylesAtActiveBreakpoint(cacheBag.component, style).pipe(
      tap((update: Partial<PuffComponent>) => this.componentBinding.next(update)),
      map((update: Partial<PuffComponent>) => ({
        ...cacheBag.component,
        styles: { ...update.styles }
      }))
    );
  }

  private updateProperty(cacheBag: CacheBag, property: any): PuffComponent {
    this.logBindingChange(cacheBag.component, property);
    const updatedProperties = this.mergeProperties(cacheBag.component, property);
    this.componentBinding.emit(updatedProperties);

    return { ...cacheBag.component, properties: { ...updatedProperties.properties } };
  }

  private updateActions(cacheBag: CacheBag, actions: any): PuffComponent {
    const { component } = cacheBag;
    this.logActionAssign(component, actions);
    const updatedActions = this.mergeActions(component, actions);
    this.componentBinding.emit(updatedActions);

    return { ...component, actions: { ...component.actions, ...updatedActions.actions } };
  }

  private mergeStylesAtActiveBreakpoint(component: PuffComponent, styles: any): Observable<Partial<PuffComponent>> {
    return this.selectedBreakpoint$.pipe(
      take(1),
      map((breakpoint: Breakpoint): Partial<PuffComponent> => {
        const updatedStyles             = { ...component.styles };
        updatedStyles[breakpoint.width] = {
          ...updatedStyles[breakpoint.width],
          ...styles
        };
        return {
          id    : component.id,
          styles: updatedStyles
        };
      })
    );
  }

  private addFeature(slot: PuffSlot, featureList: PuffFeature[] = [],
                     feature: PuffFeature): Partial<PuffSlot & { featureList: PuffFeature[] }> {
    feature.index = featureList.length;
    return {
      id         : slot.id,
      featureList: [
        // exist slot may not have featureList
        ...featureList,
        feature
      ]
    };
  }

  private mergeProperties(component: PuffComponent, properties: any): Partial<PuffComponent> {
    return {
      id        : component.id,
      properties: {
        ...component.properties,
        ...properties
      }

    };
  }

  private mergeActions(component: PuffComponent, actions: any): Partial<PuffComponent> {
    return {
      id     : component.id,
      actions: {
        ...component.actions,
        ...actions
      }
    };
  }

  private destroyCache() {
    this.viewsCache.forEach(({ ref }: { ref: ViewRef }) => ref.destroy());
  }

  private updateCacheBagWithNewComponent(cacheBag: CacheBag, component: PuffComponent) {
    cacheBag.instance.settings = this.createComponentSettings(component);
    cacheBag.component         = component;
  }

  private logBindingChange(component: PuffComponent, binding) {
    const componentName      = component.definitionId;
    const configName         = Object.keys(binding)[0];
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

  private createComponentSettings(component: PuffComponent): ComponentSettings {
    const { styles, properties, actions } = component;
    const compiledStyles                  = this.stylesCompiler.compileStyles(styles);

    return { styles: compiledStyles, properties, actions, component };
  }

  private logActionAssign(component: PuffComponent, actions: any): void {
    for (const [trigger, triggeredActions] of Object.entries(actions)) {
      for (const triggeredAction of triggeredActions as TriggeredAction[]) {
        if (!triggeredAction.action) {
          continue;
        }

        getWorkflowNameById(triggeredAction.action)
          .pipe(take(1))
          .subscribe((actionName: string) => {
            this.analytics.logActionAssign(triggeredAction.action, component.definitionId, trigger, actionName);
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyPropsChange$.next();
    this.destroyPropsChange$.complete();
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCache();
  }
}
