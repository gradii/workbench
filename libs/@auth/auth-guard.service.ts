import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { TriAuthService } from '@gradii/triangle/auth';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild, CanActivate {
  constructor(private authService: TriAuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.authService.isAuthenticatedOrRefresh().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticatedOrRefresh().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}


export function authGuardFn(data) {
  @Injectable({ providedIn: 'root' })
  class InnerAuthGuard extends AuthGuard {

    canActivate(route: ActivatedRouteSnapshot): boolean | Promise<boolean> | Observable<boolean> {
      return super.canActivate(route);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return super.canActivateChild(childRoute, state);
    }
  }

  return InnerAuthGuard;
}
