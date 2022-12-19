import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

const triggerMap: { [name: string]: { emitterName: string; dataName: string } } = {
  smartTableCreate: {
    emitterName: 'createConfirm',
    dataName: 'newData'
  },
  smartTableEdit: {
    emitterName: 'editConfirm',
    dataName: 'data'
  },
  smartTableDelete: {
    emitterName: 'deleteConfirm',
    dataName: 'data'
  },
  smartTableRowSelect: {
    emitterName: 'userRowSelect',
    dataName: 'data'
  }
};

export function listenSmartTableTriggers(
  table: Ng2SmartTableComponent,
  trigger: string,
  callback: (value: any) => void
): () => void {
  if (!triggerMap.hasOwnProperty(trigger)) {
    return;
  }
  const subscription: Subscription = table[triggerMap[trigger].emitterName].subscribe(event => {
    callback(event[triggerMap[trigger].dataName]);
  });
  return () => subscription.unsubscribe();
}
