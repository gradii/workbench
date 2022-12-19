import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { InsertComponentPosition } from '@common/public-api';
import { spaceMetaDefinition } from '../../definitions/components-definitions/space/space-definition.module';

import { FlourComponent } from '../../model';
import { RenderState } from '../../state/render-state.service';

@Component({
  selector: 'kitchen-split-space-button',
  styleUrls: ['./split-space.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="icon-button">
      <tri-icon svgIcon="workbench:dev-ui-split-plus"></tri-icon>
    </button>
  `
})
export class SplitSpaceComponent {
  @Input() virtualComponent: FlourComponent;
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
