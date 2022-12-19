import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlourComponent } from '../../model';
import { isSpace } from '../util';

@Component({
  selector       : 'kitchen-select-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./select-highlight.component.scss'],
  template       : ``,
  host           : {
    '[style.width.px]'       : 'width',
    '[style.height.px]'      : 'height',
    '[class.component]'      : 'isComponent',
    '[class.space-highlight]': 'isSpace',
    '[class.editable]'       : 'editable'
  }
})
export class SelectHighlightComponent {
  width: number;
  height: number;

  get isComponent(): boolean {
    return !isSpace(this.virtualComponent);
  }

  get isSpace(): boolean {
    return isSpace(this.virtualComponent);
  }

  virtualComponent: FlourComponent | FlourComponent;

  editable: boolean;
}
