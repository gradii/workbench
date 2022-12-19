import { ChangeDetectorRef, Component, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'len-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements ControlValueAccessor {
  @Input() title = '';
  @Input() description = '';
  @Input() acceptMimeTypes: string[] = [];

  file: File | null = null;

  get accept() {
    return this.acceptMimeTypes.join(', ');
  }

  onTouched: Function = () => {
  };
  private onChange: Function = () => {
  };

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.handleFileChange(file);
  }

  constructor() {
  }

  writeValue(value: null) {
    this.file = null;
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  private handleFileChange(file: File) {
    if (!file) {
      return;
    }

    this.onChange(file);
  }
}
