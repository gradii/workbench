import {
  Injectable,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDifferFactory,
  IterableDiffers
} from '@angular/core';
import { definitionIdToScheme, KitchenApp, UIPropertyMetaData } from '@common/public-api';
import { ComponentSchema } from '@common/public-api';

import { GlobalStateService } from './global-state.service';

export interface ComponentStateChanges {
  itemsToDelete: { name: string; componentId: string }[];
  itemsToCreate: { name: string; propName: string; value: any }[];
  itemsToRename: { oldName: string; newName: string }[];
}

@Injectable({ providedIn: 'root' })
export class InitialStateService {
  private componentNameDiffer: IterableDiffer<UIPropertyMetaData>;

  constructor(private globalStateService: GlobalStateService, differs: IterableDiffers) {
    const differFactory: IterableDifferFactory = differs.find([]);
    this.componentNameDiffer = differFactory.create(this.componentTrackBy);
  }

  updateInitialState(app: KitchenApp) {
    const componentChanges: ComponentStateChanges = this.getUIChanges(app.uiPropertyData);

    this.globalStateService.updateInitialUserState(app.storeItemList);
    this.globalStateService.updateInitialComponentState(componentChanges);
  }

  private getUIChanges(uiData: UIPropertyMetaData[]): ComponentStateChanges {
    const changes: IterableChanges<UIPropertyMetaData> = this.componentNameDiffer.diff(uiData);

    const itemsToDelete: { name: string; componentId: string }[] = [];
    const itemsToCreate: { name: string; propName: string; value: any }[] = [];
    const itemsToRename: { oldName: string; newName: string }[] = [];

    const result: ComponentStateChanges = { itemsToCreate, itemsToDelete, itemsToRename };
    if (!changes) {
      return result;
    }

    changes.forEachOperation(
      (change: IterableChangeRecord<UIPropertyMetaData>, previousIndex: number | null, currentIndex: number | null) => {
        const data: UIPropertyMetaData = change.item;

        // delete state item
        if (currentIndex === null) {
          itemsToDelete.push({ name: data.name, componentId: data.componentId });
        }

        // create or rename state item
        if (previousIndex === null) {
          const deletedItemIndex = itemsToDelete.findIndex(item => item.componentId === data.componentId);
          if (deletedItemIndex !== -1) {
            const deletedItem = itemsToDelete[deletedItemIndex];
            itemsToRename.push({ oldName: deletedItem.name, newName: data.name });
            itemsToDelete.splice(deletedItemIndex, 1);
          } else {
            itemsToCreate.push(...this.getComponentFields(data));
          }
        }
      }
    );

    return result;
  }

  private getComponentFields(data: UIPropertyMetaData): { name: string; propName: string; value: any }[] {
    const schema: ComponentSchema = definitionIdToScheme[data.definitionId];
    return schema.properties.map(prop => ({ name: data.name, propName: prop.name, value: prop.initialValue }));
  }

  private componentTrackBy(index: number, data: UIPropertyMetaData): string {
    return data.componentId + data.name;
  }
}
