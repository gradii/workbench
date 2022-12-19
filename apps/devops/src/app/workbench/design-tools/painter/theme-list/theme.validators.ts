import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Theme } from '@common';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ThemeFacade } from '@tools-state/theme/theme-facade.service';

@Injectable()
export class UniqueThemeNameValidator implements AsyncValidator {
  constructor(private themeFacade: ThemeFacade) {
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.themeFacade.themeList$.pipe(
      take(1),
      map((themes: Theme[]) => (themes.some((t: Theme) => t.name === ctrl.value) ? { unique: true } : null))
    );
  }
}
