import { Injectable } from '@angular/core';

import { ClipboardContext } from '@tools-state/clipboard/clipboard';
import { RemapperService } from '@tools-state/util/remapper.service';

@Injectable({ providedIn: 'root' })
export class CopierService {
  constructor(private copier: RemapperService) {
  }

  // Just creates a deep copy of the components
  copy(data: ClipboardContext): ClipboardContext {
    return this.deepClone(data);
  }

  // Clones all elements and assigns new id's
  clone(data: ClipboardContext): ClipboardContext {
    return this.copier.copy(this.deepClone(data));
  }

  private deepClone(data: ClipboardContext): ClipboardContext {
    return JSON.parse(JSON.stringify(data));
  }
}
