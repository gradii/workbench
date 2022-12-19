import { TemplateFacadeService } from '@account-state/template/template-facade.service';
import { Injectable } from '@angular/core';
import { environment } from '@environments';
import { dispatch } from '@ngneat/effects';

import { DownloadActions } from '@tools-state/download/download.actions';
import { getErrored, getLoading, getSuccess } from '@tools-state/download/download.selectors';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DownloadFacade {
  readonly loading$: Observable<boolean>              = getLoading;
  readonly errored$: Observable<boolean>              = getErrored;
  readonly success$: Observable<boolean>              = getSuccess;
  readonly loadingSample$: Observable<boolean>        = this.templateFacade.codeLoading$;
  readonly loadingSampleSuccess$: Observable<boolean> = this.templateFacade.codeLoadingSuccess$;
  readonly loadingSampleFailed$: Observable<boolean>  = this.templateFacade.codeLoadingFailed$;

  constructor(private templateFacade: TemplateFacadeService) {
  }

  downloadApp() {
    dispatch(DownloadActions.Download('project'));
  }

  downloadSample() {
    this.templateFacade.downloadTemplateCode({ id: environment.sampleTemplateId, name: 'Sample Project' }, 'project');
  }
}
