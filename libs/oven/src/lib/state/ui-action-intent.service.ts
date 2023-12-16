import { Injectable } from '@angular/core';
import { UIActionIntent } from '@common';
import { OvenState } from './oven-state.service';

/**
 * Not connected to State Mutation, just UI commands like scroll to an element or open a tab
 * So it does nothing, just ASKS to do something
 * */
@Injectable({ providedIn: 'root' })
export class UIActionIntentService {
  constructor(private ovenState: OvenState) {
  }

  connectDataSource() {
    this.ovenState.emitMessage(UIActionIntent.CONNECT_DATA_SOURCE);
  }

  showSequenceSource() {
    this.ovenState.emitMessage(UIActionIntent.SHOW_SEQUENCE_SOURCE);
  }

  fixDataSource() {
    this.ovenState.emitMessage(UIActionIntent.FIX_DATA_SOURCE);
  }
}
