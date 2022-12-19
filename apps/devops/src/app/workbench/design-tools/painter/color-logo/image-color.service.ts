import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// @ts-ignore
import * as Vibrant from 'node-vibrant';
import { Palette } from 'node-vibrant/lib/color';

@Injectable()
export class ImageColorService {
  detectColors(image: string): Observable<string[]> {
    const result: Promise<Palette> = Vibrant.from(image).useQuantizer(Vibrant.Quantizer.WebWorker).getPalette();

    return from(result).pipe(
      map((p: Palette) =>
        [
          p.Vibrant.hex,
          p.Muted.hex,
          p.DarkVibrant.hex,
          p.DarkMuted.hex,
          p.LightVibrant.hex,
          p.LightMuted.hex
        ].filter((color, index, arr) => arr.indexOf(color) === index)
      )
    );
  }
}
