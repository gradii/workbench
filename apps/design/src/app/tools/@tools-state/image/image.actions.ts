import { Action } from '@ngrx/store';
import { BreakpointWidth } from '@common';

export interface UpdateImageSrc {
  image: File | string;
  name: string;
  cmpId: string;
  breakpoint?: BreakpointWidth;
}

export interface ImageUploadError {
  error: string;
  compIds: string[];
}

export namespace ImageActions {
  export enum ActionTypes {
    UpdateImageSource = '[Image] Update Image Source',
    UpdateImageSources = '[Image] Update Image Sources',
    UpdateImageSourceSuccess = '[Image] Update Image Source Success',
    UpdateImageSourceError = '[Image] Update Image Source Error',
  }

  export class UpdateImageSource implements Action {
    readonly type = ActionTypes.UpdateImageSource;

    constructor(public data: UpdateImageSrc) {
    }
  }

  export class UpdateImageSources implements Action {
    readonly type = ActionTypes.UpdateImageSources;

    constructor(public data: UpdateImageSrc[]) {
    }
  }

  export class UpdateImageSourceSuccess implements Action {
    readonly type = ActionTypes.UpdateImageSourceSuccess;
  }

  export class UpdateImageSourceError implements Action {
    readonly type = ActionTypes.UpdateImageSourceError;

    constructor(public data: ImageUploadError) {
    }
  }
}
