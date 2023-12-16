import { Injectable } from '@angular/core';
import { NbIconLibraries, NbIcons, NbSvgIcon } from '@nebular/theme';

import { ICONS } from './icons';

@Injectable({ providedIn: 'root' })
export class BakeryIconsService {
  private readonly packName = 'bakery';

  constructor(private iconLibraries: NbIconLibraries) {
    this.iconLibraries.registerSvgPack(this.packName, this.createIcons());
  }

  getAllIcons(): Map<string, NbSvgIcon> {
    return new Map([...this.getPackIcons('eva'), ...this.getPackIcons(this.packName)]);
  }

  private getPackIcons(packName: string): Map<string, NbSvgIcon> {
    return this.iconLibraries.getPack(packName).icons as Map<string, NbSvgIcon>;
  }

  private createIcons(): NbIcons {
    return Object.entries(ICONS)
      .map(([name, icon]) => {
        return [name, new NbSvgIcon(name, icon)];
      })
      .reduce((newIcons, [name, icon]: [string, NbSvgIcon]) => {
        newIcons[name] = icon;
        return newIcons;
      }, {});
  }
}
