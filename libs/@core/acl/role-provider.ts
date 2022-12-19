import { Injectable } from '@angular/core';
import { TriRoleProvider } from '@gradii/triangle/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

import { PrivilegesEvaluator } from './privileges-evaluator.service';

@Injectable()
export class RoleProvider extends TriRoleProvider {
  private role$ = new BehaviorSubject<string[]>([]);

  constructor(private evaluator: PrivilegesEvaluator) {
    super();
    this.init();
  }

  getRole(): Observable<string[]> {
    return this.role$.asObservable();
  }

  private init(): void {
    this.evaluator.privileges$
      .pipe(
        startWith([]),
        distinctUntilChanged((p1, p2) => JSON.stringify(p1) === JSON.stringify(p2))
      )
      .subscribe((privileges: string[]) => {
        this.role$.next(privileges);
      });
  }
}
