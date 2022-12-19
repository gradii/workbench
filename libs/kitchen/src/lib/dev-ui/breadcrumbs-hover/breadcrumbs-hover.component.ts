import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector       : 'kitchen-breadcrumbs-hover-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./breadcrumbs-hover.component.scss'],
  template       : ``,
  host           : {
    '[style.width.px]' : 'width',
    '[style.height.px]': 'height'
  }
})
export class BreadcrumbsHoverComponent {
  width: number;
  height: number;
}
