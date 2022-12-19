import { Injectable } from '@angular/core';
import { IconComponent, IconRegistry } from '@gradii/triangle/icon';

import { ICONS } from './icons';

@Injectable({ providedIn: 'root' })
export class BakeryIconsService {
  private readonly packName = 'bakery';

  constructor(private iconLibraries: IconRegistry) {
    // this.iconLibraries.registerSvgPack(this.packName, this.createIcons());
  }

  getAllIcons(): Map<string, IconComponent> {
    return new Map([...this.getPackIcons('eva'), ...this.getPackIcons(this.packName)]);
  }

  private getPackIcons(packName: string): Map<string, IconComponent> {
    // return this.iconLibraries.getPack(packName).icons as Map<string, NbSvgIcon>;
    return new Map();
  }

  // private createIcons(): NbIcons {
  //   return Object.entries(ICONS)
  //     .map(([name, icon]) => {
  //       return [name, new NbSvgIcon(name, icon)];
  //     })
  //     .reduce((newIcons, [name, icon]: [string, NbSvgIcon]) => {
  //       newIcons[name] = icon;
  //       return newIcons;
  //     }, {});
  // }
}
