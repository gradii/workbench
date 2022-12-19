import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlourComponent } from '../../model';
import { isSpace } from '../util';

@Component({
  selector       : 'kitchen-hover-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./hover-highlight.component.scss'],
  template       : ``,
  host           : {
    '[style.width.px]' : 'width',
    '[style.height.px]': 'height',
    '[class.component]': 'isComponent',
    '[class.space]'    : 'isSpace'
  }
})
export class HoverHighlightComponent {
  width: number;
  height: number;

  get isComponent(): boolean {
    return !isSpace(this.flourComponent);
  }

  get isSpace(): boolean {
    return isSpace(this.flourComponent);
  }

  flourComponent: FlourComponent;
}
