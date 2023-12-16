import { ModuleWithProviders, NgModule } from '@angular/core';
import { NB_TOASTR_CONFIG, NbIconModule, NbOverlayModule, NbToastrConfig } from '@nebular/theme';
import { ToastComponent } from './toast.component';
import { ToastrContainerRegistry, ToastrService } from '@shared/toastr/toastr.service';
import { ToastrContainerComponent } from '@shared/toastr/toastr-container.component';
import { CommonModule } from '@angular/common';

/**
 * We need to show some toast with our design,
 * but nebular don't allow use custom toast template and custom animations
 * that's why we create our custom ToastrModule witch use nebular
 * logic and our templates and styles
 *
 * TODO: if nebual provide changing animations and templates - remove this and use nebular
 */
@NgModule({
  imports: [CommonModule, NbOverlayModule, NbIconModule],
  declarations: [ToastComponent, ToastrContainerComponent],
  entryComponents: [ToastComponent, ToastrContainerComponent]
})
export class ToastrModule {
  static forRoot(toastrConfig: Partial<NbToastrConfig> = {}): ModuleWithProviders<ToastrModule> {
    return {
      ngModule: ToastrModule,
      providers: [ToastrService, ToastrContainerRegistry, { provide: NB_TOASTR_CONFIG, useValue: toastrConfig }]
    };
  }
}
