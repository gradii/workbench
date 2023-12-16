import { FileStorageService } from '@shared/file-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { BreakpointWidth, combineWith, ImageConverter } from '@common';

import { getActiveProjectId } from '@tools-state/project/project.selectors';
import { fromTools } from '@tools-state/tools.reducer';
import { ImageActions, ImageUploadError, UpdateImageSrc } from '@tools-state/image/image.actions';

import { StorageAssetResponse, StorageAssetCopyRequest } from '@shared/file-storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {
  uploadError: Subject<ImageUploadError> = new Subject<ImageUploadError>();

  constructor(
    private imageConverter: ImageConverter,
    private fileStorageService: FileStorageService,
    private store: Store<fromTools.State>
  ) {
  }

  uploadImage(image: File, name: string, cmpId: string, breakpoint: BreakpointWidth) {
    this.store.dispatch(
      new ImageActions.UpdateImageSource({
        image: image,
        name: name,
        cmpId: cmpId,
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
    return this.store.pipe(
      take(1),
      select(getActiveProjectId),
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
    const idsToShowError: string[] = [];
    assets.forEach((item: UpdateImageSrc) => {
      payload.push({
        url: <string>item.image, // here will be always `string`
        name: item.name,
        componentId: item.cmpId,
        breakpoint: item.breakpoint
      });
      idsToShowError.push(item.cmpId);
    });

    return this.store.pipe(
      take(1),
      select(getActiveProjectId),
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
    this.store.dispatch(new ImageActions.UpdateImageSourceError({ error, compIds }));
  }

  preloadImage(url: string, callback: Function): void {
    if (!url) {
      return;
    }
    let img = new Image();
    img.src = url;
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
