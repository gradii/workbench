import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { exhaustMap, take, takeUntil } from 'rxjs/operators';

import { BakeryComponent } from '@tools-state/component/component.model';
import { CodeEditorComponent } from '@tools-shared/code-editor/code-editor.component';
import { ClosableInstance, OverlayDetachHandlerService } from '../../overlay-detach-handler.service';

@Component({
  selector: 'ub-data-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../field.scss', './data-binding-field.component.scss'],
  template: `
    <label *ngIf="!noLabel" class="settings-field-label">
      <nb-icon icon="database" pack="bakery" class="data-consumer"></nb-icon>
      {{ label }}
    </label>
    <ub-code-editor
      [model]="value"
      [placeholder]="placeholder"
      (modelChange)="valueChange.emit($event)"
      [component]="component"
      [syntax]="syntax"
      [allowPages]="allowPages"
      [allowActiveRoute]="allowActiveRoute"
      [selfSequence]="selfSequence"
      [resizable]="resizable"
      [oneLine]="oneLine"
    >
    </ub-code-editor>
  `
})
export class DataBindingFieldComponent implements AfterViewInit, OnDestroy {
  @Input() value: string;
  @Input() label = 'Text';
  @Input() noLabel = false;
  @Input() oneLine: boolean;
  @Input() lineNumbers: boolean;
  @Input() resizable: boolean;
  @Input() selectMode: boolean;
  @Input() selfSequence = false;
  @Input() syntax: 'ts' | 'json' | 'text' = 'ts';
  @Input() component: BakeryComponent;
  @Input() allowPages: boolean;
  @Input() allowActiveRoute: boolean;
  @Input() placeholder = '';

  @Input() set focusCodeEditor(_: {}) {
    this.focusCodeEditor$.next();
  }

  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  @ViewChild(CodeEditorComponent) codeEditor: CodeEditorComponent;
  @ViewChild(CodeEditorComponent, { read: ElementRef }) codeEditorEl: ElementRef;

  private destroy$ = new Subject();
  private focusCodeEditor$ = new Subject();

  constructor(private overlayDetachHandlerService: OverlayDetachHandlerService, private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.registerOverlayToDetach();
    this.listenFocusCodeEditor();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  focus() {
    this.codeEditor.focus();
  }

  private listenFocusCodeEditor() {
    this.focusCodeEditor$
      .asObservable()
      .pipe(
        // when we try to focus after changing tab, our element don't rendered and we cant focus
        exhaustMap(() => this.ngZone.onStable.pipe(take(1))),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.codeEditor.focus());
  }

  private registerOverlayToDetach() {
    const closable: ClosableInstance = { hide: () => this.codeEditor.hideSelector() };
    this.overlayDetachHandlerService.register(closable, this.codeEditorEl);

    this.destroy$.pipe(take(1)).subscribe(() => {
      this.overlayDetachHandlerService.deregister(closable, this.codeEditorEl);
    });
  }
}
