import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SafeCodeService } from '@common/public-api';

@Injectable()
export class JsonValidator implements AsyncValidator {
  constructor(private safeCodeService: SafeCodeService) {
  }

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.executeEvalConverter(ctrl.value).pipe(
      map(result => (typeof result === 'object' ? null : { invalid: true })),
      catchError(() => of({ invalid: true }))
    );
  }

  validateArray(ctrl: AbstractControl): ValidationErrors | null {
    return this.executeEvalConverter(ctrl.value).pipe(
      map(result => (Array.isArray(result) ? null : { invalid: true })),
      catchError(() => of({ invalid: true }))
    );
  }

  executeEvalConverter(value: string): Observable<any> {
    return this.safeCodeService.executeCode(`return eval((${value}));`, []);
  }
}
