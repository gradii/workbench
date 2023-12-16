import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { OvenComponent, DataField, dataFields } from '@common';
import { Observable, ReplaySubject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'oven-data-error',
  styleUrls: ['./data-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button *ngIf="hasError$ | async" (click)="emitAction()">
      <nb-icon
        icon="database-error"
        pack="bakery"
        nbTooltip="Data not valid"
        nbTooltipStatus="danger"
        nbTooltipClass="data-tooltip-danger"
      ></nb-icon>
    </button>
  `
})
export class DataErrorComponent {
  @Input() set component(component: OvenComponent) {
    this.component$.next(component);
  }

  @Output() shouldFix: EventEmitter<void> = new EventEmitter<void>();

  private component$: ReplaySubject<OvenComponent> = new ReplaySubject<OvenComponent>(1);

  hasError$: Observable<boolean> = this.component$
    .asObservable()
    .pipe(switchMap((component: OvenComponent) => fromPromise(this.hasError(component))));

  emitAction() {
    this.shouldFix.emit();
  }

  private async hasError(component: OvenComponent): Promise<boolean> {
    if (dataFields[component.definitionId]) {
      for (const dataField of dataFields[component.definitionId]) {
        const valid = this.isFieldValid(component, dataField);
        if (!valid) {
          return true;
        }
      }
    }
    return false;
  }

  // field isn't valid if it === null
  private isFieldValid(component: OvenComponent, dataField: DataField) {
    if (dataField.propName) {
      return component.properties[dataField.propName] !== null;
    } else {
      return true;
    }
  }
}
