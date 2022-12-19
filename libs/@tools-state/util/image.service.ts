import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BreakpointWidth, combineWith, ImageConverter } from '@common/public-api';
import { dispatch } from '@ngneat/effects';
import { FileStorageService, StorageAssetCopyRequest, StorageAssetResponse } from '@shared/file-storage.service';
import { ImageActions, ImageUploadError, UpdateImageSrc } from '@tools-state/image/image.actions';

import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImageService {
  uploadError: Subject<ImageUploadError> = new Subject<ImageUploadError>();

  constructor(
    private imageConverter: ImageConverter,
    private fileStorageService: FileStorageService
  ) {
  }

  uploadImage(image: File, name: string, cmpId: string, breakpoint: BreakpointWidth) {
    dispatch(
      ImageActions.UpdateImageSource({
        image     : image,
        name      : name,
        cmpId     : cmpId,
        breakpoint: breakpoint
      })
    );
  }

  validFileType(fileType: string): boolean {
    return new RegExp(/image\//g).test(fileType);
  }

  uploadImageByFileOrBase64(
    image: File | string,
    name: string,
    cmpId: string,
    breakpoint: BreakpointWidth
  ): Observable<StorageAssetResponse> {
    return getActiveProjectId.pipe(
      take(1),
      combineWith(() => {
        if (image instanceof File) {
          return of(image);
        } else {
          return of(this.imageConverter.convertBase64ToImage(image, name));
        }
      }),
      switchMap(([projectId, img]: [string, File]) => {
        const formData = new FormData();
        formData.append('file', img, name);
        formData.append('viewId', projectId);
        formData.append('breakpoint', breakpoint);

        return this.fileStorageService.uploadFile(formData);
      }),
      catchError((error: HttpErrorResponse) => {
        this.rejectUploadImage(this.getErrorMessage(error), [cmpId]);
        return of(null);
      })
    );
  }

  copyImagesByUrl(assets: UpdateImageSrc[]): Observable<StorageAssetResponse[]> {
    // Collect payload and component ids to show error
    const payload: StorageAssetCopyRequest[] = [];
    const idsToShowError: string[]           = [];
    assets.forEach((item: UpdateImageSrc) => {
      payload.push({
        url        : <string>item.image, // here will be always `string`
        name       : item.name,
        componentId: item.cmpId,
        breakpoint : item.breakpoint
      });
      idsToShowError.push(item.cmpId);
    });

    return getActiveProjectId.pipe(
      take(1),
      switchMap((projectId: string) => {
        return this.fileStorageService.copyAssets(payload, projectId);
      }),
      catchError((error: HttpErrorResponse) => {
        this.rejectUploadImage(this.getErrorMessage(error), idsToShowError);
        return of(null);
      })
    );
  }

  rejectUploadImage(error: string, compIds: string[]) {
    dispatch(ImageActions.UpdateImageSourceError({ error, compIds }));
  }

  preloadImage(url: string, callback: Function): void {
    if (!url) {
      return;
    }
    let img    = new Image();
    img.src    = url;
    img.onload = () => {
      callback();
      img = null;
    };
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    let errorMsg = '';
    if (error.status === 413) {
      errorMsg = 'Exceeded max upload 5MB size';
    } else {
      errorMsg = error.statusText;
    }
    return errorMsg;
  }
}
