import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ub-layout-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./layout-type.component.scss'],
  template: `
    <img
      *ngFor="let type of types"
      [src]="getTypeSrc(type)"
      (click)="layoutTypeChange.emit({ header: type.header, sidebar: type.sidebar })"
    />
  `
})
export class LayoutTypeComponent {
  @Input() header: boolean;
  @Input() sidebar: boolean;

  @Output() layoutTypeChange: EventEmitter<{ header: boolean; sidebar: boolean }> = new EventEmitter();

  types = [
    {
      header: false,
      sidebar: false,
      src: 'assets/layout/space.svg',
      activeSrc: 'assets/layout/space-active.svg'
    },
    {
      header: false,
      sidebar: true,
      src: 'assets/layout/sidebar.svg',
      activeSrc: 'assets/layout/sidebar-active.svg'
    },
    {
      header: true,
      sidebar: false,
      src: 'assets/layout/navbar.svg',
      activeSrc: 'assets/layout/navbar-active.svg'
    },
    {
      header: true,
      sidebar: true,
      src: 'assets/layout/sidebar-navbar.svg',
      activeSrc: 'assets/layout/sidebar-navbar-active.svg'
    }
  ];

  getTypeSrc(type): string {
    return type.header === this.header && type.sidebar === this.sidebar ? type.activeSrc : type.src;
  }
}
