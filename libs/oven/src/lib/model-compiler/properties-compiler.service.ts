import { Injectable } from '@angular/core';
import {
  DataField,
  dataFields,
  extendDeepValue,
  getDeepValue,
  InterpolationType,
  OvenActions,
  OvenComponent,
  OvenStyles,
  Scope
} from '@common';

import { DataValidator } from '../workflow/data/data-validator.service';
import { InterpolateService } from '../workflow/util/interpolate.service';

@Injectable({ providedIn: 'root' })
export class PropertiesCompilerService {
  constructor(private dataValidator: DataValidator, private interpolateService: InterpolateService) {
  }

  compileProperties(
    component: OvenComponent,
    scope: Scope,
    preview: boolean
  ): {
    styles: OvenStyles;
    properties: any;
    actions: OvenActions;
  } {
    let newProperties = { ...component.properties };
    let newStyles = { ...component.styles };
    const actions = this.processActions(component, scope);
    if (dataFields[component.definitionId]) {
      for (const dataField of dataFields[component.definitionId]) {
        if (dataField.propName) {
          const updatedProperty = this.getUpdatedProperty(component, scope, dataField, preview);
          newProperties = extendDeepValue(newProperties, dataField.propName, updatedProperty);
        } else {
          const updatedStyles = this.getUpdatedStyle(component, newStyles, scope, dataField, preview);
          newStyles = { ...newStyles, ...updatedStyles };
        }
      }
    }
    return { styles: newStyles, properties: newProperties, actions };
  }

  private getUpdatedProperty(component: OvenComponent, scope: Scope, dataField: DataField, preview: boolean): any {
    const fieldValue = getDeepValue(component.properties, dataField.propName);
    return this.resolveValue(component, fieldValue, scope, dataField, preview);
  }

  private getUpdatedStyle(
    component: OvenComponent,
    styles: OvenStyles,
    scope: Scope,
    dataFiled: DataField,
    preview: boolean
  ) {
    let newStyles = { ...styles };
    for (const breakpoint of Object.keys(styles)) {
      const styleAtBreakPoint = getDeepValue(styles[breakpoint], dataFiled.styleName);
      if (this.interpolateService.containInterpolation(styleAtBreakPoint)) {
        const newStyleValue = this.resolveValue(component, styleAtBreakPoint, scope, dataFiled, preview);
        newStyles = extendDeepValue(newStyles, breakpoint + '.' + dataFiled.styleName, newStyleValue);
      }
    }
    return newStyles;
  }

  private processActions(component: OvenComponent, scope: Scope): OvenActions {
    let actions = component.actions;
    if (actions) {
      actions = { ...actions };
      for (const [trigger, triggeredActions] of Object.entries(actions)) {
        if (!triggeredActions.length || !triggeredActions[0]?.paramCode) {
          continue;
        }

        const paramCode: string = triggeredActions[0].paramCode;
        const compiledValue = this.interpolateService.interpolateSafe(paramCode, scope, InterpolationType.CODE);

        actions[trigger] = [
          {
            action: triggeredActions[0].action,
            paramCode: compiledValue
          }
        ];
      }
    }
    return actions;
  }

  protected resolveValue(
    component: OvenComponent,
    fieldValue: string,
    scope: Scope,
    dataField: DataField,
    preview: boolean
  ): any {
    const hasInterpolation = this.interpolateService.containInterpolation(fieldValue);

    if (this.shouldInterpolate(hasInterpolation, preview, dataField)) {
      return fieldValue;
    }

    const value = this.interpolateService.interpolateSafe(fieldValue, scope, dataField.type);
    const error = this.dataValidator.validate(component, value);
    return error ? null : value;
  }

  private shouldInterpolate(hasInterpolation: boolean, preview: boolean, dataField: DataField): boolean {
    return (
      (!preview && dataField.keepInterpolation) || (!hasInterpolation && dataField.type === InterpolationType.STRING)
    );
  }
}
