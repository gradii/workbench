import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AclService, PlatformDetectorService } from '@common/public-api';

import { MetaDefinition } from '../../definitions/definition';
import { Observable } from 'rxjs';

@Component({
  selector: 'kitchen-widget-list',
  styleUrls: ['./widget-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kitchen-widget-item
      *ngFor="let definition of definitionList"
      tabindex="0"
      [definition]="definition"
      [locked]="!(canAddWidget(definition) | async)"
      (keyup.enter)="select.emit(definition)"
      (click)="select.emit(definition)"
    >
    </kitchen-widget-item>

    <kitchen-no-items
      *ngIf="definitionList?.length === 0"
      link="https://google.com"
      linkCaption="Request Widget"
      message="No widgets found."
    >
    </kitchen-no-items>
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
