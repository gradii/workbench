import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { camelize } from '@angular-devkit/core/src/utils/strings';

import { Page } from '@tools-state/page/page.model';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { BakeryComponent } from '@tools-state/component/component.model';

abstract class UniquePageValidator implements AsyncValidator {
  private ignoreActive = false;

  protected constructor(private pageFacade: PageFacade, private propName: string) {
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    const value = this.propName === 'name' ? camelize(ctrl.value) : ctrl.value;
    return this.checkPage(value);
  }

  setIgnoreActive(active: boolean) {
    this.ignoreActive = active;
  }

  private checkPage(propValue: string): Observable<ValidationErrors | null> {
    return combineLatest([this.pageFacade.pageList$, this.pageFacade.activePage$]).pipe(
      map(([pageList, activePage]: [Page[], Page]) => {
        return this.isPageUnique(pageList, activePage, propValue) ? { unique: true } : null;
      }),
      take(1)
    );
  }

  private isPageUnique(pageList, activePage, propValue): boolean {
    return pageList.some(page => {
      if (this.ignoreActive && page.id === activePage.id) {
        return false;
      }
      const value = this.propName === 'name' ? camelize(page[this.propName]) : page[this.propName];
      return value === propValue;
    });
  }
}

@Injectable()
export class UniquePageNameValidator extends UniquePageValidator {
  constructor(pageFacade: PageFacade, private componentFacade: ComponentFacade) {
    super(pageFacade, 'name');
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return combineLatest([super.validate(ctrl), this.validateUniqueComponent(ctrl)]).pipe(
      map(([invalidByPage, invalidByContainer]) => invalidByPage || invalidByContainer)
    );
  }

  private validateUniqueComponent(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.componentFacade.componentList$.pipe(
      take(1),
      map((components: BakeryComponent[]) => {
        const duplicated: boolean = components.some(
          (component: BakeryComponent) => component.properties.name === ctrl.value
        );
        return duplicated ? { unique: true } : null;
      })
    );
  }
}

@Injectable()
export class UniquePageUrlValidator extends UniquePageValidator {
  constructor(pageFacade: PageFacade) {
    super(pageFacade, 'url');
  }
}
