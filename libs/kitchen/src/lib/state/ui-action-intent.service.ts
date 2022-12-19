import { Injectable } from '@angular/core';
import { UIActionIntent } from '@common/public-api';
import { KitchenState } from './kitchen-state.service';

/**
 * Not connected to State Mutation, just UI commands like scroll to an element or open a tab
 * So it does nothing, just ASKS to do something
 * */
@Injectable(/*{ providedIn: 'root' }*/)
export class UIActionIntentService {
  constructor(private kitchenState: KitchenState) {
  }

  connectDataSource() {
    this.kitchenState.emitMessage(UIActionIntent.CONNECT_DATA_SOURCE);
  }

  showSequenceSource() {
    this.kitchenState.emitMessage(UIActionIntent.SHOW_SEQUENCE_SOURCE);
  }

  fixDataSource() {
    this.kitchenState.emitMessage(UIActionIntent.FIX_DATA_SOURCE);
  }
}
