import stringifyObject from 'stringify-object';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { repeatWhen, takeUntil } from 'rxjs/operators';

import { BakeryComponent } from '@tools-state/component/component.model';
import { UIActionIntentService } from '@tools-state/ui-action/ui-action-intent.service';
import { DataBindingFieldComponent } from '../data-field/data-binding-field.component';
import { ACTIVATE$, DEACTIVATE$ } from '../../settings.directive';

@Component({
  selector: 'ub-data-source-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../field.scss'],
  template: `
    <div class="data-source-container">
      <label class="data-source-main-label">
        <nb-icon class="data-consumer" icon="database" pack="bakery"> </nb-icon>
        Data
      </label>
      <ub-data-format-hint [formatExample]="formatExample" [dataFormatType]="dataFormatType"> </ub-data-format-hint>
    </div>
    <ub-data-field
      [noLabel]="true"
      [component]="component"
      [value]="value"
      [focusCodeEditor]="focusCodeEditor$ | async"
      (valueChange)="valueChange.emit($event)"
    >
    </ub-data-field>
  `
})
export class DataSourceSettingFieldComponent implements AfterViewInit, OnDestroy {
  private readonly focusCodeEditor = new Subject();
  readonly focusCodeEditor$ = this.focusCodeEditor.asObservable();

  @Input() formatExample: any;
  @Input() dataFormatType: string;
  @Input() component: BakeryComponent;
  @Input() disabled = false;
  @Input() componentPropName = 'data';

  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  @ViewChild(DataBindingFieldComponent) dataBindingFieldComponent: DataBindingFieldComponent;

  get value(): string {
    const value = this.component.properties[this.componentPropName];
    if (typeof value !== 'string') {
      return stringifyObject(value, {
        indent: '  ',
        singleQuotes: true,
        inlineCharacterLimit: 80
      });
    }
    return value;
  }

  private destroy$ = new Subject();

  constructor(
    private actionIntentService: UIActionIntentService,
    @Inject(ACTIVATE$) private activate$: Observable<boolean>,
    @Inject(DEACTIVATE$) private deactivate$: Observable<boolean>
  ) {
  }

  ngAfterViewInit() {
    this.listenConnectOrFixDataSource();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private listenConnectOrFixDataSource() {
    this.actionIntentService.connectOrFixDataSource$
      .pipe(
        takeUntil(this.deactivate$),
        repeatWhen(() => this.activate$),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.focusCodeEditor.next({});
      });
  }
}
