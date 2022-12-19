import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconRegistry } from '@gradii/triangle/icon';

@Component({
  selector       : 'pf-layout-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls      : ['./layout-type.component.scss'],
  template       : `
    <div class="layout-icon" [class.active]="isActive(type)"
         *ngFor="let type of types"
         (click)="layoutTypeChange.emit({ header: type.header, sidebar: type.sidebar })"
    >
      <tri-icon [svgIcon]="type.icon"></tri-icon>
    </div>
  `
})
export class LayoutTypeComponent {
  @Input() header: boolean;
  @Input() sidebar: boolean;

  @Output() layoutTypeChange: EventEmitter<{ header: boolean; sidebar: boolean }> = new EventEmitter();

  types = [
    {
      header : false,
      sidebar: false,
      icon   : 'reiki:layout-space',
    },
    {
      header : false,
      sidebar: true,
      icon   : 'reiki:layout-sidebar',
    },
    {
      header : true,
      sidebar: false,
      icon   : 'reiki:layout-navbar',
    },
    {
      header : true,
      sidebar: true,
      icon   : 'reiki:layout-sidebar-navbar',
    }
  ];

  constructor(private iconRegistry: IconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconInNamespace('reiki', 'layout-navbar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/layout/navbar.svg'));
    iconRegistry.addSvgIconInNamespace('reiki', 'layout-sidebar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/layout/sidebar.svg'));
    iconRegistry.addSvgIconInNamespace('reiki', 'layout-sidebar-navbar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/layout/sidebar-navbar.svg'));
    iconRegistry.addSvgIconInNamespace('reiki', 'layout-space',
      sanitizer.bypassSecurityTrustResourceUrl('assets/layout/space.svg'));
  }

  isActive(type): boolean {
    return type.header === this.header && type.sidebar === this.sidebar;
  }

  // getTypeSrc(type): string {
  //   return type.header === this.header && type.sidebar === this.sidebar ? type.activeSrc : type.src;
  // }
}
