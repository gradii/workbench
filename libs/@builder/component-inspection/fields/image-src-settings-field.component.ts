import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActiveBreakpointProvider, FileUtilService, ImageConverter, KitchenImageSrc } from '@common/public-api';
import { TriTabGroup } from '@gradii/triangle/tabs';

import { PuffComponent } from '@tools-state/component/component.model';
import { ImageUploadError } from '@tools-state/image/image.actions';
import { ConfirmWindowService } from '@tools-state/util/confirm-window.service';
import { ImageService } from '@tools-state/util/image.service';
import { filter } from 'rxjs/operators';

@Component({
  selector       : 'ub-image-src-settings-field',
  styleUrls      : ['./field.scss', './image-src-settings-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div [class.no-top-margin]="noTopMargin" class="inner-field">
      <tri-tab-group (changeTab)="changeSrcTab($event)"
                     selectedIndex="value?.active === 'upload' ? 0 : 1"
                     class="icon-tabs image-settings-tabs with-underline">
        <tri-tab class="upload">
          <ng-template triTabLabel>
            <tri-icon svgIcon="eva:upload-outline"></tri-icon>
            Upload
          </ng-template>
          <input #fileInput class="image-file-input" type="file" accept="image/*" (change)="uploadImage($event)" />

          <div class="download-container">
            <div class="image-loaded-item">
              <span class="name" [class.without-name]="!value?.name" (click)="fileInput.click()">
                {{value.name || 'No file chosen'}}</span>
              <button
                triButton
                ghost
                class="delete-image"
                *ngIf="value?.name"
                (click)="removeUploadedImage()"
                size="xsmall"
              >
                <tri-icon svgIcon="outline:trash"></tri-icon>
              </button>
            </div>
            <button triButton class="add-image-button" ghost size="small" (click)="fileInput.click()">
              <tri-icon svgIcon="outline:upload"></tri-icon>
            </button>
          </div>

          <div *ngIf="error" class="error">{{ error }}</div>
        </tri-tab>

        <tri-tab class="url">
          <ng-template triTabLabel>
            <tri-icon svgIcon="eva:link-2-outline"></tri-icon>
            URL
          </ng-template>
          <ub-data-field
            syntax="text"
            [noLabel]="true"
            [oneLine]="true"
            [resizable]="false"
            [component]="component"
            [value]="value?.url"
            (valueChange)="updateImage({ url: $event })"
          >
          </ub-data-field>
        </tri-tab>
      </tri-tab-group>
    </div>
  `
})
export class ImageSrcSettingsFieldComponent implements OnInit {
  @Input() value: KitchenImageSrc;
  @Input() parentComponentId: string;
  @Input() noTopMargin: boolean;
  @Input() component: PuffComponent;
  @Output() valueChange: EventEmitter<KitchenImageSrc> = new EventEmitter<KitchenImageSrc>();

  @ViewChild(TriTabGroup) tabGroup: TriTabGroup;

  error: string;
  tabsInitiated: boolean;

  constructor(
    private converter: ImageConverter,
    private imageService: ImageService,
    private confirmWindowService: ConfirmWindowService,
    private activeBreakpointProvider: ActiveBreakpointProvider,
    private fileUtilService: FileUtilService
  ) {
  }

  ngOnInit() {
    this.imageService.uploadError
      .pipe(filter((data: ImageUploadError) => data.compIds.includes(this.component.id)))
      .subscribe((data: ImageUploadError) => {
        this.error = data.error;
        this.updateImage({
          uploadUrl: '',
          name     : ''
        });
      });
  }

  updateImage(image: Partial<KitchenImageSrc>) {
    this.valueChange.emit({ ...this.value, ...image });
  }

  uploadImage($event: Event) {
    this.error                     = '';
    const target: HTMLInputElement = <HTMLInputElement>$event.target;
    const file: File               = target.files[0];

    // Reset input because `onchange` doesn't work when choose same file twice
    target.value = '';

    if (!file) {
      return;
    }

    if (!this.imageService.validFileType(file.type)) {
      this.imageService.rejectUploadImage('File is not a valid image', [this.component.id]);
      return;
    }

    // Check max file upload
    if (!this.fileUtilService.checkMaxImageSize(file.size)) {
      this.imageService.rejectUploadImage('Exceeded max upload 5MB size', [this.component.id]);
      return;
    }

    // Activate browser window confirm on page close while picture loading
    this.confirmWindowService.enableConfirmClosingPage();

    this.imageService.uploadImage(
      file,
      file.name,
      this.component.id,
      this.activeBreakpointProvider.getActiveBreakpoint()
    );

    // Convert and emit
    this.converter.convertImageToBase64(file, file.type, (url: string) => {
      if (this.error) {
        return;
      }
      this.updateImage({
        uploadUrl: url,
        name     : file.name
      });
    });
  }

  changeSrcTab($event: any) {
    // We need skip first `changeTab` event because it's emitted when tabs are rendered
    // But it calls updateComponent() after createComponent() and we have 2 history actions
    if (!this.tabsInitiated) {
      this.tabsInitiated = true;
      return;
    }
    this.updateImage({ active: $event.tabTitle.toLowerCase() });
  }

  removeUploadedImage() {
    this.error = '';
    this.updateImage({
      uploadUrl: '',
      name     : ''
    });
  }
}
