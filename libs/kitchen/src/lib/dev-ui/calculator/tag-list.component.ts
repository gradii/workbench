import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'kitchen-tag-list',
  styleUrls: ['./tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

  `
})
export class TagListComponent {
  @Input() message: string;
}
