import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { isSpace } from '../util';
import { VirtualComponent } from '../../model';

@Component({
  selector: 'oven-select-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./select-highlight.component.scss'],
  template: ``
})
export class SelectHighlightComponent {
  @HostBinding('style.width.px') width: number;
  @HostBinding('style.height.px') height: number;

  @HostBinding('class.component') get isComponent(): boolean {
    return !isSpace(this.virtualComponent);
  }

  @HostBinding('class.space-highlight') get isSpace(): boolean {
    return isSpace(this.virtualComponent);
  }

  virtualComponent: VirtualComponent;

  @HostBinding('class.editable') editable: boolean;
}
