import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { ImageColorService } from './image-color.service';

@Component({
  selector: 'ub-color-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./color-logo.component.scss'],
  template: `
    <button nbButton ghost class="basic upload-button" (click)="imageInput.click()">
      <nb-icon icon="download"></nb-icon>
      Upload image
    </button>
    <div
      class="logo"
      [class.active]="fileOver"
      (drop)="onDrop($event)"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
    >
      <nb-icon *ngIf="!image" class="upload-icon" icon="download" (click)="imageInput.click()"></nb-icon>
      <img *ngIf="image" [src]="image" />
    </div>
    <div *ngIf="error" class="error">
      Failed to read image, please try again.
    </div>
    <span *ngIf="extractedColorList" class="color-label">Choose a color from theme logo palette</span>
    <div *ngIf="extractedColorList" class="color-block">
      <ub-color-preview
        *ngFor="let extractedColor of extractedColorList"
        [editable]="true"
        [color]="extractedColor"
        [active]="color === extractedColor"
        (click)="colorChange.emit({ color: extractedColor, logo: image })"
      ></ub-color-preview>
    </div>
    <input #imageInput class="hidden-input" type="file" (change)="readURL($event)" />
  `
})
export class ColorLogoComponent implements OnDestroy {
  @Input() color: string;

  @Output() colorChange: EventEmitter<{ color: string; logo: string }> = new EventEmitter<{
    color: string;
    logo: string;
  }>();

  fileOver = false;
  extractedColorList: string[];
  image: string;
  error: boolean;

  private destroyed: Subject<void> = new Subject<void>();

  constructor(private imageColorService: ImageColorService, private cd: ChangeDetectorRef) {
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  readURL(event: Event): void {
    const target: HTMLInputElement = <HTMLInputElement>event.target;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      this.readFile(file);
    }
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files) {
      const file = event.dataTransfer.files[0];
      this.readFile(file);
    }
  }

  onDragOver(event: Event) {
    event.preventDefault();
    this.fileOver = true;
  }

  onDragLeave() {
    this.fileOver = false;
  }

  private readFile(file) {
    const fr = new FileReader();
    fr.onload = () => {
      this.image = fr.result.toString();
      this.updateColors();
    };
    fr.readAsDataURL(file);
  }

  private updateColors() {
    this.error = false;
    this.imageColorService
      .detectColors(this.image)
      .pipe(
        takeUntil(this.destroyed),
        catchError(() => of(null))
      )
      .subscribe((colors: string[]) => {
        if (colors) {
          this.extractedColorList = colors;
          this.colorChange.emit({ color: colors[0], logo: this.image });
        } else {
          this.image = null;
          this.error = true;
          this.extractedColorList = null;
        }
        this.cd.detectChanges();
      });
  }
}
