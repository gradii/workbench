import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Renderer2
} from '@angular/core';

import * as CodeMirror from 'codemirror';
import 'codemirror/addon/search/matchesonscrollbar';

@Component({
  selector: 'dp-logs-preview',
  templateUrl: './logs-preview.component.html',
  styleUrls: ['../../../node_modules/codemirror/lib/codemirror.css', './logs-preview.component.scss', './lib/night.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LogsPreviewComponent implements OnInit, AfterViewInit, OnChanges {
  // 日志标题
  @Input() title: string | HTMLElement | TemplateRef<any> = '日志';
  // codemirror 配置
  @Input() options: any = {};
  // 日志内容
  @Input() logContent = '';
  // codemirror高度，默认300px
  @Input() height: number | string = 300;
  // 默认菜单配置
  @Input() menuBarConfig = ['search', 'fullscreen', 'download'];
  // 下载事件
  @Output() downloadEvent = new EventEmitter<CodeMirror.Editor>();
  // 编辑器是否聚焦
  @Output() focusChange = new EventEmitter<boolean>();
  // 当光标或选区移动或对编辑器内容进行任何更改时，将触发该事件。
  @Output() cursorActivity = new EventEmitter<CodeMirror.Editor>();
  // 滚动事件
  @Output() scrollEvent = new EventEmitter<CodeMirror.ScrollInfo>();
  // codemirror初始化完成事件
  @Output() codemirrorReady = new EventEmitter<CodeMirror.Editor>();
  // 日志内容改变事件
  @Output() logContentChange = new EventEmitter<any>();
  // 全屏改变事件
  @Output() fullScreenChange = new EventEmitter<boolean>();

  @ViewChild('codemirror', { static: true }) codemirror;

  // codemirror实例
  public instance;
  showMenuBar;

  // 默认暗黑主题配置，只读模式
  codeMirrorOptions: any = {
    theme: 'night',
    mode: 'text/x-sh',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    fullScreen: true,
    readOnly: true,
    extraKeys: {'Ctrl-F': 'findPersistent'}
  };
  // 标识是否全屏状态
  isFullScreen = false;
  constructor(private render: Renderer2) {}

  ngOnInit() {
    this.menuBarConfig = this.menuBarConfig || [];
    this.showMenuBar = {
      search: this.menuBarConfig.includes('search'),
      fullscreen: this.menuBarConfig.includes('fullscreen'),
      download: this.menuBarConfig.includes('download')
    };
    // 这里不提供完全定制，只能扩充或者覆盖
    this.codeMirrorOptions = Object.assign(this.codeMirrorOptions, this.options || {});
  }

  ngOnChanges(changes: SimpleChanges) {
    const { height } = changes;
    if (height && !height.isFirstChange()) {
      this.adjustSize();
    }
  }

  get template() {
    return this.title instanceof TemplateRef ? this.title : null;
  }

  contentChange() {
    this.logContentChange.emit(this.logContent);
  }

  scroll(event) {
    this.scrollEvent.emit(event);
  }

  focusChangeEvent(event) {
    this.focusChange.emit(event);
  }

  cursorActivityEvent(event) {
    this.cursorActivity.emit(event);
  }

  codemirrorReadyEvent(event) {
    this.codemirrorReady.emit(event);
  }

  downloadLogs() {
    this.downloadEvent.emit(this.codemirror.instance);
  }

  adjustSize() {
    if (this.instance) {
      this.instance.setSize('auto', this.height || 300);
    }
  }

  fullScreen(state) {
    const codemirrorWrapper = this.instance.getWrapperElement();
    if (state) {
      this.render.addClass(codemirrorWrapper, 'CodeMirror-fullscreen');
      this.instance.setSize('auto', 'auto');
      this.isFullScreen = true;
    } else {
      this.render.removeClass(codemirrorWrapper, 'CodeMirror-fullscreen');
      this.instance.setSize('auto', this.height);
      this.isFullScreen = false;
    }
    this.fullScreenChange.emit(this.isFullScreen);
  }

  seachLog() {
    this.instance.execCommand('findPersistent');
  }

  ngAfterViewInit() {
    this.instance = this.codemirror.instance;
    // 监听链接点击
    this.instance.getWrapperElement().addEventListener(
      'mousedown',
      (e) => {
        if ((<HTMLElement>e.target).classList.contains('cm-link') && e.button === 0) {
          window.open((<HTMLElement>e.target).innerText);
        }
      },
      false
    );
    this.adjustSize();
  }
}
