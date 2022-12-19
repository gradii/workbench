import { Inject, Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { AclService } from '../acl/acl.service';
import { ENVIRONMENT } from '../environment';

@Injectable({ providedIn: 'root' })
export class FeatureHiderService {
  protected renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document,
    @Inject(ENVIRONMENT) private environment,
    private injector: Injector,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  init() {
    // We ought to skip data show/hide for FormBuilder
    if (this.environment.formBuilder) {
      return;
    }

    const acl: AclService = this.injector.get(AclService);

    acl.canAccessAmplify().subscribe(canAccess => {
      this.toggleAccess(canAccess, 'disable-amplify-feature');
    });
  }

  private toggleAccess(canAccess: boolean, featureClass: string) {
    const body = this.document.body;
    if (canAccess) {
      this.renderer.removeClass(body, featureClass);
    } else {
      this.renderer.addClass(body, featureClass);
    }
  }
}
