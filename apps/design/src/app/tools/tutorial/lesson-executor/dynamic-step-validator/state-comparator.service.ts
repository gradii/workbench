import { Injectable } from '@angular/core';
import { OvenApp, OvenBreakpointStyles, OvenComponent, OvenSlot } from '@common';

import { Step } from '@tools-state/tutorial-brief/tutorial-brief.model';

@Injectable()
export class StateComparator {
  isEqual(app: OvenApp, step: Step): boolean {
    const sample: OvenComponent = step.validity;
    const component: OvenComponent = app.pageList[0].slots.content.componentList[0];
    return this.findSimilarity(sample, component);
  }

  private findSimilarity(sample: OvenComponent, component: OvenComponent): boolean {
    const similar: boolean = this.similarComponents(sample, component);

    if (similar) {
      return true;
    }

    for (const [_, slot] of Object.entries(component.slots)) {
      for (const child of slot.componentList) {
        const similarChildren: boolean = this.findSimilarity(sample, child);

        if (similarChildren) {
          return true;
        }
      }
    }

    return false;
  }

  private similarComponents(sample: OvenComponent, component: OvenComponent): boolean {
    const similar: boolean =
      sample.definitionId === component.definitionId &&
      this.similarStyles(sample, component) &&
      this.similarProperties(sample, component);

    if (!similar) {
      return false;
    }

    if (!sample.slots) {
      return true;
    }

    for (const [sampleSlotId, sampleSlot] of Object.entries(sample.slots)) {
      const slot: OvenSlot = component.slots[sampleSlotId];

      for (let i = 0; i < sampleSlot.componentList.length; i++) {
        const sampleChild: OvenComponent = sampleSlot.componentList[i];
        const child: OvenComponent = slot && slot.componentList[i];

        if (!child) {
          return false;
        }

        const similarChildren: boolean = this.similarComponents(sampleChild, child);

        if (!similarChildren) {
          return false;
        }
      }
    }

    return true;
  }

  private similarStyles(sample: OvenComponent, component: OvenComponent): boolean {
    // If no styles in the sample then component is similar to sample
    if (!sample.styles || !sample.styles.xl) {
      return true;
    }

    const sampleStyles: OvenBreakpointStyles = sample.styles.xl;
    const componentStyles: OvenBreakpointStyles = component.styles.xl;

    for (const [key, val] of Object.entries(sampleStyles)) {
      if (!this.deepSimilar(val, componentStyles[key])) {
        return false;
      }
    }

    return true;
  }

  private similarProperties(sample: OvenComponent, component: OvenComponent): boolean {
    // If no properties in the sample then component is similar to sample
    if (!sample.properties) {
      return true;
    }

    const sampleProperties = sample.properties;
    const componentProperties = component.properties;

    for (const [key, val] of Object.entries(sampleProperties)) {
      if (!this.deepSimilar(val, componentProperties[key])) {
        return false;
      }
    }

    return true;
  }

  private deepSimilar(sample: any, verifiable: any): boolean {
    if (typeof sample !== typeof verifiable) {
      return false;
    }

    // compare as objects
    if (sample instanceof Object && verifiable instanceof Object) {
      for (const [key, val] of Object.entries(sample)) {
        const result = this.deepSimilar(val, verifiable[key]);
        if (!result) {
          return false;
        }
      }

      return true;

      // compare as strings
    } else if (typeof sample === 'string' && typeof verifiable === 'string') {
      const stringEquals = sample.toLowerCase() === verifiable.toLowerCase();

      if (stringEquals) {
        return true;
      }

      return new RegExp(sample).test(verifiable);

      // compare as any other types of primitives
    } else {
      return sample === verifiable;
    }

    return JSON.stringify(sample) === JSON.stringify(verifiable);
  }
}
