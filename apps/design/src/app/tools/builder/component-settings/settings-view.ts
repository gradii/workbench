import { Observable } from 'rxjs';
import { SequenceProperty } from '@common';

export interface ComponentSettings {
  component
  styles
  properties
  actions
}

export interface SettingsView<T = any> {
  settings
  updateActions?: Observable<any>
  updateStyleAtActiveBreakpoint: Observable<any>
  updateProperty: Observable<any>

  // updateConditionCode(conditionCode: string): void
  //
  // updateSequence(sequence: SequenceProperty): void
}
