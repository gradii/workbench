import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NbAuthIllegalTokenError,
  NbAuthOAuth2Token,
  NbAuthResult,
  NbAuthStrategyClass,
  NbAuthToken,
  NbPasswordAuthStrategy,
  NbPasswordAuthStrategyOptions
} from '@nebular/auth';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { JWTResponseToken, UserProviderToken } from './user.model';
import { TemporaryProjectService } from './temporary-project.service';

@Injectable({ providedIn: 'root' })
export class UbAuthStrategy extends NbPasswordAuthStrategy {
  private errorHandler: ErrorHandler;

  constructor(
    private injector: Injector,
    http: HttpClient,
    route: ActivatedRoute,
    private temporaryProjectService: TemporaryProjectService
  ) {
    super(http, route);
  }

  static setup(options: NbPasswordAuthStrategyOptions): [NbAuthStrategyClass, NbPasswordAuthStrategyOptions] {
    return [UbAuthStrategy, options];
  }

  createToken<T extends NbAuthToken>(value: any, failWhenInvalidToken?: boolean): T {
    try {
      return super.createToken(value, failWhenInvalidToken);
    } catch (err) {
      if (err instanceof NbAuthIllegalTokenError) {
        if (!this.errorHandler) {
          this.errorHandler = this.injector.get(ErrorHandler);
        }
        this.errorHandler.handleError({ err, value });
      }
      throw err;
    }
  }

  authenticate(data: any): Observable<NbAuthResult> {
    // If we call authenticate not with `google` (`email`) strategy name,
    // call `authenticate(data?)` of `NbPasswordAuthStrategy`.
    // Otherwise call `completeAuth(data: UserProviderRequest)` to auth with google provider.
    if (!isGoogleToken(data)) {
      return super.authenticate(data);
    }

    return this.completeAuth(data);
  }

  protected handleResponseError(
    res: HttpErrorResponse | NbAuthIllegalTokenError,
    module: string
  ): Observable<NbAuthResult> {
    const error: string = this.parseError(res);
    const result: NbAuthResult = this.createAuthResult(res, error, module);
    return of(result);
  }

  private parseError(res: HttpErrorResponse | NbAuthIllegalTokenError): string {
    if (res instanceof HttpErrorResponse && [400, 403, 409].includes(res.status)) {
      return res.error;
    }

    if (res instanceof NbAuthIllegalTokenError) {
      return res.message;
    }

    return 'Something went wrong';
  }

  private createAuthResult(
    res: HttpErrorResponse | NbAuthIllegalTokenError,
    error: string,
    module: string
  ): NbAuthResult {
    return new NbAuthResult(false, res, this.getOption(`${module}.redirect.failure`), [error]);
  }

  private completeAuth(
    data: (NbAuthOAuth2Token | UserProviderToken) & { temporaryProjectToken?: string; templateViewIdToOpen?: string }
  ) {
    const temporaryProjectToken: string = this.temporaryProjectService.getTemporaryProjectToken();
    if (temporaryProjectToken) {
      data.temporaryProjectToken = temporaryProjectToken;
    }
    const templateViewIdToOpen: string = this.temporaryProjectService.getTemplateViewIdToOpen();
    if (templateViewIdToOpen) {
      data.templateViewIdToOpen = templateViewIdToOpen;
    }
    return this.http.post(`${environment.apiUrl}/auth/google`, data).pipe(
      switchMap((item: JWTResponseToken) => {
        let redirectPath = this.getOption('redirect.success');

        this.temporaryProjectService.setViewIdToOpen(item);
        if (item.viewId) {
          redirectPath = `/tools/${item.viewId}/builder`;
        }

        const result = new NbAuthResult(
          true,
          item,
          redirectPath,
          [],
          this.getOption('defaultMessages'),
          this.createToken(item.token, false)
        );

        return of(result);
      }),
      tap(() => {
        this.temporaryProjectService.dropTemporaryToken();
        this.temporaryProjectService.dropTemplateViewIdToOpen();
      })
    );
  }
}

// Check if there is a google token object
export function isGoogleToken(token: any): boolean {
  return token['ownerStrategyName'] === 'google';
}
