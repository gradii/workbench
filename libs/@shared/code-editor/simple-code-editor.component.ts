import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorConfiguration, EditorFromTextArea, fromTextArea } from 'codemirror';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import 'codemirror/mode/htmlmixed/htmlmixed';

type HTMLEditorMode = 'htmlmixed';

interface CodeEditorMode {
  name: 'string' | 'javascript';
  json: boolean;
  typescript: boolean;
}

type EditorMode = HTMLEditorMode | CodeEditorMode;

@Component({
  selector: 'ub-simple-code-editor',
  template: ` <textarea #textArea></textarea> `,
  styleUrls: ['./simple-code-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SimpleCodeEditorComponent)
    }
  ]
})
export class SimpleCodeEditorComponent implements AfterViewInit, ControlValueAccessor {
  @Input() private text = '';

  @Input() syntax: 'ts' | 'json' | 'text' | 'html' = 'ts';

  @Input() lineNumbers = true;

  @HostBinding('class.readonly') @Input() readonly = false;

  @ViewChild('textArea') textArea: ElementRef<HTMLTextAreaElement>;

  @Input() theme = 'ayu-mirage';

  private baseEditorOptions: EditorConfiguration = { indentUnit: 2 };
  private editor: EditorFromTextArea;

  private destroy$ = new Subject<void>();

  ngAfterViewInit() {
    this.createEditor();
    this.editor.setValue(this.text);
    this.observeEditorVisibility();
  }

  writeValue(value: string): void {
    const oldText = this.text;
    this.text = value || '';
    if (!this.editor || oldText === this.text) {
      return;
    }
    this.editor.setValue(this.text);
  }

  onTouched: () => void = () => {
  };

  onChange: (result: string) => any = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private createEditor() {
    this.editor = fromTextArea(this.textArea.nativeElement, this.getEditorOptions());
    this.editor.on('change', () => this.handleTextChange());
  }

  private handleTextChange() {
    this.text = this.editor.getValue();
    this.onChange(this.text);
  }

  private getEditorOptions(): EditorConfiguration {
    const mode = this.resolveEditorMode();

    return {
      ...this.baseEditorOptions,
      theme: this.theme,
      lineNumbers: this.lineNumbers,
      mode,
      readOnly: this.readonly,
      cursorBlinkRate: this.readonly ? -1 : 530
    };
  }

  private observeEditorVisibility() {
    let isVisible = false;
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const previousVisibilityState = isVisible;
      isVisible = entries.every(e => e.intersectionRatio > 0);
      if (isVisible && previousVisibilityState !== isVisible) {
        this.editor.refresh();
      }
    });
    observer.observe(this.editor.getWrapperElement());
    this.destroy$.pipe(take(1)).subscribe(() => observer.disconnect());
  }

  private resolveEditorMode(): EditorMode {
    const name = this.syntax === 'text' ? 'string' : 'javascript';
    if (this.syntax === 'html') {
      return 'htmlmixed';
    }

    return { name, json: this.syntax === 'json', typescript: this.syntax === 'ts' };
  }
}
