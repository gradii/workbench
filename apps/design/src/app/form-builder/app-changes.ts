export interface TemplateChanges {
  name?;
  componentChanges?: ComponentChange[];
  themeChanges?: ThemeChanges;
}


export interface ThemeChanges {

}

export interface ComponentChange {
  styles?
  index?: number;
  id?: string;
  definitionId?: string;
  properties?: { [x: string]: any; };
}
