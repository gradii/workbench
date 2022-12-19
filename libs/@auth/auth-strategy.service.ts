import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TriAuthIllegalTokenError, TriAuthResult, TriAuthStrategyClass, TriAuthToken, TriPasswordAuthStrategy,
  TriPasswordAuthStrategyOptions
} from '@gradii/triangle/auth';
import { Observable, of } from 'rxjs';
import { TemporaryProjectService } from './temporary-project.service';

@Injectable({ providedIn: 'root' })
export class UbAuthStrategy extends TriPasswordAuthStrategy {
  private errorHandler: ErrorHandler;

  constructor(
    private injector: Injector,
    http: HttpClient,
    route: ActivatedRoute,
    private temporaryProjectService: TemporaryProjectService
  ) {
    super(http, route);
  }

  static setup(options: TriPasswordAuthStrategyOptions): [TriAuthStrategyClass, TriPasswordAuthStrategyOptions] {
    return [UbAuthStrategy, options];
  }

  createToken<T extends TriAuthToken>(value: any, failWhenInvalidToken?: boolean): T {
    try {
      return super.createToken(value, failWhenInvalidToken);
    } catch (err) {
      if (err instanceof TriAuthIllegalTokenError) {
        if (!this.errorHandler) {
          this.errorHandler = this.injector.get(ErrorHandler);
        }
        this.errorHandler.handleError({ err, value });
      }
      throw err;
    }
  }

  authenticate(data: any): Observable<TriAuthResult> {
    // If we call authenticate not with `google` (`email`) strategy name,
    // call `authenticate(data?)` of `NbPasswordAuthStrategy`.
    // Otherwise call `completeAuth(data: UserProviderRequest)` to auth with google provider.
    // if (!isGoogleToken(data)) {
    return super.authenticate(data);
    // }

    // return this.completeAuth(data);
  }

  protected handleResponseError(
    res: HttpErrorResponse | TriAuthIllegalTokenError,
    module: string
  ): Observable<TriAuthResult> {
    const error: string         = this.parseError(res);
    const result: TriAuthResult = this.createAuthResult(res, error, module);
    return of(result);
  }

  private parseError(res: HttpErrorResponse | TriAuthIllegalTokenError): string {
    if (res instanceof HttpErrorResponse && [400, 403, 409].includes(res.status)) {
      return res.error;
    }

    if (res instanceof TriAuthIllegalTokenError) {
      return res.message;
    }

    return 'Something went wrong';
  }

  private createAuthResult(
    res: HttpErrorResponse | TriAuthIllegalTokenError,
    error: string,
    module: string
  ): TriAuthResult {
    return new TriAuthResult(false, res, this.getOption(`${module}.redirect.failure`), [error]);
  }

  // private completeAuth(
  //   data: (TriAuthOAuth2Token | UserProviderToken) & { temporaryProjectToken?: string; templateViewIdToOpen?: string }
  // ) {
  //   const temporaryProjectToken: string = this.temporaryProjectService.getTemporaryProjectToken();
  //   if (temporaryProjectToken) {
  //     data.temporaryProjectToken = temporaryProjectToken;
  //   }
  //   const templateViewIdToOpen: string = this.temporaryProjectService.getTemplateViewIdToOpen();
  //   if (templateViewIdToOpen) {
  //     data.templateViewIdToOpen = templateViewIdToOpen;
  //   }
  //   return this.http.post(`${environment.apiUrl}/auth/google`, data).pipe(
  //     switchMap((item: JWTResponseToken) => {
  //       let redirectPath = this.getOption('redirect.success');
  //
  //       this.temporaryProjectService.setViewIdToOpen(item);
  //       if (item.viewId) {
  //         redirectPath = `/tools/${item.viewId}/builder`;
  //       }
  //
  //       const result = new TriAuthResult(
  //         true,
  //         item,
  //         redirectPath,
  //         [],
  //         this.getOption('defaultMessages'),
  //         this.createToken(item.token, false)
  //       );
  //
  //       return of(result);
  //     }),
  //     tap(() => {
  //       this.temporaryProjectService.dropTemporaryToken();
  //       this.temporaryProjectService.dropTemplateViewIdToOpen();
  //     })
  //   );
  // }
}

// Check if there is a google token object
export function isGoogleToken(token: any): boolean {
  return token['ownerStrategyName'] === 'google';
}
