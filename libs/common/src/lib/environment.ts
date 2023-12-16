import { InjectionToken } from '@angular/core';

export const ENVIRONMENT = new InjectionToken<string>('Environment');

export interface Environment {
  name: 'dev';
  production: false;
  formBuilder: false;
}
