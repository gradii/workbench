import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { isSpace } from '../util';
import { FlourComponent } from '../../model';

@Component({
  selector: 'kitchen-margin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./margin.component.scss'],
  template: ``
})
export class MarginComponent {
  @HostBinding('style.width.px') width: number;
  @HostBinding('style.height.px') height: number;

  @HostBinding('class.component') get isComponent(): boolean {
    return !isSpace(this.virtualComponent);
  }

  @HostBinding('class.space') get isSpace(): boolean {
    return isSpace(this.virtualComponent);
  }

  virtualComponent: FlourComponent;

  @HostBinding('class.editable') editable: boolean;
}
