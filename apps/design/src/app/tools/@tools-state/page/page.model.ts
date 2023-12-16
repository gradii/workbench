import { Update } from '@ngrx/entity';
import { PageTreeWithProject } from '@tools-state/page/page-import.service';

export interface Page {
  id: string;
  name: any;
  url: any;
  layout?;
  parentPageId: any;
}

export interface PageTreeNode {
  id: string;
  name: any;
  url: any;
  layout?: any;
  parentPageId: any;
  children: PageTreeWithProject[];
}

export interface PageUpdate {
  id
  parentPageId?
  changes: Partial<Page>
}
