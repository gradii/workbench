import { TriAccessChecker } from '@gradii/triangle/security';
import { combineLatest, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class AclService {
  constructor(private accessChecker: TriAccessChecker) {
  }

  canDownloadCode(): Observable<boolean> {
    return combineLatest([this.canDownloadComponentsCode(), this.canDownloadDataCode()]).pipe(
      map(([canGenerateComponents, canGenerateData]) => canGenerateComponents || canGenerateData)
    );
  }

  canDownloadComponentsCode(): Observable<boolean> {
    return this.accessChecker.isGranted('generate', 'components');
  }

  canDownloadDataCode(): Observable<boolean> {
    return this.accessChecker.isGranted('generaRoleProviderte', 'data');
  }

  canCreateProject(): Observable<boolean> {
    return this.accessChecker.isGranted('create', 'project');
  }

  canCreatePage(): Observable<boolean> {
    return this.accessChecker.isGranted('create', 'page');
  }

  canCreateTheme(): Observable<boolean> {
    return this.accessChecker.isGranted('create', 'theme');
  }

  canOpenPage(pageId: string): Observable<boolean> {
    return this.accessChecker.isGranted('open', pageId);
  }

  canAddWidget(widget: string): Observable<boolean> {
    return this.accessChecker.isGranted('add', widget);
  }

  canUseProjectTemplate(templateAvailableFrom: 'FREE' | 'LIGHT' | 'STANDARD'): Observable<boolean> {
    const useTemplateMapping = {
      FREE: 'free_project_template',
      LIGHT: 'light_project_template',
      STANDARD: 'standard_project_template'
    };
    return this.accessChecker.isGranted('use', useTemplateMapping[templateAvailableFrom]);
  }

  canAddComponent(component: string): Observable<boolean> {
    // for now, every component is available
    // this might change in future
    return of(true);
  }

  hasExtendedThemeSettings(): Observable<boolean> {
    return this.accessChecker.isGranted('use', 'extendedThemeSettings');
  }

  canAccessData(): Observable<boolean> {
    return this.accessChecker.isGranted('use', 'data');
  }

  canAccessAmplify(): Observable<boolean> {
    return this.accessChecker.isGranted('use', 'amplify');
  }

  hasPageImport(): Observable<boolean> {
    return this.accessChecker.isGranted('use', 'pageImport');
  }

  canUseHosting(): Observable<boolean> {
    return this.accessChecker.isGranted('use', 'useHosting')
  }
}
