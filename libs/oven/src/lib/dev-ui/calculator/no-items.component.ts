import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'oven-no-items',
  styleUrls: ['./no-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="caption-2">{{ message }}</p>
    <a [href]="link" target="_blank" nbButton size="small" status="success">{{ linkCaption }}</a>
  `
})
export class NoItemsComponent {
  @Input() link: string;
  @Input() linkCaption: string;
  @Input() message: string;
}
