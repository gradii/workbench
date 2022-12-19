import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DataField, dataFields, KitchenComponent } from '@common/public-api';
import { from, Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector       : 'kitchen-data-error',
  styleUrls      : ['./data-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <button *ngIf="hasError$ | async" (click)="emitAction()">
      <tri-icon
        svgIcon="workbench:database-error"
        triTooltip="Data not valid"
        triTooltipClass="data-tooltip-danger"
      ></tri-icon>
    </button>
  `
})
export class DataErrorComponent {
  @Input()
  set component(component: KitchenComponent) {
    this.component$.next(component);
  }

  @Output() shouldFix: EventEmitter<void> = new EventEmitter<void>();

  private component$: ReplaySubject<KitchenComponent> = new ReplaySubject<KitchenComponent>(1);

  hasError$: Observable<boolean> = this.component$
    .asObservable()
    .pipe(switchMap((component: KitchenComponent) => from(this.hasError(component))));

  emitAction() {
    this.shouldFix.emit();
  }

  private async hasError(component: KitchenComponent): Promise<boolean> {
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
  private isFieldValid(component: KitchenComponent, dataField: DataField) {
    if (dataField.propName) {
      return component.properties[dataField.propName] !== null;
    } else {
      return true;
    }
  }
}
