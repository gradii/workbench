import { Action } from '@ngrx/store';
import { PasteComponent } from '@common';

export namespace ClipboardActions {
  export enum ActionTypes {
    Copy = '[Clipboard] Copy',
    Paste = '[Clipboard] Paste',
    Cut = '[Clipboard] Cut',
    Clear = '[Clipboard] Clear',
  }

  export class Copy implements Action {
    readonly type = ActionTypes.Copy;
  }

  export class Paste implements Action {
    readonly type = ActionTypes.Paste;

    constructor(public data: PasteComponent) {
    }
  }

  export class Cut implements Action {
    readonly type = ActionTypes.Cut;
  }

  export class Clear implements Action {
    readonly type = ActionTypes.Clear;
  }
}
