import {
  ComponentRef, Directive, EventEmitter, Injector, Input, Output, SimpleChanges, ViewContainerRef
} from '@angular/core';
import { Breakpoint } from '@core/breakpoint/breakpoint';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PuffFeature } from '../../@tools-state/feature/feature.model';
import { SpaceFeatureEditorComponent } from './features/space-feature-editor.component';

@Directive({
  selector: '[pfFeatureEditor]'
})
export class FeatureEditorDirective {

  destroy$ = new Subject();

  @Input()
  selectedBreakpoint: Breakpoint;

  private _settings;
  private renderedComponentRef: ComponentRef<SpaceFeatureEditorComponent>;

  @Input()
  get settings() {
    return this._settings;
  }

  set settings(value: PuffFeature) {
    this._settings = value;
    this.renderEditor();
  }

  @Output()
  updateBinding = new EventEmitter();

  constructor(private viewContainerRef: ViewContainerRef,
              private injector: Injector) {
  }

  ngOnInit() {

  }

  getComponent() {
    return SpaceFeatureEditorComponent;
  }

  renderEditor() {
    if (this.renderedComponentRef) {
      // this.bindOnComponentRef();
      const componentRef = this.renderedComponentRef;

      componentRef.instance.settings = {
        styles    : this.settings.styles[this.selectedBreakpoint.width],
        properties: this.settings.properties
      };

      return;
    }

    this.viewContainerRef.clear();

    const { definitionId } = this._settings;

    if (definitionId === 'space-feature') {
      const componentRef = this.viewContainerRef.createComponent(
        this.getComponent(),
        {
          index   : 0,
          injector: this.injector
        }
      );

      // console.log(componentRef.componentType['ɵfac']);
      // console.log(componentRef.componentType['ɵdir']);

      this.renderedComponentRef = componentRef;
    }

    this.bindOnComponentRef()
  }

  bindOnComponentRef() {
    const componentRef = this.renderedComponentRef;

    componentRef.instance.settings = {
      styles    : this.settings.styles[this.selectedBreakpoint.width],
      properties: this.settings.properties
    };

    componentRef.instance.updateProperty.pipe(
      takeUntil(this.destroy$),
      tap((property) => {
        this.updateBinding.emit({
          id        : this.settings.id,
          properties: property
        });
      })
    ).subscribe();

    componentRef.instance.updateStyleAtActiveBreakpoint.pipe(
      takeUntil(this.destroy$),
      tap((styles) => {
        this.updateBinding.emit({
          id    : this.settings.id,
          styles: {
            [this.selectedBreakpoint.width]: {
              ...this.settings.styles[this.selectedBreakpoint.width],
              ...styles
            }
          }
        });
      })
    ).subscribe();

    componentRef.instance.updateActions.pipe(
      takeUntil(this.destroy$),
      tap((actions) => {
        this.updateBinding.emit({
          id     : this.settings.id,
          actions: {
            ...this.settings.actions,
            ...actions
          }
        });
      })
    ).subscribe();
  }

  updateProperty(property) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['settings']) {
      this.renderedComponentRef.instance.settings = {
        styles    : this.settings.styles[this.selectedBreakpoint.width],
        properties: this.settings.properties
      };
    }
    if (changes['selectedBreakpoint']) {
      this.renderedComponentRef.instance.selectedBreakpoint = this.selectedBreakpoint;
    }
  }

}