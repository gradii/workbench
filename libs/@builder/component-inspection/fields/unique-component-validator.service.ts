import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { PuffComponent } from '@tools-state/component/component.model';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { Page } from '@tools-state/page/page.model';

@Injectable()
export class UniqueComponentNameValidator implements AsyncValidator {
  private ignoreComponentId: string;

  constructor(private componentFacade: ComponentFacade) {
  }

  setIgnoreComponentId(id: string) {
    this.ignoreComponentId = id;
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.componentFacade.componentList$.pipe(
      take(1),
      map((componentList: PuffComponent[]) => {
        const duplicated: boolean = componentList.some((c: PuffComponent) => {
          return c.id !== this.ignoreComponentId && c.properties.name && c.properties.name === ctrl.value;
        });
        return duplicated ? { unique: true } : null;
      })
    );
  }
}

@Injectable()
export class AngularComponentValidator implements AsyncValidator {
  private readonly isAngularComponent = new BehaviorSubject<boolean>(false);

  setIsAngularComponent(status: boolean): void {
    this.isAngularComponent.next(status);
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.isAngularComponent.pipe(
      take(1),
      map(status => (!control.value && status ? { required: true } : null))
    );
  }
}

@Injectable()
export class UniquePageNameValidator implements AsyncValidator {
  constructor(private pageFacade: PageFacade) {
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.pageFacade.pageList$.pipe(
      take(1),
      map((pages: Page[]) => {
        const duplicated: boolean = pages.some((page: Page) => page.name.toLowerCase() === ctrl.value.toLowerCase());
        return duplicated ? { unique: true } : null;
      })
    );
  }
}
