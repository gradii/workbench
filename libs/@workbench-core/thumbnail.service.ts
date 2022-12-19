import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { MessageAction } from '@common/public-api';
import html2canvas from 'html2canvas';
import { from, Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';

import { CommunicationService } from './communication/communication.service';
import { Browser } from 'leaflet';
import svg = Browser.svg;

const thumbWidth = 368;
const thumbHeight = 238;

@Injectable({ providedIn: 'root' })
export class ThumbnailService {
  private attached: boolean;

  private destroyed$ = new Subject<void>();

  constructor(
    private communicationService: CommunicationService,
    @Inject(DOCUMENT) private document
  ) {}

  attach() {
    if (this.attached) {
      return;
    }
    this.attached = true;
    this.communicationService.makeThumbnail$
      .pipe(
        takeUntil(this.destroyed$),
        mergeMap(() => this.makeThumbnail())
      )
      .subscribe((image: string) =>
        this.communicationService.sendMessageWithPayload(
          MessageAction.MAKE_THUMBNAIL_RESPONSE,
          image
        )
      );
  }

  makeThumbnail(): Observable<string> {
    const el: HTMLElement = this.document.querySelector('.layout');
    return from(
      html2canvas(el, {
        ignoreElements: (element) => {
          // we need skip iframe 'cose html2canvas throws error when it try to parse iframe
          // and this error can't be handeled
          return element.nodeName.toLocaleLowerCase() === 'iframe';
        },
        onclone: (document) => {
          // remove dev-ui border of space
          const spaceList: NodeListOf<HTMLElement> =
            document.querySelectorAll('div.space');
          spaceList.forEach((space) => {
            space.style.border = 'none';
          });
          // do not render broken svg
          const svgList: NodeListOf<SVGElementTagNameMap['svg']> =
            document.querySelectorAll('svg');
          svgList.forEach((svgElement) => {
            svgElement.style.visibility = 'hidden';
          });
        },
        ...this.calculateThumbSize(el),
        logging: false,
      })
    ).pipe(
      map((canvas: HTMLCanvasElement) => canvas.toDataURL('image/jpeg', 0.8))
    );
  }

  detach() {
    if (!this.attached) {
      return;
    }
    this.attached = false;
    this.destroyed$.next();
  }

  private calculateThumbSize(el: HTMLElement): {
    width: number;
    height: number;
  } {
    let width: number = el.offsetWidth;
    let height: number = el.offsetHeight;
    const whRation = thumbWidth / thumbHeight;
    if (height >= width / whRation) {
      height = width / whRation;
    } else {
      width = height * whRation;
    }
    return { width, height };
  }
}
