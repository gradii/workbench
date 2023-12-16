import { Injectable } from '@angular/core';
import { UserProperties, logEvent, setEnvironment, setUserId } from './api';

export abstract class AnalyticsHandler {
  abstract log(type: string, params: any): void;

  abstract setEnvironment(env: string): void;

  abstract setUserId(params: UserProperties): void;
}

@Injectable()
export class DevAnalyticsHandler extends AnalyticsHandler {
  log(type: string, params: any = {}): void {
    this.logToConsole('Log', { type, params });
  }

  setEnvironment(env: string) {
    this.logToConsole('Environment', { env });
  }

  setUserId(params: UserProperties = {}): void {
    this.logToConsole('User Id', params);
  }

  private logToConsole(msg: string, params: any = {}): void {
    console.info(`[ANALYTICS] ${msg}`, params);
  }
}

@Injectable()
export class ProdAnalyticsHandler extends AnalyticsHandler {
  log(type: string, params: any = {}): void {
    logEvent(type, params);
  }

  setEnvironment(env: string) {
    setEnvironment(env);
  }

  setUserId(params: UserProperties = {}): void {
    setUserId(params);
  }
}
