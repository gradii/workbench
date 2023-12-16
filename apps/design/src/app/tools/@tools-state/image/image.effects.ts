import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, take, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { combineWith, ImageConverter } from '@common';

import { ImageActions, ImageUploadError, UpdateImageSrc } from '@tools-state/image/image.actions';
import { ImageService } from '@tools-state/util/image.service';
import { BakeryComponent } from '@tools-state/component/component.model';
import { ConfirmWindowService } from '@tools-state/util/confirm-window.service';
import { getComponentById } from '@tools-state/component/component.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { ImageUtilService } from '@tools-state/image/image-util.service';
import { StorageAssetResponse } from '@shared/file-storage.service';

@Injectable()
export class ImageEffects {
  constructor(
    private actions$: Actions,
    private imageService: ImageService,
    private imageConverter: ImageConverter,
    private imageUtilService: ImageUtilService,
    private confirmWindowService: ConfirmWindowService,
    private store: Store<fromTools.State>
  ) {
  }

  @Effect()
  updateImageSource = this.actions$.pipe(
    ofType(ImageActions.ActionTypes.UpdateImageSource),
    mergeMap(({ data }: { data: UpdateImageSrc }) => {
      // Activate browser window confirm on page close while picture loading
      this.confirmWindowService.enableConfirmClosingPage();

      const { image, name, cmpId, breakpoint } = data;

      return forkJoin({
        component: this.store.select(getComponentById, cmpId).pipe(take(1)),
        asset: this.imageService.uploadImageByFileOrBase64(image, name, cmpId, breakpoint)
      });
    }),
    mergeMap(({ component, asset }: { component: BakeryComponent; asset: StorageAssetResponse }) => {
      return this.imageUtilService.handleImageSourceUpdate(asset, component);
    })
  );

  @Effect()
  updateImageSources = this.actions$.pipe(
    ofType(ImageActions.ActionTypes.UpdateImageSources),
    mergeMap(({ data }: { data: UpdateImageSrc[] }) => {
      // Activate browser window confirm on page close while picture loading
      this.confirmWindowService.enableConfirmClosingPage();

      return this.imageService.copyImagesByUrl(data);
    }),
    mergeMap((assets: StorageAssetResponse[]) => assets),
    combineWith((asset: StorageAssetResponse) => this.store.select(getComponentById, asset.componentId)),
    mergeMap(([asset, component]: [StorageAssetResponse, BakeryComponent]) =>
      this.imageUtilService.handleImageSourceUpdate(asset, component)
    )
  );

  @Effect({ dispatch: false })
  updateImageSourceSuccess = this.actions$.pipe(
    ofType(ImageActions.ActionTypes.UpdateImageSourceSuccess),
    tap(() => this.confirmWindowService.disableConfirmClosingPage())
  );

  @Effect({ dispatch: false })
  updateImageSourceError = this.actions$.pipe(
    ofType(ImageActions.ActionTypes.UpdateImageSourceError),
    tap((error: { data: ImageUploadError }) => {
      this.confirmWindowService.disableConfirmClosingPage();
      setTimeout(() => this.imageService.uploadError.next(error.data));
    })
  );
}
