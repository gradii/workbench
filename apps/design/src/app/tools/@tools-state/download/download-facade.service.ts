import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DownloadActions } from '@tools-state/download/download.actions';
import { fromTools } from '@tools-state/tools.reducer';
import { getErrored, getLoading, getSuccess } from '@tools-state/download/download.selectors';
import { environment } from '../../../../environments/environment';
import { TemplateFacadeService } from '@account-state/template/template-facade.service';

@Injectable({ providedIn: 'root' })
export class DownloadFacade {
  readonly loading$: Observable<boolean> = this.store.pipe(select(getLoading));
  readonly errored$: Observable<boolean> = this.store.pipe(select(getErrored));
  readonly success$: Observable<boolean> = this.store.pipe(select(getSuccess));
  readonly loadingSample$: Observable<boolean> = this.templateFacade.codeLoading$;
  readonly loadingSampleSuccess$: Observable<boolean> = this.templateFacade.codeLoadingSuccess$;
  readonly loadingSampleFailed$: Observable<boolean> = this.templateFacade.codeLoadingFailed$;

  constructor(private store: Store<fromTools.State>, private templateFacade: TemplateFacadeService) {
  }

  downloadApp() {
    this.store.dispatch(new DownloadActions.Download('project'));
  }

  downloadSample() {
    this.templateFacade.downloadTemplateCode({ id: environment.sampleTemplateId, name: 'Sample Project' }, 'project');
  }
}
