import { Directive, ElementRef, forwardRef, OnDestroy, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { RenderState } from '../../../state/render-state.service';
import { EditableTextService } from './editable-text.service';

enum TextMode {
  PREVIEW = 0,
  EDITABLE = 1,
}

@Directive({
  selector: '[ovenText]',
  providers: [
    EditableTextService,
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextDirective), multi: true }
  ]
})
export class TextDirective implements ControlValueAccessor, OnDestroy {
  readonly textChange$: Observable<string>;
  readonly editMode$: Observable<boolean>;

  private mode: TextMode = TextMode.PREVIEW;

  private onChange: (value: string) => void;
  private onTouched: () => void;

  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private renderState: RenderState,
    private editableTextService: EditableTextService
  ) {
    this.editableTextService.init(el, renderer);
    this.init();
    this.editMode$ = this.editableTextService.editMode$;
    this.textChange$ = this.editableTextService.textChange$;
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  writeValue(value: string) {
    const escapedValue = this.escapeHtml(value);
    if (this.mode === TextMode.EDITABLE) {
      this.editableTextService.writeValue(escapedValue);
    }
    if (this.mode === TextMode.PREVIEW) {
      this.el.nativeElement.innerHTML = escapedValue;
    }
  }

  registerOnChange(onChange: (value: string) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  private init() {
    this.renderState.showDevUI$
      .pipe(
        map(showDevUI => this.getMode(showDevUI)),
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      )
      .subscribe((newMode: TextMode) => {
        if (this.mode === TextMode.EDITABLE) {
          this.editableTextService.detach();
        }
        if (newMode === TextMode.EDITABLE) {
          this.editableTextService.attach();
        }
        this.mode = newMode;
      });
  }

  private getMode(showDevUI: boolean): TextMode {
    if (showDevUI) {
      return TextMode.EDITABLE;
    }
    if (!showDevUI) {
      return TextMode.PREVIEW;
    }
  }

  private escapeHtml(str: string, attr = false): string {
    if (!str) {
      return str;
    }
    str = str
      // Temporal comment for making angular-like expression working in generated code
      // Following 4 lines wrap { and } symbols into {{'{'}} and {{'}'}} accordingly.
      // .replace(new RegExp('{', 'g'), open_curly)
      // .replace(new RegExp('}', 'g'), close_curly)
      // .replace(new RegExp(unique_open_curly_replacer, 'g'), '{')
      // .replace(new RegExp(unique_close_curly_replacer, 'g'), '}')
      .replace(new RegExp('<', 'g'), '&lt;')
      .replace(new RegExp('>', 'g'), '&gt;');
    if (attr) {
      str = str.replace(new RegExp('"', 'g'), '&quot;');
    }
    return str;
  }
}
