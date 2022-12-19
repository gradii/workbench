import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { DevUIElementRef } from './dev-ui-ref';
import { DevUIIterableChanges } from './dev-ui-iterable-changes';
import { DevUIStateService } from './dev-ui-state.service';
import { FlourComponent } from '../model';

type CreateDevUIFunction = (virtualComponent: FlourComponent | FlourComponent) => DevUIElementRef;

@Injectable(/*{ providedIn: 'root' }*/)
export class ComponentSpecificDevUI {
  constructor(private devUIStateService: DevUIStateService) {
  }

  create(createDevUI: CreateDevUIFunction): void {
    const attachedDevUIElementRefs = new Map<string, DevUIElementRef>();

    this.devUIStateService.selectedChanges$
      .pipe(
        tap((changes: DevUIIterableChanges) => {
          changes.forEachIdentityChange(({ item }) => {
            const devUIElementRef = attachedDevUIElementRefs.get(item.component.id);

            if (devUIElementRef) {
              devUIElementRef.update();
            }
          });

          changes.forEachAddedItem(({ item }) => {
            const devUIElementRef = createDevUI(item);

            if (devUIElementRef) {
              attachedDevUIElementRefs.set(item.component.id, devUIElementRef);
            }
          });

          changes.forEachRemovedItem(({ item }) => {
            const devUIElementRef: DevUIElementRef = attachedDevUIElementRefs.get(item.component.id);

            if (devUIElementRef) {
              devUIElementRef.dispose();
              attachedDevUIElementRefs.delete(item.component.id);
            }
          });
        })
      )
      .subscribe();
  }
}
