import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'ub-text-settings-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./field.scss'],
  template: `
    <label *ngIf="!noLabel" class="settings-field-label">{{ label }}</label>
    <input
      nbInput
      fullWidth
      [placeholder]="placeholder"
      [ngModel]="value"
      [status]="status"
      (ngModelChange)="textChange$.next($event)"
    />
  `
})
export class TextSettingsFieldComponent implements OnDestroy, OnInit {
  @Input() noLabel = false;
  @Input() label = 'Text';
  @Input() value: string;
  @Input() placeholder = 'http://path/image.png';
  @Input() status: NbComponentStatus;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  textChange$ = new Subject<string>();

  private destroyed$ = new Subject<void>();

  ngOnInit() {
    this.textChange$
      .pipe(debounceTime(200), takeUntil(this.destroyed$))
      .subscribe((text: string) => this.valueChange.emit(text));
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
