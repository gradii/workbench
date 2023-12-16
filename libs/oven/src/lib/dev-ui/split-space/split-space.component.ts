import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { InsertComponentPosition } from '@common';

import { VirtualComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';
import { spaceMetaDefinition } from '../../definitions/components-definitions/space/space-definition.module';

@Component({
  selector: 'oven-split-space-button',
  styleUrls: ['./split-space.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="icon-button">
      <bc-icon name="dev-ui-split-plus"></bc-icon>
    </button>
  `
})
export class SplitSpaceComponent {
  @Input() virtualComponent: VirtualComponent;
  @Input() position: InsertComponentPosition;

  constructor(private renderState: RenderState) {
  }

  @HostListener('click')
  split() {
    const index = this.resolveIndex();
    this.renderState.cloneSpace(
      this.virtualComponent.parentComponent,
      spaceMetaDefinition,
      index,
      this.virtualComponent.component
    );
  }

  private resolveIndex(): number {
    if (this.position === InsertComponentPosition.BEFORE) {
      return this.virtualComponent.index;
    }

    return this.virtualComponent.index + 1;
  }
}
