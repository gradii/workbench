import { Inject, Injectable } from '@angular/core';
import {
  NB_TOASTR_CONFIG,
  NbComponentPortal,
  NbGlobalLogicalPosition,
  NbGlobalPosition,
  NbOverlayRef,
  NbToast,
  NbToastContainer,
  NbToastrConfig,
  NbToastrContainerRegistry,
  NbToastRef,
  NbToastrService
} from '@nebular/theme';
import { ToastrContainerComponent } from '@shared/toastr/toastr-container.component';
import { ToastComponent } from '@shared/toastr/toast.component';

export class ToastContainer extends NbToastContainer {
  attach(toast: NbToast): NbToastRef {
    if (toast.config.preventDuplicates && this.isDuplicate(toast)) {
      return;
    }
    this.removeToastIfLimitReached(toast);

    const toastComponent: ToastComponent = this.attachToast(toast);
    if (toast.config.destroyByClick) {
      this.subscribeOnClick(toastComponent, toast);
    }
    if (toast.config.duration) {
      this.setDestroyTimeout(toast);
    }
    this.prevToast = toast;

    return new NbToastRef(this, toast);
  }

  protected attachToast(toast: NbToast): ToastComponent {
    return super.attachToast(toast);
  }

  protected attachToTop(toast: NbToast): ToastComponent {
    return super.attachToTop(toast);
  }

  protected attachToBottom(toast: NbToast): ToastComponent {
    return super.attachToBottom(toast);
  }
}

interface ToastrOverlayWithContainer {
  overlayRef: NbOverlayRef;
  toastrContainer: ToastContainer;
}

@Injectable()
export class ToastrContainerRegistry extends NbToastrContainerRegistry {
  protected overlays: Map<NbGlobalPosition, ToastrOverlayWithContainer> = new Map();

  get(position: NbGlobalPosition): ToastContainer {
    const logicalPosition: NbGlobalLogicalPosition = this.positionHelper.toLogicalPosition(position);

    const overlayWithContainer: ToastrOverlayWithContainer = this.overlays.get(logicalPosition);
    if (!overlayWithContainer || !this.existsInDom(overlayWithContainer.toastrContainer)) {
      if (overlayWithContainer) {
        overlayWithContainer.overlayRef.dispose();
      }
      this.instantiateContainer(logicalPosition);
    }

    return this.overlays.get(logicalPosition).toastrContainer;
  }

  protected createContainer(position: NbGlobalLogicalPosition): ToastrOverlayWithContainer {
    const positionStrategy = this.positionBuilder.global().position(position);
    const ref = this.overlay.create({ positionStrategy });
    this.addClassToOverlayHost(ref);
    const containerRef = ref.attach(new NbComponentPortal(ToastrContainerComponent, null, null, this.cfr));
    return {
      overlayRef: ref,
      toastrContainer: new ToastContainer(position, containerRef, this.positionHelper)
    };
  }
}

@Injectable()
export class ToastrService extends NbToastrService {
  constructor(
    @Inject(NB_TOASTR_CONFIG) protected globalConfig: NbToastrConfig,
    protected containerRegistry: ToastrContainerRegistry
  ) {
    super(globalConfig, containerRegistry);
  }

  show(message: any, userConfig?: Partial<NbToastrConfig>): NbToastRef {
    const config = new NbToastrConfig({ ...this.globalConfig, ...userConfig });
    const container = this.containerRegistry.get(config.position);
    const toast = { message, title: '', config };
    return container.attach(toast);
  }

  success(message: any, config?: Partial<NbToastrConfig>): NbToastRef {
    return this.show(message, { ...config, status: 'success' });
  }

  info(message: any, config?: Partial<NbToastrConfig>): NbToastRef {
    return this.show(message, { ...config, status: 'info' });
  }

  warning(message: any, config?: Partial<NbToastrConfig>): NbToastRef {
    return this.show(message, { ...config, status: 'warning' });
  }

  primary(message: any, config?: Partial<NbToastrConfig>): NbToastRef {
    return this.show(message, { ...config, status: 'primary' });
  }

  danger(message: any, config?: Partial<NbToastrConfig>): NbToastRef {
    return this.show(message, { ...config, status: 'danger', icon: 'alert-circle' });
  }

  default(message: any, config?: Partial<NbToastrConfig>): NbToastRef {
    return this.show(message, { ...config, status: 'basic' });
  }

  control(message: any, config?: Partial<NbToastrConfig>): NbToastRef {
    return this.show(message, { ...config, status: 'control' });
  }
}
