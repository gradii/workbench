import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostBinding, Input, NgZone, OnChanges,
  OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef, ɵmarkDirty
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StepType } from '@common/public-api';
import { PopoverDirective } from '@gradii/triangle/popover';

import { CodeEditorOptionsService } from '@tools-shared/code-editor/code-editor-options.service';
import { PuffComponent } from '@tools-state/component/component.model';

import {
  defineMode, EditorChangeCancellable, EditorChangeLinkedList, EditorConfiguration, EditorFromTextArea, fromTextArea,
  getMode, Mode, modes
} from 'codemirror';
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/mode/multiplex';
import 'codemirror/mode/javascript/javascript';

import { combineLatest, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { CodeEditorInterpolationService } from './code-editor-interpolation.service';
import { OptionGroup, SelectChange } from './store-item-selector.component';
import { StoreItemSelectorService } from './store-item-selector.service';
import { CodeEditorUsedValuesService, ItemSource } from './used-value.service';

type CodeEditorSyntax = 'ts' | 'json' | 'text';

@Component({
  selector       : 'ub-code-editor',
  template       : `
    <div
      class="textarea-container"
      [triPopover]="variableHint"
      triPopoverPosition="top"
      triPopoverTrigger="noop"
      [triPopoverClass]="['no-arrow', 'autocomplete-trigger-hint-popover']"
    >
      <textarea [placeholder]="placeholder" #textArea></textarea>
    </div>
    <ng-container #vcr></ng-container>

    <ng-template #variableHint>
      <div class="autocomplete-trigger-hint-message" [style.width.px]="editorWidth$ | async">
        Type <span class="autocomplete-trigger-chars">{{</span> to choose a Variable or reference UI Element value
      </div>
    </ng-template>
  `,
  providers      : [
    StoreItemSelectorService,
    {
      provide    : NG_VALUE_ACCESSOR,
      multi      : true,
      useExisting: forwardRef(() => CodeEditorComponent)
    }
  ],
  styleUrls      : ['./code-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, ControlValueAccessor {
  private destroy$ = new Subject<void>();

  private baseEditorOptions: EditorConfiguration = { theme: 'ayu-mirage', indentUnit: 2, lineNumbers: false };
  private editor: EditorFromTextArea;

  editorWidth$ = new ReplaySubject<number>(1);

  private emitChanges = false;

  @ViewChild('textArea') textArea: ElementRef<HTMLTextAreaElement>;
  @ViewChild(PopoverDirective) autocompleteTriggerHintPopover: PopoverDirective;
  @ViewChild('vcr', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  @Input() model: string;

  private modelChange$  = new Subject<string>();
  @Output() modelChange = this.modelChange$.pipe(debounceTime(300));

  @Input() prevStepType: StepType.HTTP_REQUEST | StepType.CUSTOM_CODE | StepType.CUSTOM_ASYNC_CODE | ItemSource.EVENT;

  @Input() syntax: CodeEditorSyntax = 'ts';

  /**
   * If true add default html resize stick and set bigger min height
   */
  @Input() @HostBinding('class.resizable') resizable: boolean;
  @Input() @HostBinding('class.one-line') oneLine = false;

  @Input() lineNumbers       = false;
  @Input() allowPages: boolean;
  @Input() allowActiveRoute  = true;
  @Input() allowLocalStorage = true;
  // if false do not count component as sequence source (relative for sequence setting only)
  @Input() selfSequence      = true;
  @Input() component: PuffComponent;
  @Input() placeholder       = '';

  @HostBinding('class.highlight-border') highlightBorder = false;

  onTouched: () => void = () => null;

  onChange: (result: string) => any = () => null;

  constructor(
    private hostRef: ElementRef<HTMLElement>,
    private interpolationService: CodeEditorInterpolationService,
    private storeItemSelectorService: StoreItemSelectorService,
    private ngZone: NgZone,
    private usedValuesService: CodeEditorUsedValuesService,
    private codeEditorOptionsService: CodeEditorOptionsService
  ) {
  }

  writeValue(newText: string): void {
    const oldText = this.model;
    this.model    = newText;
    if (this.editor && oldText !== newText) {
      this.editor.setValue(newText);
    }

    ɵmarkDirty(this);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.registerSelectorOptions();
  }

  ngOnChanges({ model, prevStepType, allowStoreBindings, syntax, allowPages }: SimpleChanges) {
    if (syntax && this.editor) {
      this.editor.setOption('mode', this.getEditorSyntaxMode());
    }

    if (!model) {
      return;
    }

    if (this.editor && this.editor.getValue() !== this.model) {
      this.editor.setValue(this.model);
    }
  }

  ngAfterViewInit() {
    this.setupSelectorService();
    this.createEditor();
    this.editor.setValue(this.model || '');
    this.emitChanges = true;
    this.observeEditorVisibility();
    this.setupAutocompleteTriggerHint();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  focus() {
    // otherwise editor won't react
    setTimeout(() => this.editor.focus());
  }

  hideSelector() {
    this.storeItemSelectorService.hide();
  }

  private setupSelectorService() {
    this.storeItemSelectorService.registerHostElement(this.hostRef);

    this.editorWidth$
      .pipe(takeUntil(this.destroy$))
      .subscribe((width: number) => this.storeItemSelectorService.setSelectorWidth(width));

    this.storeItemSelectorService
      .selectedChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((change: SelectChange) => this.onVariableSelect(change));

    this.storeItemSelectorService
      .onStateChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isShown, closedByEscape, closedOnSelect }) => {
        this.highlightBorder = isShown;
        if (closedByEscape || closedOnSelect) {
          this.focus();
        }
        if (isShown) {
          this.autocompleteTriggerHintPopover.hide();
        }
        ɵmarkDirty(this);
      });
  }

  private createEditor() {
    this.editor = fromTextArea(this.textArea.nativeElement, this.getEditorOptions());

    this.editor.on('refresh', () => this.editorWidth$.next(this.getEditorWidth()));
    this.editorWidth$.next(this.getEditorWidth());

    this.editor.on('beforeChange', (editor, change: EditorChangeCancellable) => this.onBeforeChange(change));
    this.editor.on('change', (editor, change: EditorChangeLinkedList) => this.handleTextChange(change));
  }

  private onBeforeChange(change: EditorChangeCancellable) {
    if (this.oneLine) {
      this.preventNewLines(change);
    }
  }

  private preventNewLines(change: EditorChangeCancellable) {
    const { text, from, to } = change;

    const isMultiLineChange = text.length > 1;
    const isJustNewLine     = isMultiLineChange && text.every(line => line.length === 0);

    if (isJustNewLine) {
      change.cancel();
    }
    if (isMultiLineChange) {
      change.update(from, to, [text.join(' ')]);
    }
  }

  private getEditorOptions(): EditorConfiguration {
    const mode    = this.getEditorSyntaxMode();
    const options = { ...this.baseEditorOptions, mode };

    if (this.oneLine) {
      options.scrollbarStyle = null;
    }

    options.lineNumbers = this.lineNumbers;

    return options;
  }

  private getEditorSyntaxMode() {
    const modeName = `${this.syntax}-with-interpolations`;

    if (!modes[modeName]) {
      this.defineSyntaxMode(modeName, this.syntax);
    }

    return modeName;
  }

  private getEditorElement(): HTMLElement {
    return this.editor.getWrapperElement();
  }

  private getEditorWidth(): number {
    return this.getEditorElement().getBoundingClientRect().width;
  }

  private handleTextChange(change: EditorChangeLinkedList) {
    const newText = this.editor.getValue();
    if (newText === this.model) {
      return;
    }
    this.model = newText;

    if (!this.emitChanges) {
      return;
    }

    if (this.isCursorAtInterpolationStart()) {
      this.storeItemSelectorService.show();
    }

    this.modelChange$.next(this.model);
    this.onTouched();
    this.onChange(this.model);

    if (change.origin === 'paste') {
      // Chip data could be fetched asynchronously and we need to wait for Angular to stabilize
      // so the chip text is updated and it has final width. After that, we could scroll
      // cursor into the view.
      this.ngZone.onStable.pipe(take(1)).subscribe(() => this.editor.scrollIntoView(null));
    }
  }

  private registerSelectorOptions() {
    const optionGroupResolvers = [
      this.codeEditorOptionsService.resolveStateOptionGroup(),
      this.codeEditorOptionsService.resolveUIOptionGroup()
    ];

    if (this.prevStepType) {
      optionGroupResolvers.push(this.codeEditorOptionsService.resolvePrevStepOptionGroup(this.prevStepType));
    }
    if (this.allowPages) {
      optionGroupResolvers.push(this.codeEditorOptionsService.resolvePagesOptionGroup());
    }
    if (this.allowLocalStorage) {
      optionGroupResolvers.push(this.codeEditorOptionsService.resolveLocalStorageOptionGroup());
    }
    if (this.allowActiveRoute) {
      optionGroupResolvers.push(this.codeEditorOptionsService.resolveActiveRouteOptionGroup());
    }
    if (this.component) {
      optionGroupResolvers.push(
        this.codeEditorOptionsService.resolveFromListOptionGroup(this.component, this.selfSequence)
      );
    }

    combineLatest(optionGroupResolvers)
      .pipe(takeUntil(this.destroy$))
      .subscribe((optionalGroups: OptionGroup[][]) => {
        this.storeItemSelectorService.setOptionGroups(optionalGroups.flat());
      });
  }

  private onVariableSelect({ selected, path }: SelectChange) {
    const usedValue     = this.usedValuesService.createUsedValueFromOption(selected);
    const interpolation = this.interpolationService.generateInterpolation(usedValue.id, path);
    this.insertInterpolation(interpolation);
  }

  private insertInterpolation(interpolationExpression: string) {
    if (this.editor.getSelection()) {
      this.editor.replaceSelection(interpolationExpression);
    } else {
      const editorDoc = this.editor.getDoc();
      const position  = editorDoc.getCursor();
      // replace {{ with {{ interpolation }}
      editorDoc.replaceRange(interpolationExpression, { ...position, ch: position.ch - 2 }, position);
    }
  }

  private observeEditorVisibility() {
    let isVisible = false;

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const previousVisibilityState = isVisible;
      isVisible                     = entries.every(e => e.intersectionRatio > 0);

      if (isVisible && previousVisibilityState !== isVisible) {
        this.editor.refresh();
      }
    });

    observer.observe(this.getEditorElement());
    this.destroy$.pipe(take(1)).subscribe(() => observer.disconnect());
  }

  private isCursorAtInterpolationStart(): boolean {
    if (!this.editor.hasFocus()) {
      return false;
    }

    const interpolationStartText = this.interpolationService.interpolationStartText;
    const { line, ch }           = this.editor.getCursor();

    if (ch < interpolationStartText.length) {
      return false;
    }

    const currentLineText  = this.editor.getLine(line);
    const textBeforeCursor = currentLineText.slice(0, ch);
    return textBeforeCursor.endsWith(interpolationStartText);
  }

  private setupAutocompleteTriggerHint() {
    this.editor.on('focus', () => this.autocompleteTriggerHintPopover.show());
    this.editor.on('blur', () => this.autocompleteTriggerHintPopover.hide());
  }

  private defineSyntaxMode(modeName: string, baseSyntax: CodeEditorSyntax) {
    defineMode(modeName, config => {
      let baseMode: Mode<any>;
      if (baseSyntax === 'text') {
        baseMode = getMode(config, 'text/plain');
      } else {
        const isTs   = baseSyntax === 'ts';
        const isJson = baseSyntax === 'json';
        baseMode     = getMode(config, { name: 'javascript', ts: isTs, json: isJson });
      }

      const interpolationMode = {
        open      : '{{',
        close     : '}}',
        delimStyle: 'interpolation-brackets',
        innerStyle: 'interpolation-code',
        mode      : getMode(config, { name: 'javascript', typescript: true })
      };

      // @ts-ignore
      return CodeMirror.multiplexingMode(baseMode, interpolationMode);
    });
  }
}
