import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PlatformDetectorService } from '@common/public-api';

import { MetaDefinition } from '../../definitions/definition';

@Component({
  selector       : 'kitchen-component-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <kitchen-component-item
      *ngFor="let definition of definitionList"
      tabindex="0"
      [definition]="definition"
      (keyup.enter)="select.emit(definition)"
      (click)="select.emit(definition)"
    >
    </kitchen-component-item>

    <kitchen-no-items
      *ngIf="definitionList?.length === 0"
      linkCaption="Request Component"
      message="No components found."
    >
    </kitchen-no-items>
  `,
  styleUrls      : ['./component-list.component.scss']
})
export class ComponentListComponent {
  @Input() definitionList: MetaDefinition[];

  @Output() select = new EventEmitter<MetaDefinition>();

  constructor(private platformDetector: PlatformDetectorService) {
  }
}
