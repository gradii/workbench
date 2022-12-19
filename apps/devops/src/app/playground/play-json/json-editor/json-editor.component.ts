import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import JSONEditor, { JSONEditorMode, JSONEditorOptions } from 'jsoneditor';


@Component({
  selector   : 'dt-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls  : ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit, OnDestroy {
  @ViewChild('jsonEditorContainer', { read: ElementRef, static: true })
  jsonEditorContainer: ElementRef;
  private jsoneditor: any;

  constructor() {
  }

  initEditor() {
    const options: JSONEditorOptions = {
      modes: ['text', 'code', 'tree', 'form', 'view'] as JSONEditorMode[],
      mode : 'code',
      ace  : ace
    };

    const json = {
      'array'  : [{ 'field1': 'v1', 'field2': 'v2' }, 2, 3],
      'boolean': true,
      'null'   : null,
      'number' : 123,
      'object' : { 'a': 'b', 'c': 'd' },
      'string' : 'Hello World'
    };
    this.jsoneditor = new JSONEditor(this.jsonEditorContainer.nativeElement, options, json);
  }

  ngOnInit(): void {
    this.initEditor();
  }

  ngOnDestroy() {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
  }

}
