import { TestBed } from '@angular/core/testing';

import { ApiHostForwardInterceptor } from './api-host-forward.interceptor';

describe('ApiHostForwardInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiHostForwardInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: ApiHostForwardInterceptor = TestBed.inject(ApiHostForwardInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
