import { Action } from '@ngrx/store';

export namespace DownloadActions {
  export enum ActionTypes {
    Download = '[Download] Download',
    DownloadSuccess = '[Download] Download Success',
    DownloadError = '[Download] Download Error',
    ClearDownloadState = '[Download] Clear Download State',
  }

  export class Download implements Action {
    readonly type = ActionTypes.Download;

    constructor(public source: string) {
    }
  }

  export class DownloadSuccess implements Action {
    readonly type = ActionTypes.DownloadSuccess;
  }

  export class DownloadError implements Action {
    readonly type = ActionTypes.DownloadError;
  }

  export class ClearDownloadState implements Action {
    readonly type = ActionTypes.ClearDownloadState;
  }

  export type ActionsUnion = Download | DownloadSuccess | DownloadError | ClearDownloadState;
}
