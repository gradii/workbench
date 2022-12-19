import { Inject, Injectable, OnDestroy } from '@angular/core';
import { RootComponentType } from '@common/public-api';
import { DOCUMENT } from '@angular/common';
import { take, takeUntil } from 'rxjs/operators';
import { RenderState } from '../state/render-state.service';

@Injectable()
export class Kitchen2OverlayContainer implements OnDestroy {
  protected _containerElement: HTMLElement;

  constructor(
    @Inject(DOCUMENT) protected _document: any,
  ) {
  }

  ngOnDestroy() {
    if (this._containerElement && this._containerElement.parentNode) {
      this._containerElement.parentNode.removeChild(this._containerElement);
    }
  }

  getContainerElement(): HTMLElement {
    this._containerElement = this._containerElement || this._createContainer();
    return this._containerElement;
  }

  // private _applyClipPath(element: HTMLElement) {
  //   this.renderState.containerClipPath$.pipe(
  //     take(1)
  //   ).subscribe(clipPath => {
  //     element.style.clipPath = clipPath;
  //   });
  // }

  protected _createContainer(): HTMLElement {
    const container = this._document.createElement('div');

    container.classList.add('cdk-overlay-container', 'render-overlay');

    this._document.body.appendChild(container);

    // this._applyClipPath(container);
    return container;
  }
}

@Injectable()
export class KitchenOverlayContainer implements OnDestroy {
  protected _containerElement: HTMLElement;
  protected _headerContainerElement: HTMLElement;
  protected _sidebarContainerElement: HTMLElement;

  constructor(@Inject(DOCUMENT) protected _document: any) {
  }

  ngOnDestroy() {
    if (this._containerElement && this._containerElement.parentNode) {
      this._containerElement.parentNode.removeChild(this._containerElement);
    }
    if (this._headerContainerElement && this._headerContainerElement.parentNode) {
      this._headerContainerElement.parentNode.removeChild(this._headerContainerElement);
    }
    if (this._sidebarContainerElement && this._sidebarContainerElement.parentNode) {
      this._sidebarContainerElement.parentNode.removeChild(this._sidebarContainerElement);
    }
  }

  getContainerElement(type: RootComponentType): HTMLElement {
    if (type === RootComponentType.Header) {
      this._headerContainerElement = this._headerContainerElement || this._createContainer(type);
      return this._headerContainerElement;
    } else if (type === RootComponentType.Sidebar) {
      this._sidebarContainerElement = this._sidebarContainerElement || this._createContainer(type);
      return this._sidebarContainerElement;
    } else {
      this._containerElement = this._containerElement || this._createContainer(type);
      return this._containerElement;
    }
  }

  protected _createContainer(type: RootComponentType): HTMLElement {
    const container = this._document.createElement('div');

    container.classList.add('dev-ui');
    container.classList.add('cdk-overlay-container');
    if (type === RootComponentType.Header) {
      container.classList.add('header');
    } else if (type === RootComponentType.Sidebar) {
      container.classList.add('sidebar');
    }
    this._document.body.appendChild(container);
    return container;
  }
}
