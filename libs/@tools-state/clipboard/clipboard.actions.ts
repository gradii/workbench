import { PasteComponent } from '@common/public-api';
import { createAction } from '@ngneat/effects';

export namespace ClipboardActions {
  export enum ActionTypes {
    Copy  = '[Clipboard] Copy',
    Paste = '[Clipboard] Paste',
    Cut   = '[Clipboard] Cut',
    Clear = '[Clipboard] Clear',
  }

  export const Copy = createAction(
    ActionTypes.Copy
  );

  export const Paste = createAction(
    ActionTypes.Paste,
    (data: PasteComponent) => ({ data })
  );

  export const Cut = createAction(
    ActionTypes.Cut
  );

  export const Clear = createAction(
    ActionTypes.Clear
  );
}
