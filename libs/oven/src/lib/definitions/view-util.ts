import { map } from 'rxjs/operators';
import { ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';

import { VirtualComponent } from '../model';

// Some component can change its entire representation and add/remove its element.
// That's why they're stream their element changes.
// And here we have the function which provide the ability to make element access interface uniform.
export function resolveHTMLElement(virtualComponent: VirtualComponent): Observable<HTMLElement> {
  // Just stream if that element supports element streaming
  if (virtualComponent.view.elementChange$) {
    return virtualComponent.view.elementChange$.pipe(map((el: ElementRef) => el.nativeElement));
  }

  // Resolve static element as a stream
  return of(virtualComponent.view.element.nativeElement);
}
