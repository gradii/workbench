import { OvenApp } from '@common';
import { Injectable } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';

import { OvenState } from '../state/oven-state.service';

/**
 * Custom html code is added into the end of <head> tag.
 * */
@Injectable({ providedIn: 'root' })
export class CustomCodeService {
  private code$ = this.ovenState.app$.pipe(map((app: OvenApp) => app.code));

  private showDevUI$ = this.ovenState.showDevUI$;

  private customCodeNodes: Node[];

  private disposed$ = new Subject<boolean>();

  constructor(private ovenState: OvenState) {
  }

  attach() {
    combineLatest([this.code$, this.showDevUI$])
      .pipe(takeUntil(this.disposed$))
      .subscribe(([code, showDevUI]) => {
        this.removeCustomCode();

        if (showDevUI || !code) {
          return;
        }

        this.insertCustomCode(code);
      });
  }

  detach() {
    this.removeCustomCode();
    this.disposed$.next();
  }

  private insertCustomCode(code: string) {
    const codeNodes = this.parseCode(code);

    this.customCodeNodes = this.convertScriptNodes(codeNodes);

    for (const node of this.customCodeNodes) {
      document.head.appendChild(node);
    }
  }

  private removeCustomCode() {
    if (!this.customCodeNodes?.length) {
      return;
    }

    for (const node of this.customCodeNodes) {
      document.head.removeChild(node);
    }
    this.customCodeNodes = null;
  }

  private parseCode(code: string = ''): Node[] {
    const template = document.createElement('template');
    template.innerHTML = code;
    const templateNode = template.content.cloneNode(true);
    return Array.prototype.slice.call(templateNode.childNodes);
  }

  private convertScriptNodes(nodes: Node[]) {
    const resultNodes = [];

    for (const node of nodes) {
      if (node.nodeName === 'SCRIPT') {
        const scriptNode = node as HTMLScriptElement;
        const newScriptNode: HTMLScriptElement = document.createElement('script');

        if (scriptNode.type) {
          newScriptNode.type = scriptNode.type;
        }

        if (scriptNode.src) {
          newScriptNode.src = scriptNode.src;
        }

        if (scriptNode.text) {
          newScriptNode.text = scriptNode.text;
        }

        resultNodes.push(newScriptNode);
      } else {
        resultNodes.push(node);
      }
    }

    return resultNodes;
  }
}
