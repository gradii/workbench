import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserFacade } from '@auth/user-facade.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userFacade: UserFacade, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.userFacade.admin$.pipe(
      tap((admin: boolean) => {
        if (!admin) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
}
