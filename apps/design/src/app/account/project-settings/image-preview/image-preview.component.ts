import { Component, OnInit, Input } from '@angular/core';

interface PreviewSize {
  width: number;
  height: number;
}

@Component({
  selector: 'ub-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {
  @Input() src = '';
  @Input() previewSize: PreviewSize = { width: 32, height: 32 };
  @Input() previewWrapperSize: PreviewSize = { width: 80, height: 80 };
}
