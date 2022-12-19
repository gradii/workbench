export interface Template {
  id;
  name;
  source
  tags?
  previewLink?
  availableFrom?
  locked?
  description?
  usages?
  preview?
}

export interface TemplateBag {
  app
}

export interface TemplateBagResponse {
  model
}
