import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'oven-drop-placeholder',
  styles: [
    `
      :host {
        display: block;
        user-select: none;
        background-color: #1e89ef;
        margin: auto;
        border-radius: 2px;
        transition: opacity 0.2s;
      }
    `
  ],
  template: ''
})
export class DropPlaceholderComponent {
  @Input()
  @HostBinding('style.height.px')
  height: number;

  @Input()
  @HostBinding('style.width.px')
  width: number;
}
