import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NbIcon } from '@nebular/theme';

import { BakeryIconsService } from './bakery-icons.service';

@Component({
  selector: 'bc-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./icon.component.scss'],
  template: '<span [innerHTML]="iconSvg"></span>'
})
export class IconComponent {
  @Input() name: string;
  @Input() defaultIcon: string;
  private readonly icons: Map<string, NbIcon>;

  constructor(private sanitizer: DomSanitizer, private iconsService: BakeryIconsService) {
    this.icons = this.iconsService.getAllIcons();
  }

  get iconSvg(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getIconSvg());
  }

  private getIconSvg() {
    if (!this.name) {
      throw new Error('required property name is missing');
    }
    if (!this.icons.has(this.name)) {
      throw new Error(`invalid icon name: ${this.name}`);
    }

    const icon = this.icons.get(this.name);
    return icon.getContent({ fill: 'currentColor' });
  }
}
