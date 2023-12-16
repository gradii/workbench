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
import { NbContextMenuDirective, NbMenuService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ub-theme-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./theme-item.component.scss'],
  template: `
    <ub-theme-preview [theme]="theme" (click)="previewClick.emit($event)"></ub-theme-preview>
    <div class="description">
      <span class="theme-name">{{ theme.name }}</span>
      <div *ngIf="actions" class="action-container">
        <button nbButton ghost size="tiny" class="basic" (click)="editClick.emit($event)">
          <nb-icon icon="edit"></nb-icon>
        </button>
        <button
          *ngIf="actions"
          nbButton
          ghost
          size="tiny"
          class="basic"
          [nbContextMenu]="menuItems"
          (click)="actionClick($event)"
          [nbContextMenuTag]="menuTag"
          nbContextMenuAdjustment="vertical"
          nbContextMenuPlacement="bottom-right"
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
  @ViewChild(NbContextMenuDirective) contextMenu: NbContextMenuDirective;

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

  constructor(private nbMenuService: NbMenuService) {
  }

  ngOnInit() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === this.menuTag),
        takeUntil(this.destroyed)
      )
      .subscribe((data: { item: { title: string } }) => {
        if (data.item.title === 'Rename') {
          this.rename.emit();
        }
        if (data.item.title === 'Delete') {
          this.delete.emit();
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  actionClick(event: Event) {
    event.stopPropagation();
    this.contextMenu.show();
  }
}
