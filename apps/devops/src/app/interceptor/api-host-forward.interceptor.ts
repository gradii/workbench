import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_URL_MAP } from '../constant/host.constant';
import { environment } from '../../environments/environment';

/**@10.31.24.225
 * 后台不存在 /api 开头 之类的的接口, 但是代码里需要知道当前访问的地址是哪个服务器
 * 映射如下:
 * - /s1/api => 10.76.2.45:8888
 * 只在生产环境作处理
 */
@Injectable()
export class ApiHostForwardInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (environment.directConnectServer) {
      SERVER_URL_MAP.forEach(it => {
        if (it.match(request.url)) {
          request = request.clone({
            url: it.replace(request.url)
          });
        }
      });
    }

    return next.handle(request);
  }
}
