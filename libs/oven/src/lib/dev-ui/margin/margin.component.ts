import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { isSpace } from '../util';
import { VirtualComponent } from '../../model';

@Component({
  selector: 'oven-margin',
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

  virtualComponent: VirtualComponent;

  @HostBinding('class.editable') editable: boolean;
}
