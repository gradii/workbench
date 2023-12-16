import { Observable } from 'rxjs';

export function convertFileToImage(file: File): Observable<HTMLImageElement> {
  return new Observable(observer => {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const image = new Image();
      image.onload = function(e) {
        const loadedImage: any = e.currentTarget;
        image.width = loadedImage.width;
        image.height = loadedImage.height;
        observer.next(image);
        observer.complete();
      };
      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}
