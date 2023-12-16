import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageConverter {
  convertImageToBase64(imageFile: File, type: string, callback): void {
    // Create an abstract canvas
    let cnv = document.createElement('canvas');
    const ctx = cnv.getContext('2d');
    const img = this.createTempImageByFile(imageFile);

    img.onload = () => {
      cnv.width = img.width;
      cnv.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataUrl = cnv.toDataURL(type, 0.5);
      callback(dataUrl);
      cnv = null;
    };
  }

  convertBase64ToImage(url, fileName): File {
    const arr = url.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  private createTempImageByFile(imageFile: File) {
    const img = new Image();
    const URLObj = window.URL;
    img.src = URLObj.createObjectURL(imageFile);
    return img;
  }
}
