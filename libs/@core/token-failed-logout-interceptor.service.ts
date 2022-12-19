import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { TriTokenService } from '@gradii/triangle/auth';
import { Router } from '@angular/router';

@Injectable()
export class TokenFailedLogoutInterceptor implements HttpInterceptor {
  constructor(private tokenService: TriTokenService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigateByUrl('/auth/login');
          return this.tokenService.clear().pipe(mergeMap(() => throwError(error)));
        }

        return throwError(error);
      })
    );
  }
}
