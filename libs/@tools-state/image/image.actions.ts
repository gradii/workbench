import { createAction } from '@ngneat/effects';
import { BreakpointWidth } from '@common/public-api';

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
    UpdateImageSource        = '[Image] Update Image Source',
    UpdateImageSources       = '[Image] Update Image Sources',
    UpdateImageSourceSuccess = '[Image] Update Image Source Success',
    UpdateImageSourceError   = '[Image] Update Image Source Error',
  }

  export const UpdateImageSource = createAction(
    ActionTypes.UpdateImageSource,
    (data: UpdateImageSrc) => ({ data })
  );

  export const UpdateImageSources = createAction(
    ActionTypes.UpdateImageSources,
    (data: UpdateImageSrc[]) => ({ data })
  );

  export const UpdateImageSourceSuccess = createAction(
    ActionTypes.UpdateImageSourceSuccess
  );

  export const UpdateImageSourceError = createAction(
    ActionTypes.UpdateImageSourceError,
    (data: ImageUploadError) => ({ data })
  );
}
