import { Injectable } from '@angular/core';
import { combineWith, ImageConverter } from '@common/public-api';
import { createEffect, ofType } from '@ngneat/effects';
import { StorageAssetResponse } from '@shared/file-storage.service';
import { PuffComponent } from '@tools-state/component/component.model';
import { getComponentById } from '@tools-state/component/component.selectors';
import { ImageUtilService } from '@tools-state/image/image-util.service';

import { ImageActions, ImageUploadError, UpdateImageSrc } from '@tools-state/image/image.actions';
import { ConfirmWindowService } from '@tools-state/util/confirm-window.service';
import { ImageService } from '@tools-state/util/image.service';
import { forkJoin } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';

@Injectable()
export class ImageEffects {
  constructor(
    private imageService: ImageService,
    private imageConverter: ImageConverter,
    private imageUtilService: ImageUtilService,
    private confirmWindowService: ConfirmWindowService
  ) {
  }

  updateImageSource = createEffect(actions => actions.pipe(
    ofType(ImageActions.UpdateImageSource),
    mergeMap(({ data }: { data: UpdateImageSrc }) => {
      // Activate browser window confirm on page close while picture loading
      this.confirmWindowService.enableConfirmClosingPage();

      const { image, name, cmpId, breakpoint } = data;

      return forkJoin({
        component: getComponentById(cmpId).pipe(take(1)),
        asset    : this.imageService.uploadImageByFileOrBase64(image, name, cmpId, breakpoint)
      });
    }),
    mergeMap(({ component, asset }: { component: PuffComponent; asset: StorageAssetResponse }) => {
      return this.imageUtilService.handleImageSourceUpdate(asset, component);
    })
  ), { dispatch: true });

  updateImageSources = createEffect(actions => actions.pipe(
    ofType(ImageActions.UpdateImageSources),
    mergeMap(({ data }: { data: UpdateImageSrc[] }) => {
      // Activate browser window confirm on page close while picture loading
      this.confirmWindowService.enableConfirmClosingPage();

      return this.imageService.copyImagesByUrl(data);
    }),
    mergeMap((assets: StorageAssetResponse[]) => assets),
    combineWith((asset: StorageAssetResponse) => getComponentById(asset.componentId)),
    mergeMap(([asset, component]: [StorageAssetResponse, PuffComponent]) =>
      this.imageUtilService.handleImageSourceUpdate(asset, component)
    )
  ), { dispatch: true });

  updateImageSourceSuccess = createEffect(actions => actions.pipe(
    ofType(ImageActions.UpdateImageSourceSuccess),
    tap(() => this.confirmWindowService.disableConfirmClosingPage())
  ), { dispatch: false });

  updateImageSourceError = createEffect(actions => actions.pipe(
    ofType(ImageActions.UpdateImageSourceError),
    tap((error: { data: ImageUploadError }) => {
      this.confirmWindowService.disableConfirmClosingPage();
      setTimeout(() => this.imageService.uploadError.next(error.data));
    })
  ), { dispatch: false });
}
