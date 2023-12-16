import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild {
  constructor(private authService: NbAuthService, private router: Router) {
  }

  canActivateChild(): Observable<boolean> {
    return this.authService.isAuthenticatedOrRefresh().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}
