import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { NB_WINDOW, NbTabsetComponent } from '@nebular/theme';
import { ActiveBreakpointProvider, FileUtilService, ImageConverter, OvenImageSrc } from '@common';

import { BakeryComponent } from '@tools-state/component/component.model';
import { ImageService } from '@tools-state/util/image.service';
import { ConfirmWindowService } from '@tools-state/util/confirm-window.service';
import { ImageUploadError } from '@tools-state/image/image.actions';

@Component({
  selector: 'ub-image-src-settings-field',
  styleUrls: ['./field.scss', './image-src-settings-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class.no-top-margin]="noTopMargin" class="inner-field">
      <nb-tabset (changeTab)="changeSrcTab($event)" class="icon-tabs image-settings-tabs with-underline">
        <nb-tab [active]="value?.active === 'upload'" class="upload" tabTitle="Upload" tabIcon="upload-outline">
          <input #fileInput class="image-file-input" type="file" accept="image/*" (change)="uploadImage($event)" />

          <div class="download-container">
            <div class="image-loaded-item">
              <span class="name" [class.without-name]="!value?.name" (click)="fileInput.click()">{{
                value.name || 'No file chosen'
              }}</span>
              <button
                nbButton
                ghost
                class="delete-image"
                *ngIf="value?.name"
                (click)="removeUploadedImage()"
                size="tiny"
              >
                <nb-icon [icon]="'trash-2'"></nb-icon>
              </button>
            </div>
            <button nbButton class="add-image-button" ghost size="small" (click)="fileInput.click()">
              <nb-icon icon="upload-outline"></nb-icon>
            </button>
          </div>

          <div *ngIf="error" class="error">{{ error }}</div>
        </nb-tab>

        <nb-tab [active]="value?.active === 'url'" class="url" tabTitle="URL" tabIcon="link-2-outline">
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
        </nb-tab>
      </nb-tabset>
    </div>
  `
})
export class ImageSrcSettingsFieldComponent implements OnInit {
  @Input() value: OvenImageSrc;
  @Input() parentComponentId: string;
  @Input() noTopMargin: boolean;
  @Input() component: BakeryComponent;
  @Output() valueChange: EventEmitter<OvenImageSrc> = new EventEmitter<OvenImageSrc>();

  @ViewChild(NbTabsetComponent) tabSet: NbTabsetComponent;

  error: string;
  tabsInitiated: boolean;

  constructor(
    private converter: ImageConverter,
    @Inject(NB_WINDOW) private window,
    private imageService: ImageService,
    private cd: ChangeDetectorRef,
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
          name: ''
        });
      });
  }

  updateImage(image: Partial<OvenImageSrc>) {
    this.valueChange.emit({ ...this.value, ...image });
  }

  uploadImage($event: Event) {
    this.error = '';
    const target: HTMLInputElement = <HTMLInputElement>$event.target;
    const file: File = target.files[0];

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
        name: file.name
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
      name: ''
    });
  }
}
