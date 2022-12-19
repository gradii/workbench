import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomURLEncoder } from './custom-url-encoder';


export class HttpParamsCodecInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let params = request.params;
    if (params instanceof HttpParams) {
      //@ts-ignore
      params.encoder = new CustomURLEncoder();
    }

    return next.handle(request.clone(
      {
        params: params
      }
    ));
  }
}
