import { Inject, Injectable } from '@angular/core';
import {
  BreakpointWidth,
  combineWith,
  FileUtilService,
  ImageConverter,
  KeyboardService,
  OvenComponent,
  PasteComponent,
  RootComponentType
} from '@common';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NB_DOCUMENT } from '@nebular/theme';

import {
  imageFactory,
  inHeaderImageFactory,
  inSidebarImageFactory
} from '../../definitions/components-definitions/image/image-definition.module';
import { RenderState } from '../../state/render-state.service';
import { ComponentHelper } from '../../util/component.helper';
import { VirtualComponent } from '../../model';
import { getParentVirtualComponent, isSpace } from '../util';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private attached: boolean;
  private destroyed$ = new Subject();
  private attachedComponents: Map<string, VirtualComponent> = new Map();
  private attachedComponentsSub: Subscription;
  private document: Document;

  constructor(
    @Inject(NB_DOCUMENT) document,
    private keyboardService: KeyboardService,
    private renderState: RenderState,
    private imageConverter: ImageConverter,
    private cmpHelper: ComponentHelper,
    private fileUtilService: FileUtilService
  ) {
    this.document = document;
  }

  attach(attachedComponents$: Observable<VirtualComponent[]>) {
    this.resolveAttachedComponents(attachedComponents$);
    if (this.attached) {
      return;
    }

    this.attached = true;

    // Subscribe on clipboard events
    this.subscribeOnCopy();
    this.subscribeOnPaste();
    this.subscribeOnCut();
  }

  detach() {
    if (!this.attached) {
      return;
    }

    this.attached = false;
    this.destroyed$.next();
  }

  private resolveAttachedComponents(attachedComponents$: Observable<VirtualComponent[]>): void {
    if (this.attachedComponentsSub) {
      this.attachedComponentsSub.unsubscribe();
    }

    attachedComponents$.pipe(takeUntil(this.destroyed$)).subscribe((components: VirtualComponent[]) => {
      const source: [string, VirtualComponent][] = components.map((vc: VirtualComponent) => [vc.component.id, vc]);
      this.attachedComponents = new Map(source);
    });
  }

  private subscribeOnCopy() {
    this.keyboardService.copy$
      .pipe(
        filter((e: ClipboardEvent) => this.canCopy(e)),
        combineWith(() => this.cmpHelper.getDataForCopy()),
        filter(([, data]) => this.canCopyList(data.components)),
        takeUntil(this.destroyed$)
      )
      .subscribe(([e, data]: [ClipboardEvent, { components: OvenComponent[] }]) => {
        const components = this.filterRootComponents(data.components);

        // We may have empty list here if we selected only root components
        // which was filtered at the line above
        if (!components.length) {
          return;
        }

        const copied: PasteComponent = {
          type: '@uibakery/cb',
          selectedComponents: components,
          id: Math.random().toString()
        };
        e.clipboardData.setData('application/json', JSON.stringify(copied));
        e.preventDefault();
        this.renderState.copy();
      });
  }

  private subscribeOnPaste() {
    this.keyboardService.paste$
      .pipe(
        filter((e: ClipboardEvent) => this.canPaste(e)),
        combineWith(() => this.renderState.activeComponentIdList$),
        combineWith(([, ids]: [ClipboardEvent, string[]]) => this.cmpHelper.findComponentRootType(ids.pop())),
        takeUntil(this.destroyed$)
        // check parent
      )
      .subscribe(([[e], rootType]: [[ClipboardEvent, string[]], RootComponentType]) => {
        // Get transfer items
        const items: DataTransferItemList = e.clipboardData.items;
        if (!items) {
          return;
        }

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('application') !== -1) {
            this.handlePasteComponents(items[i]);
          } else if (items[i].type.indexOf('image') !== -1) {
            this.handlePasteImage(items[i], rootType);
          }
        }
      });
  }

  private subscribeOnCut() {
    this.keyboardService.cut$
      .pipe(
        filter((e: ClipboardEvent) => this.canCopy(e)),
        combineWith(() => this.cmpHelper.getDataForCopy()),
        filter(([, data]) => this.canCopyList(data.components)),
        takeUntil(this.destroyed$)
      )
      .subscribe(([e, data]: [ClipboardEvent, { components: OvenComponent[] }]) => {
        const components = this.filterRootComponents(data.components);
        const cutted: PasteComponent = {
          type: '@uibakery/cb',
          selectedComponents: components
        };
        e.clipboardData.setData('application/json', JSON.stringify(cutted));
        e.preventDefault();
        this.renderState.cut();
      });
  }

  /**
   * Handle item (component list) from clipboard to send it in bakery.
   */
  private handlePasteComponents(item: DataTransferItem) {
    item.getAsString((data: string) => {
      const msg: PasteComponent = JSON.parse(data);

      // If we copied nothing but trying to paste something
      if (!msg.selectedComponents || !msg.selectedComponents.length) {
        return;
      }

      this.renderState.paste(msg);
    });
  }

  /**
   * Handle item (image) from clipboard to send it in bakery.
   */
  private handlePasteImage(item: DataTransferItem, rootType: RootComponentType) {
    const imageFile: File = item.getAsFile();

    let image: OvenComponent;
    if (rootType === RootComponentType.Header) {
      image = inHeaderImageFactory();
    } else if (rootType === RootComponentType.Sidebar) {
      image = inSidebarImageFactory();
    } else {
      image = imageFactory();
    }

    // Check max upload image size
    if (!this.fileUtilService.checkMaxImageSize(imageFile.size)) {
      const msg: PasteComponent = {
        type: '@uibakery/cb',
        image: image,
        error: 'Exceeded max upload 5MB size'
      };
      this.renderState.paste(msg);
      return;
    }

    this.imageConverter.convertImageToBase64(imageFile, imageFile.type, (url: string) => {
      // Create new Image component instance
      image.styles[BreakpointWidth.Desktop].src = {
        uploadUrl: url,
        name: imageFile.name,
        url: '',
        active: 'upload'
      };

      const msg: PasteComponent = {
        type: '@uibakery/cb',
        image: image
      };

      this.renderState.paste(msg);
    });
  }

  private canCopyList(componentList: OvenComponent[]): boolean {
    return !!componentList.filter(component => {
      return !!component && component.definitionId !== 'header' && component.definitionId !== 'sidebar';
    }).length;
  }

  private canCopy(e: KeyboardEvent | ClipboardEvent): boolean {
    return !e.target['isContentEditable'] && !window.getSelection().toString();
  }

  private canPaste(e: KeyboardEvent | ClipboardEvent): boolean {
    /**
     * In the case of paste event target is equals to document.activeElement that means
     * we're inserting in focused element like input, textarea, contenteditable and so on.
     * Otherwise, we're just inserting element somewhere on the screen.
     * */
    const eTarget: Element = e.target as Element;
    const activeElement: Element = this.document.activeElement;

    /**
     * at first load the application, before any changes,
     * the e.target and the document.activeElement always equal the body, so we must ignore this
     */
    return eTarget !== activeElement || (this.isBodyTagName(eTarget) && this.isBodyTagName(activeElement));
  }

  private isBodyTagName(element: Element): boolean {
    return element['tagName'] === 'BODY';
  }

  private filterRootComponents(components: OvenComponent[]): OvenComponent[] {
    return components.filter((component: OvenComponent) => {
      const vc: VirtualComponent = this.attachedComponents.get(component.id);
      const parent: VirtualComponent = getParentVirtualComponent(vc);
      return isSpace(parent);
    });
  }
}
