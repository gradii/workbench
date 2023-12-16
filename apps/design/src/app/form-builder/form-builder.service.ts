import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BakeryComponent } from '@tools-state/component/component.model';
import { environment } from '../../environments/environment';
import { ComponentChange, TemplateChanges } from './app-changes';
import { FormTemplate } from './form-template';
import { deepExtend } from './deep-extend';

@Injectable()
export class FormBuilderService {
  private baseUrl = `${environment.apiUrl}/form-builder`;

  constructor(private http: HttpClient) {
  }

  loadTemplateList(): Observable<FormTemplate[]> {
    return this.http.get<FormTemplate[]>(`${this.baseUrl}/template`).pipe(
      map((templates: FormTemplate[]) => {
        return templates.map(template => Object.assign({}, template, { app: JSON.parse(template.model) }));
      })
    );
  }

  saveTemporaryProject(template: FormTemplate): Observable<string> {
    const { id: templateId, app } = template;
    const { theme } = app;
    const themeModel = JSON.stringify({
      dark: theme.dark,
      colors: theme.colors,
      radius: theme.radius,
      shadow: theme.shadow
    });
    return this.http.post(
      `${this.baseUrl}/create-project`,
      { name: 'Sign Up', templateId, model: JSON.stringify(app), themeModel, themeViewId: theme.id },
      { responseType: 'text' }
    );
  }

  mergeChanges(template: FormTemplate, changes: TemplateChanges): FormTemplate {
    const newTemplate = deepExtend({}, template);
    const model = newTemplate.app;
    const componentChanges = changes.componentChanges;
    const themeChanges = changes.themeChanges;

    if (componentChanges) {
      componentChanges.forEach(change => {
        const component = this.findComponent(model, change);
        if (component) {
          component.properties = deepExtend(component.properties, change.properties);
        }
      });
    }

    if (themeChanges) {
      model.theme = deepExtend(model.theme, themeChanges);
    }

    if (changes.name) {
      newTemplate.name = changes.name;
    }
    return newTemplate;
  }

  private findComponent(model, change: ComponentChange): BakeryComponent {
    return model.componentList
      .filter((component: BakeryComponent) => component.definitionId === change.definitionId)
      .find((component: BakeryComponent, i: number) => i === change.index);
  }
}
