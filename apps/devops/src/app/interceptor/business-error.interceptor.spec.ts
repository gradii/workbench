import { TestBed } from '@angular/core/testing';

import { BusinessErrorInterceptor } from './business-error.interceptor';

describe('BusinessErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BusinessErrorInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: BusinessErrorInterceptor = TestBed.inject(BusinessErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
