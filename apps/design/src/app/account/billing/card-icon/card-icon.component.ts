import { Component, Input, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

import { registerCardBrandIcons } from './card-brand-icons';

const UNKNOWN_BRAND = 'unknown';
const ICON_PACK = 'card-brand';

@Component({
  selector: 'ub-card-icon',
  styleUrls: ['./card-icon.component.scss'],
  template: ` <nb-icon pack="card-brand" [icon]="icon"></nb-icon> `
})
export class CardIconComponent implements OnInit {
  @Input()
  set brand(brand: string) {
    this.icon = this.toIcon(brand);
  }

  get brand(): string {
    return this.icon;
  }

  icon = UNKNOWN_BRAND;

  constructor(private iconLibraries: NbIconLibraries) {
  }

  ngOnInit(): void {
    this.registerIconPack();
  }

  private toIcon(brand: string) {
    if (this.iconExists(brand)) {
      return brand.toLowerCase();
    }

    return UNKNOWN_BRAND;
  }

  private iconExists(brand: string): boolean {
    try {
      this.iconLibraries.getSvgIcon(brand && brand.toLowerCase(), 'card-brand');
      return true;
    } catch (e) {
      return false;
    }
  }

  private registerIconPack() {
    if (this.iconLibraries.getPack(ICON_PACK)) {
      return;
    }

    registerCardBrandIcons(this.iconLibraries);
  }
}
