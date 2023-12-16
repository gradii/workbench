import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IframeProviderService {
  private iframe: BehaviorSubject<Window> = new BehaviorSubject(null);
  private iframeWidth: BehaviorSubject<number> = new BehaviorSubject(0);

  getIframeWindow(): Observable<Window> {
    return this.iframe.asObservable().pipe(filter(iframe => !!iframe));
  }

  setIframeWindow(window: Window): void {
    this.iframe.next(window);
  }

  getIframeWidth(): Observable<number> {
    return this.iframeWidth.asObservable();
  }

  setIframeWidth(iframeWidth: number): void {
    this.iframeWidth.next(iframeWidth);
  }
}
