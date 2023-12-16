import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';

export interface SearchItem<T> {
  name: string;
  tags: string[];
  returnInstance: T;
}

export interface Searcher<T> {
  search(str: string): T[];
}

@Injectable()
export class SearchService {
  build<T>(list: SearchItem<T>[]): Searcher<T> {
    const options = {
      shouldSort: true,
      threshold: 0.25,
      location: 0,
      distance: 50,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'name',
          weight: 1
        },
        {
          name: 'tags',
          weight: 0.5
        }
      ]
    };
    const fuse = new Fuse(list, options);
    return {
      search(str: string): T[] {
        return fuse.search<SearchItem<T>>(str.trim()).map(item => item.item.returnInstance);
      }
    };
  }
}
