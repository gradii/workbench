import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { INTERPOLATION_REGEXP } from '../../../workflow/util/interpolate.service';

@Injectable()
export class EditableTextService {
  private textChange: Subject<string> = new Subject<string>();
  readonly textChange$ = this.textChange.asObservable();
  private editMode: Subject<boolean> = new BehaviorSubject<boolean>(false);
  readonly editMode$ = this.editMode.asObservable();

  private editable = false;
  private editableElement: HTMLElement;
  private renderer: Renderer2;
  private unlisten$: Subject<void> = new Subject<void>();

  constructor() {
  }

  init(el: ElementRef, renderer: Renderer2) {
    this.editableElement = el.nativeElement;
    this.renderer = renderer;
  }

  attach() {
    this.listenEvents();
  }

  detach() {
    this.disableEditing();
    this.unlisten$.next();
  }

  writeValue(value: string) {
    if (!this.editable) {
      this.editableElement.innerHTML = this.wrapInterpolationToSpan(value);
    }
  }

  private enableEditing() {
    if (this.editable) {
      return;
    }
    this.editable = true;
    this.renderer.setAttribute(this.editableElement, 'contenteditable', 'true');
    this.editMode.next(true);
    this.editableElement.focus();
  }

  private disableEditing() {
    if (!this.editable) {
      return;
    }

    this.editable = false;
    this.editMode.next(false);
    this.renderer.setAttribute(this.editableElement, 'contenteditable', 'false');
  }

  private listenEvents() {
    fromEvent(this.editableElement, 'dblclick')
      .pipe(takeUntil(this.unlisten$))
      .subscribe(() => this.enableEditing());

    fromEvent(this.editableElement, 'input')
      .pipe(takeUntil(this.unlisten$))
      .subscribe(() => this.onInput());

    fromEvent(this.editableElement, 'paste')
      .pipe(takeUntil(this.unlisten$))
      .subscribe((event: ClipboardEvent) => this.onPaste(event));

    fromEvent(this.editableElement, 'blur')
      .pipe(takeUntil(this.unlisten$))
      .subscribe(() => this.disableEditing());

    fromEvent(this.editableElement, 'keydown')
      .pipe(
        filter((event: KeyboardEvent) => event.code === 'Enter'),
        takeUntil(this.unlisten$)
      )
      .subscribe((event: Event) => this.onEnter(event));
  }

  private onInput() {
    if (this.editable) {
      const text: string = this.editableElement.innerText;
      this.textChange.next(text);
    }
  }

  private onPaste(event: ClipboardEvent) {
    if (this.editable) {
      event.preventDefault();
      const itemIndex: number = event.clipboardData.types.indexOf('text/plain');
      if (itemIndex !== -1) {
        event.clipboardData.items[itemIndex].getAsString((pastedText: string) => {
          pastedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ' ');
          const oldText = this.editableElement.innerText;
          const { start, end }: { start: number; end: number } = this.getCaretPosition();
          const newCaretPosition = start + pastedText.length;
          this.editableElement.innerText = oldText.substr(0, start) + pastedText + oldText.substr(end);
          this.setCaretPosition(newCaretPosition);
          this.textChange.next(this.editableElement.innerText);
        });
      }
    }
  }

  private onEnter(event: Event) {
    event.preventDefault();
    this.disableEditing();
  }

  private getCaretPosition(): { start: number; end: number } {
    const _range = document.getSelection().getRangeAt(0);
    const range = _range.cloneRange();
    range.selectNodeContents(this.editableElement);
    range.setEnd(_range.endContainer, _range.endOffset);
    return { start: _range.startOffset, end: _range.endOffset };
  }

  private setCaretPosition(position: number) {
    const newRange = document.createRange();
    const selection = window.getSelection();
    newRange.setStart(this.editableElement.childNodes[0], position);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  private wrapInterpolationToSpan(value: string): string {
    return !value
      ? value
      : value.replace(new RegExp(INTERPOLATION_REGEXP), '<span style="white-space: nowrap">{{$1}}</span>');
  }
}
