import { Injectable } from '@angular/core';
import { Palette } from 'node-vibrant/lib/color';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const Vibrant = require('node-vibrant');

@Injectable()
export class ImageColorService {
  detectColors(image: string): Observable<string[]> {
    const result: Promise<Palette> = Vibrant.from(image).getPalette();

    return from(result).pipe(
      map((p: Palette) =>
        [
          p.Vibrant.getHex(),
          p.Muted.getHex(),
          p.DarkVibrant.getHex(),
          p.DarkMuted.getHex(),
          p.LightVibrant.getHex(),
          p.LightMuted.getHex()
        ].filter((color, index, arr) => arr.indexOf(color) === index)
      )
    );
  }
}
