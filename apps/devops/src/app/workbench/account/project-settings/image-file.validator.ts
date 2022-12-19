import { Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { FileUtilService } from '@common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertFileToImage } from './file-to-image';

interface ImageDimensions {
  width: number;
  height: number;
}

@Injectable()
export class ImageFileSizeValidator implements Validator {
  constructor(private fileUtilService: FileUtilService) {
  }

  validate(ctrl: AbstractControl): ValidationErrors | null {
    const file = ctrl.value;
    if (!file) {
      return null;
    }

    const maxImageSizeOk: boolean = this.fileUtilService.checkMaxImageSize(file.size);

    if (!maxImageSizeOk) {
      return { maxImageSize: true };
    }
  }
}

export function imageDimesions(dimensions: ImageDimensions) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const file = control.value;

    if (!file) {
      return of(null);
    }

    return convertFileToImage(file).pipe(
      map((image: HTMLImageElement) => {
        if (checkImageNaturalDimensions(dimensions, image)) {
          return null;
        }

        return { imageDimensions: true };
      })
    );
  };
}

function checkImageNaturalDimensions(dimensions: ImageDimensions, image: HTMLImageElement): boolean {
  const { width, height } = dimensions;
  return width === image.naturalWidth && height === image.naturalHeight;
}
