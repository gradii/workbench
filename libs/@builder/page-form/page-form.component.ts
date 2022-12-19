import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { UntypedFormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { COMMON_NAME_PATTERN } from '@common/public-api';
import { takeWhile } from 'rxjs/operators';

import { Page } from '@tools-state/page/page.model';
import { UniquePageNameValidator, UniquePageUrlValidator } from './page.validators';

@Component({
  selector: 'ub-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
  providers: [UniquePageNameValidator, UniquePageUrlValidator],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageFormComponent implements OnInit, OnDestroy {
  @Input() formTitle: string;
  @Input() showImport: boolean;
  @Input() buttonLabel: string;
  @Input() pages: Page[];

  @Input() set page(page: Partial<Page>) {
    this.urlTouched = true;
    this.uniquePageNameValidator.setIgnoreActive(!!page.id);
    this.uniquePageUrlValidator.setIgnoreActive(!!page.id);
    this.pageForm.patchValue({
      name: page.name,
      url: page.url,
      parentPageId: page.parentPageId
    });
  }

  @Output() importPage = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() submitPage = new EventEmitter<Partial<Page>>();

  @ViewChild('formElement', { static: true }) formElement: FormGroupDirective;
  @ViewChild('nameInput', { static: true }) nameInput: ElementRef;

  pageForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        // only words number and spaces, should starts from char
        Validators.pattern(COMMON_NAME_PATTERN)
      ],
      [this.uniquePageNameValidator]
    ],
    url: ['', [Validators.required, Validators.pattern(/^\w+[\w-]*$/)], [this.uniquePageUrlValidator]],
    parentPageId: ''
  });

  private urlTouched = false;
  private alive = true;

  constructor(
    private fb: UntypedFormBuilder,
    private uniquePageNameValidator: UniquePageNameValidator,
    private uniquePageUrlValidator: UniquePageUrlValidator
  ) {
  }

  ngOnInit() {
    this.pageForm.controls.name.valueChanges
      .pipe(takeWhile(() => this.alive && !this.urlTouched))
      .subscribe(name => this.pageForm.patchValue({ url: this.makeUrlFromName(name) }));
    this.nameInput.nativeElement.focus();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onSubmit() {
    if (this.pageForm.valid) {
      this.submitPage.emit(this.pageForm.value);
    }
  }

  detachUrlFromName() {
    this.urlTouched = true;
  }

  isFieldInvalid(name): boolean {
    return this.formElement.submitted && this.pageForm.controls[name].invalid;
  }

  isFieldHasError(name, errorName): boolean {
    return this.pageForm.controls[name].errors[errorName];
  }

  private makeUrlFromName(name) {
    return name.replace(/\s+/g, '-');
  }
}
