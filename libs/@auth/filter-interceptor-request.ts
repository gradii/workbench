import { HttpRequest } from '@angular/common/http';

import { environment } from '@environments/environment';

export function filterInterceptorRequest(req: HttpRequest<any>) {
  return req.url.startsWith(`${environment.apiUrl}/auth/`);
}
