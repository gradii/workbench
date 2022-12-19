import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Theme } from '@common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'len-theme-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-item.component.scss'],
  template: `
    <len-theme-preview [theme]="theme" (click)="previewClick.emit($event)"></len-theme-preview>
    <div class="description">
      <span class="theme-name">{{ theme.name }}</span>
      <div *ngIf="actions" class="action-container">
        <button triButton ghost size="tiny" class="basic" (click)="editClick.emit($event)">
          <tri-icon svgIcon="outline:edit"></tri-icon>
        </button>
        <button
          *ngIf="actions"
          triButton
          ghost
          size="tiny"
          class="basic"
          (click)="actionClick($event)"
        >
          <nb-icon icon="more-vertical"></nb-icon>
        </button>
      </div>
    </div>
  `
})
export class ThemeItemComponent implements OnInit, OnDestroy {
  @Input() theme: Theme;
  @Input() actions: boolean;
  @Input() canBeDeleted: boolean;

  @Output() rename: EventEmitter<void> = new EventEmitter<void>();
  @Output() previewClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() editClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();

  get menuItems(): { title: string }[] {
    const items: { title: string }[] = [{ title: 'Rename' }];
    if (this.canBeDeleted) {
      items.push({ title: 'Delete' });
    }
    return items;
  }

  get menuTag(): string {
    return `theme-item-menu-${this.theme.id}`;
  }

  private destroyed: Subject<void> = new Subject<void>();

  constructor(/*private nbMenuService: NbMenuService*/) {
  }

  ngOnInit() {
    // this.nbMenuService
    //   .onItemClick()
    //   .pipe(
    //     filter(({ tag }) => tag === this.menuTag),
    //     takeUntil(this.destroyed)
    //   )
    //   .subscribe((data: { item: { title: string } }) => {
    //     if (data.item.title === 'Rename') {
    //       this.rename.emit();
    //     }
    //     if (data.item.title === 'Delete') {
    //       this.delete.emit();
    //     }
    //   });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  actionClick(event: Event) {
    event.stopPropagation();
    // this.contextMenu.show();
  }
}
