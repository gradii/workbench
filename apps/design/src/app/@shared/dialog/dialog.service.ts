import { ComponentFactoryResolver, Inject, Injectable, Injector, TemplateRef, Type } from '@angular/core';
import {
  NB_DIALOG_CONFIG,
  NB_DOCUMENT,
  NbComponentPortal,
  NbDialogConfig,
  NbDialogService,
  NbOverlayRef,
  NbOverlayService,
  NbPortalInjector,
  NbPositionBuilderService
} from '@nebular/theme';

import { DialogComponent } from './dialog.component';
import { DialogRef } from './dialog-ref';

@Injectable()
export class DialogService extends NbDialogService {
  constructor(
    @Inject(NB_DOCUMENT) document,
    @Inject(NB_DIALOG_CONFIG) globalConfig,
    positionBuilder: NbPositionBuilderService,
    overlay: NbOverlayService,
    injector: Injector,
    cfr: ComponentFactoryResolver
  ) {
    super(document, globalConfig, positionBuilder, overlay, injector, cfr);
  }

  open<T>(
    content: Type<T> | TemplateRef<T>,
    userConfig: Partial<NbDialogConfig<Partial<T> | string>> = {}
  ): DialogRef<T> {
    const config = new NbDialogConfig({ ...this.globalConfig, ...userConfig });
    const overlayRef = this.createOverlay(config);
    const container = this.createContainer(config, overlayRef);
    const dialogRef = new DialogRef<T>(overlayRef, container);
    this.createContent(config, content, container, dialogRef);

    this.registerCloseListeners(config, overlayRef, dialogRef);

    return dialogRef;
  }

  protected createContainer(config: NbDialogConfig, overlayRef: NbOverlayRef): DialogComponent {
    const injector = new NbPortalInjector(this.createInjector(config), new WeakMap([[NbDialogConfig, config]]));
    const containerPortal = new NbComponentPortal(DialogComponent, null, injector, this.cfr);
    const containerRef = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  protected createComponentPortal<T>(
    config: NbDialogConfig,
    content: Type<T>,
    dialogRef: DialogRef<T>
  ): NbComponentPortal {
    const injector = this.createInjector(config);
    const portalInjector = new NbPortalInjector(injector, new WeakMap([[DialogRef, dialogRef]]));
    return new NbComponentPortal(content, config.viewContainerRef, portalInjector);
  }
}
