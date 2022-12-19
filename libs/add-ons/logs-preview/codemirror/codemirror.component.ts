import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'dp-codemirror',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodemirrorComponent),
      multi: true,
    },
  ],
  template: `<textarea name="codemirror" #hostContainer></textarea>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodemirrorComponent implements AfterViewInit, ControlValueAccessor {

  // codemirror配置项
  @Input() options: any;
  // 编辑器是否聚焦
  @Output() focusChange = new EventEmitter<boolean>();
  // 当光标或选区移动或对编辑器内容进行任何更改时，将触发该事件。
  @Output() cursorActivity = new EventEmitter<CodeMirror.Editor>();
  // 滚动事件
  @Output() scrollEvent = new EventEmitter<CodeMirror.ScrollInfo>();
  // codemirror初始化完成事件
  @Output() codemirrorReady = new EventEmitter<CodeMirror.Editor>();

  @ViewChild('hostContainer', { static: true }) hostContainer;

  // codemirror实例，对外提供
  public instance;
  value = '';
  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor() {}

  ngAfterViewInit() {
    if (!this.hostContainer) {
      return;
    }
    this.options = this.options || {};
    this.initConfig(this.options);
  }

  // 初始化codemirror配置
  initConfig(options) {
    this.instance = CodeMirror.fromTextArea(this.hostContainer.nativeElement, options);

    this.instance.on('change', (cm, change) => {
      this.updateValue(cm, change);
    });

    this.instance.on('focus', () => {
      this.focusChangeEvent(true);
    });

    this.instance.on('blur', () => {
      this.focusChangeEvent(false);
    });

    this.instance.on('scroll', (cm) => {
      this.scrollEvent.emit(cm.getScrollInfo());
    });

    this.instance.on('cursorActivity', (cm) => {
      this.cursorActivity.emit(cm);
    });

    this.instance.setValue(this.value);
    this.codemirrorReady.emit(this.instance);
  }

  focusChangeEvent(focused) {
    this.onTouched();
    this.focusChange.emit(focused);
  }

  updateValue(cm, change) {
    if (change.origin !== 'setValue') {
      this.value = cm.getValue();
      this.onChange(this.value);
    }
  }

  writeValue(value) {
    if (value === null || value === undefined || !this.instance) {
      return;
    }
    const currentValue = this.instance.getValue();
    if (value === currentValue) {
      return;
    }
    this.value = value;
    this.instance.setValue(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
