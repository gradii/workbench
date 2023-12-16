import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'oven-breadcrumbs-hover-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./breadcrumbs-hover.component.scss'],
  template: ``
})
export class BreadcrumbsHoverComponent {
  @HostBinding('style.width.px') width: number;
  @HostBinding('style.height.px') height: number;
}
