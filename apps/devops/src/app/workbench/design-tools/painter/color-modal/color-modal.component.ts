import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColorInputSource } from '@common';

import { ColorChange } from '@tools-state/theme/theme.models';

@Component({
  selector: 'len-color-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-modal.component.html',
  styleUrls: ['./color-modal.component.scss']
})
export class ColorModalComponent {
  @Input() color: string;
  @Input() includeLogo: boolean;

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() submit: EventEmitter<ColorChange> = new EventEmitter<ColorChange>();

  source: ColorInputSource;
  logo: string;

  updateColor(color: string, source: string, logo: string) {
    this.color = color;
    this.source = source as ColorInputSource;
    this.logo = logo;
  }

  done() {
    const colorChange: ColorChange = { inputSource: this.source, color: this.color };
    if (this.logo) {
      colorChange.logo = this.logo;
    }
    this.submit.emit(colorChange);
  }
}
