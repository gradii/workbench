import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector       : 'kitchen-no-items',
  styleUrls      : ['./no-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <p class="caption-2">{{ message }}</p>
    <a *ngIf="link" [href]="link" target="_blank" triButton size="small" color="success">{{ linkCaption }}</a>
  `
})
export class NoItemsComponent {
  @Input() link: string;
  @Input() linkCaption: string;
  @Input() message: string;
}
