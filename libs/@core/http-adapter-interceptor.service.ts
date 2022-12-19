import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TriNotificationService } from '@gradii/triangle/message';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';


@Injectable()
export class HttpAdapterInterceptorService {
  constructor(
    private notificationService: TriNotificationService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
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

      })
    );
  }
}
