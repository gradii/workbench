import { createAction } from '@ngneat/effects';

export namespace DownloadActions {
  export enum ActionTypes {
    Download           = '[Download] Download',
    DownloadSuccess    = '[Download] Download Success',
    DownloadError      = '[Download] Download Error',
    ClearDownloadState = '[Download] Clear Download State',
  }

  export const Download = createAction(ActionTypes.Download, (source: string) => ({ source }));

  export const DownloadSuccess = createAction(ActionTypes.DownloadSuccess);

  export const DownloadError = createAction(ActionTypes.DownloadError);

  export const ClearDownloadState = createAction(ActionTypes.ClearDownloadState);
}
