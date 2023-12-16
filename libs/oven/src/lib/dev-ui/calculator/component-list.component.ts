import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PlatformDetectorService } from '@common';

import { MetaDefinition } from '../../definitions/definition';

@Component({
  selector: 'oven-component-list',
  styleUrls: ['./component-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <oven-component-item
      *ngFor="let definition of definitionList"
      tabindex="0"
      [definition]="definition"
      (keyup.enter)="select.emit(definition)"
      (click)="select.emit(definition)"
    >
    </oven-component-item>

    <oven-no-items
      *ngIf="definitionList?.length === 0"
      link="https://forms.gle/yxT2ERgUxYf8rFWt7"
      linkCaption="Request Component"
      message="No components found."
    >
    </oven-no-items>
  `
})
export class ComponentListComponent {
  @Input() definitionList: MetaDefinition[];

  @Output() select = new EventEmitter<MetaDefinition>();

  constructor(private platformDetector: PlatformDetectorService) {
  }

  @HostBinding('class.wide-scrollbar') get wideScrollbar(): boolean {
    // Setup wide scrollbar for edge and firefox on windows.
    return this.platformDetector.isWindows() && (this.platformDetector.ifEdge() || this.platformDetector.isFirefox());
  }
}
