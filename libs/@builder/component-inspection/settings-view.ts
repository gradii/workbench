import { Observable } from 'rxjs';
import { SequenceProperty } from '@common/public-api';
import { Breakpoint } from '../../@core/breakpoint/breakpoint';

export interface ComponentSettings {
  component
  styles
  properties
  actions
}

export interface SettingsView<T = any> {
  selectedBreakpoint?: Breakpoint;

  settings
  updateActions?: Observable<any>
  updateStyleAtActiveBreakpoint: Observable<any>
  updateProperty: Observable<any>

  featureList?: any[]

  updateFeature?: Observable<any>;
  addFeature?: Observable<any>;

  // updateConditionCode(conditionCode: string): void
  //
  // updateSequence(sequence: SequenceProperty): void
}
