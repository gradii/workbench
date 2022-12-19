import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { defer, fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, mapTo, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { nextId } from '../models/id';

@Injectable({ providedIn: 'root' })
export class SafeCodeService implements OnDestroy {
  private window: Window;
  private document: Document;
  private renderer: Renderer2;
  private destroy$: Subject<void> = new Subject<void>();

  private iframe$: Observable<HTMLIFrameElement> = defer(() => {
    const iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(iframe, 'sandbox', 'allow-scripts allow-modals');
    this.renderer.setAttribute(iframe, 'src', 'data:text/html;charset=utf-8,' + this.getIframeScript());
    this.renderer.appendChild(this.document.body, iframe);

    return fromEvent(this.window, 'message').pipe(
      filter((message: MessageEvent) => message.data.action === 'iframeReady'),
      mapTo(iframe),
      take(1)
    );
  }).pipe(shareReplay(1), takeUntil(this.destroy$));

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.document = document;
    this.window = window;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  executeCode(functionCode: string, functionArguments: any[]): Observable<any> {
    const safeFunctionArguments = functionArguments.map(argument => {
      /**
       * TODO: if we stringify Date object we will get data with GMT 0, and it can be confusing,
       * so we need to catch Date object and return timestamp
       */
      if (argument instanceof Date) {
        return new Date(argument);
      }
      const strValue: string = JSON.stringify(argument);
      return strValue ? JSON.parse(strValue) : strValue;
    });
    const message = this.createMessage(functionCode, safeFunctionArguments);
    return this.iframe$.pipe(
      tap((iframe: HTMLIFrameElement) => iframe.contentWindow.postMessage(message, '*')),
      switchMap(() => this.receiveResult(message.id)),
      takeUntil(this.destroy$)
    );
  }

  private receiveResult(id: string): Observable<any> {
    return fromEvent(this.window, 'message').pipe(
      filter((message: MessageEvent) => message.data.action === 'executeResult' && message.data.id === id),
      map((msg: MessageEvent) => {
        if (msg.data.error) {
          throw msg.data.error;
        }
        return msg.data.result;
      }),
      take(1)
    );
  }

  private createMessage(functionCode: string, functionArguments: any[]) {
    return {
      action: 'execute',
      id    : nextId(),
      functionCode,
      functionArguments
    };
  }

  private getIframeScript(): string {
    return `
<html>
<body>
<script type="text/javascript">
  window.addEventListener('message', function (message) {
    if (message.data.action === 'execute') {
      var error = null;
      var result = null;
      try {
        var f = new Function(message.data.functionCode);
        result = f.apply({}, message.data.functionArguments);
      } catch (e) {
        error = e;
      }
      window.parent.postMessage({action: 'executeResult', id: message.data.id, error, result}, '*')
    }
  }, false);
  window.parent.postMessage({action: 'iframeReady'}, '*');
</script>
</body>
</html>
    `;
  }
}


