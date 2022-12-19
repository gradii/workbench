import { Injectable } from '@angular/core';

const MAX_UPLOAD_IMAGE_SIZE = '5MB'; // follow format: '1KB', '2MB', '3GB'

@Injectable({ providedIn: 'root' })
export class FileUtilService {
  static fileSizeMap = new Map<string, number>([
    ['Bytes', 0],
    ['KB', 1],
    ['MB', 2],
    ['GB', 3]
  ]);

  convertHumanFileSizeFormatToBytes(value: string): number {
    if (!value) {
      return -1;
    }

    let result: number;
    const thr = 1024;

    value = value.trim();
    for (const key of FileUtilService.fileSizeMap.keys()) {
      if (!value.endsWith(key)) {
        continue;
      }
      const num = value.trim().split(key)[0].trim();
      const power = FileUtilService.fileSizeMap.get(key);
      if (power && num) {
        result = +num * Math.pow(thr, +power);
        break;
      } else {
        result = -1;
      }
    }
    return result;
  }

  checkMaxImageSize(size: number): boolean {
    return size < this.convertHumanFileSizeFormatToBytes(MAX_UPLOAD_IMAGE_SIZE);
  }
}
