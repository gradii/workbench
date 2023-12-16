import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AclService, PlatformDetectorService } from '@common';

import { MetaDefinition } from '../../definitions/definition';
import { Observable } from 'rxjs';

@Component({
  selector: 'oven-widget-list',
  styleUrls: ['./widget-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-widget-item
      *ngFor="let definition of definitionList"
      tabindex="0"
      [definition]="definition"
      [locked]="!(canAddWidget(definition) | async)"
      (keyup.enter)="select.emit(definition)"
      (click)="select.emit(definition)"
    >
    </oven-widget-item>

    <oven-no-items
      *ngIf="definitionList?.length === 0"
      link="https://forms.gle/AC4rTHYah4TExbB27"
      linkCaption="Request Widget"
      message="No widgets found."
    >
    </oven-no-items>
  `
})
export class WidgetListComponent {
  @Input() definitionList: MetaDefinition[];

  @Output() select = new EventEmitter<MetaDefinition>();

  constructor(private platformDetector: PlatformDetectorService, private acl: AclService) {
  }

  @HostBinding('class.wide-scrollbar') get wideScrollbar(): boolean {
    // Setup wide scrollbar for edge and firefox on windows.
    return this.platformDetector.isWindows() && (this.platformDetector.ifEdge() || this.platformDetector.isFirefox());
  }

  canAddWidget(metaDefinition: MetaDefinition): Observable<boolean> {
    return this.acl.canAddWidget(metaDefinition.name);
  }
}
