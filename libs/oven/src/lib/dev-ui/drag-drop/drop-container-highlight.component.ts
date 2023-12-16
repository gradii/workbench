import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'oven-drop-placeholder',
  styles: [
    `
      :host {
        display: block;
        user-select: none;
        background-color: rgba(30, 137, 239, 0.1);
        border: 1px solid #1e89ef;
        border-radius: 2px;
        transition: opacity 0.2s;
        pointer-events: none;
      }
    `
  ],
  template: ''
})
export class DropContainerHighlightComponent {
  @Input()
  @HostBinding('style.height.px')
  height: number;

  @Input()
  @HostBinding('style.width.px')
  width: number;
}
