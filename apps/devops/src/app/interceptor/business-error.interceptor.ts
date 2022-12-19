import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';
import { TriMessageService } from '@gradii/triangle/message';
import { TriNotificationService } from '@gradii/triangle/notification';
import { Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

@Injectable()
export class BusinessErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: TriNotificationService,
    private messageService: TriMessageService,
    private dialogService: TriDialogService
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      filter(res => res instanceof HttpResponse),
      map((res: HttpResponse<any>) => {

        if ((res.body as any).success === false) {

          throw res;
        } else if ((res.body as any).success === true && Reflect.has(res.body as any, 'data')) {
          if (res.body.message) {
            this.notificationService.info(res.body.message, 'success');
          }


          return res.clone({
            body: (res.body as any).data
          });
        }
        return res;

      }),
      catchError((err) => {
        if (err instanceof HttpResponse) {
          this.messageService.error(err.body.message);
          // const results = this.dialogService.open({
          //   title     : err.body.message,
          //   width     : '600px',
          //   content   : ShowRequestModalComponent,
          //   dialogtype: 'failed',
          //   data      : {
          //     requestId: err.headers.get('x-request-id'),
          //     content  : {
          //       errorCode  : err.body.errorCode,
          //       description: err.body.description
          //     }
          //   },
          //   buttons   : [
          //     {
          //       cssClass: 'primary',
          //       text    : '确定',
          //       handler : ($event: Event) => {
          //         results.modalInstance.hide();
          //       }
          //     }
          //   ]
          // });

          // this.toastrService.danger(`${err.message}`, `${err.message}`, {
          //   duration: 13000
          // });
        } else if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            this.notificationService.error('auth failed', err.error.message);
            // const results = this.dialogService.open({
            //   title     : err.error.message,
            //   width     : '600px',
            //   content   : ShowRequestModalComponent,
            //   dialogtype: 'failed',
            //   data      : {
            //     requestId: err.headers.get('x-request-id'),
            //     content  : {
            //       errorCode: err.error.statusCode || err.status,
            //       requestId: err.headers.get('x-request-id')
            //     }
            //   },
            //   buttons   : [
            //     {
            //       cssClass: 'primary',
            //       text    : '确定',
            //       handler : ($event: Event) => {
            //         results.modalInstance.hide();
            //       }
            //     }
            //   ]
            // });
          }
        }

        throw err;
      })
    );
  }
}
