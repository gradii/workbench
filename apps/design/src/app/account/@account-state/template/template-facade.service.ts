import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FeatureActions } from '@root-state/feature/feature.actions';
import { Template } from '@account-state/template/template.model';
import { TemplateActions } from '@account-state/template/template.actions';
import { fromTemplate } from '@account-state/template/template.reducer';
import {
  selectCodeLoading,
  selectCodeLoadingFailed,
  selectCodeLoadingSuccess,
  selectCodeLoadingTemplateId,
  selectListLoading,
  selectListLoadingFailed,
  selectTemplateList
} from '@account-state/template/template.selectors';

@Injectable({ providedIn: 'root' })
export class TemplateFacadeService {
  readonly loading$: Observable<boolean> = this.store.select(selectListLoading);
  readonly loadingFailed$: Observable<boolean> = this.store.select(selectListLoadingFailed);
  readonly templateList$: Observable<Template[]> = this.store.select(selectTemplateList);
  readonly codeLoading$: Observable<boolean> = this.store.select(selectCodeLoading);
  readonly codeLoadingSuccess$: Observable<boolean> = this.store.select(selectCodeLoadingSuccess);
  readonly codeLoadingFailed$: Observable<boolean> = this.store.select(selectCodeLoadingFailed);
  readonly codeLoadingTemplateId$: Observable<string> = this.store.select(selectCodeLoadingTemplateId);

  constructor(private store: Store<fromTemplate.State>) {
  }

  load() {
    this.store.dispatch(TemplateActions.loadTemplateList());
  }

  accessTemplate(template: Template) {
    this.store.dispatch(FeatureActions.accessFeature({ feature: 'template', element: template.name }));
  }

  downloadTemplateCode({ id, name }, source: string) {
    this.store.dispatch(TemplateActions.loadTemplateCode({ id, name, source }));
  }
}
