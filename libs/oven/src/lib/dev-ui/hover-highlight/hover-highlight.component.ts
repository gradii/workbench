import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { VirtualComponent } from '../../model';
import { isSpace } from '../util';

@Component({
  selector: 'oven-hover-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./hover-highlight.component.scss'],
  template: ``
})
export class HoverHighlightComponent {
  @HostBinding('style.width.px') width: number;
  @HostBinding('style.height.px') height: number;

  @HostBinding('class.component') get isComponent(): boolean {
    return !isSpace(this.virtualComponent);
  }

  @HostBinding('class.space') get isSpace(): boolean {
    return isSpace(this.virtualComponent);
  }

  virtualComponent: VirtualComponent;
}
