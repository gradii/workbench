import { HttpRequest } from '@angular/common/http';

import { environment } from '@environments';

export function filterInterceptorRequest(req: HttpRequest<any>) {
  if(req.url.startsWith(`${environment.apiUrl}/auth/reset-password`)) {
    return false;
  }
  if(req.url.startsWith(`${environment.apiUrl}/auth/register`)) {
    return false;
  }
  return req.url.startsWith(`${environment.apiUrl}/auth/`);
}
