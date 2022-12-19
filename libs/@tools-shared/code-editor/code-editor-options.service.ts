import { Injectable } from '@angular/core';
import {
  ActiveRouteId,
  ComponentLogicPropName,
  LocalStorageItem,
  KitchenComponent,
  Scope,
  SequenceProperty,
  StoreItem,
  StoreItemType
} from '@common/public-api';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StoreItemFacade } from '@tools-state/data/store-item/store-item-facade.service';
import { PuffComponent } from '@tools-state/component/component.model';
import { OptionGroup } from '@tools-shared/code-editor/store-item-selector.component';
import {
  GROUP_TEXT,
  ItemSource,
  ItemSourceType,
  sourceForStep,
  textForActiveRoute
} from '@tools-shared/code-editor/used-value.service';
import { ComponentFacade } from '@tools-state/component/component-facade.service';
import { PageFacade } from '@tools-state/page/page-facade.service';
import { LocalStorageFacadeService } from '@workflow-common/util/local-storage-facade.service';
import { Page } from '@tools-state/page/page.model';
import { UIOptionGroupResolverService } from '@tools-shared/code-editor/ui-option-group-resolver.service';

@Injectable()
export class CodeEditorOptionsService {
  constructor(
    private pageFacade: PageFacade,
    private componentFacade: ComponentFacade,
    private storeItemFacade: StoreItemFacade,
    private localStorageFacade: LocalStorageFacadeService,
    private uiOptionGroupResolver: UIOptionGroupResolverService
  ) {
  }

  resolveStateOptionGroup(): Observable<OptionGroup[]> {
    return this.storeItemFacade.storeItemList$.pipe(
      map((storeItemList: StoreItem[]) => {
        if (!storeItemList.length) {
          return [];
        }
        return [
          {
            itemSource: ItemSource.APP,
            name: GROUP_TEXT.get(ItemSource.APP),
            namespace: 'state',
            options: storeItemList.map((item: StoreItem) => ({
              id: item.id,
              name: item.name,
              sourceType: ItemSourceType.APP,
              valueType: item.valueType,
              value: item.value
            }))
          }
        ];
      })
    );
  }

  resolveUIOptionGroup(): Observable<OptionGroup[]> {
    return this.uiOptionGroupResolver.resolveUIOptionGroups();
  }

  resolvePrevStepOptionGroup(prevStepType: string): Observable<OptionGroup[]> {
    const isFirstStep = prevStepType === 'event';

    const options = [
      {
        id: Scope.RESULT,
        name: Scope.RESULT,
        sourceType: ItemSourceType.PREVIOUS_SUCCESS,
        valueType: StoreItemType.OBJECT,
        value: {},
        path: 'data'
      },
      {
        id: Scope.RESULT,
        name: Scope.RESULT,
        sourceType: ItemSourceType.PREVIOUS_ERROR,
        valueType: StoreItemType.OBJECT,
        value: {},
        path: 'error'
      }
    ];

    const firstStepOptions = [
      {
        id: Scope.PARAM,
        name: Scope.PARAM,
        sourceType: ItemSourceType.PARAM,
        valueType: StoreItemType.OBJECT,
        value: {}
      }
    ];

    return of([
      {
        itemSource: sourceForStep.get(prevStepType),
        name: GROUP_TEXT.get(sourceForStep.get(prevStepType)),
        namespace: '',
        options: isFirstStep ? firstStepOptions : options
      }
    ]);
  }

  resolvePagesOptionGroup(): Observable<OptionGroup[]> {
    return this.pageFacade.pageList$.pipe(
      map((pageList: Page[]) => [
        {
          itemSource: ItemSource.PAGE,
          name: GROUP_TEXT.get(ItemSource.PAGE),
          namespace: 'routes',
          options: pageList.map((page: Page) => ({
            id: page.name,
            name: page.name,
            sourceType: ItemSourceType.PAGE,
            valueType: StoreItemType.STRING,
            value: page.url
          }))
        }
      ])
    );
  }

  resolveLocalStorageOptionGroup(): Observable<OptionGroup[]> {
    return this.localStorageFacade.getWorkflowItems().pipe(
      map((localStorageList: LocalStorageItem[]) => {
        if (!localStorageList.length) {
          return [];
        }
        return [
          {
            itemSource: ItemSource.LOCAL_STORAGE,
            name: GROUP_TEXT.get(ItemSource.LOCAL_STORAGE),
            namespace: 'localStorage',
            options: localStorageList.map(item => ({
              id: item.name,
              name: item.name,
              sourceType: ItemSourceType.LOCAL_STORAGE,
              valueType: StoreItemType.OBJECT,
              value: item.value
            }))
          }
        ];
      })
    );
  }

  resolveActiveRouteOptionGroup(): Observable<OptionGroup[]> {
    return of([
      {
        itemSource: ItemSource.ACTIVE_ROUTE,
        name: GROUP_TEXT.get(ItemSource.ACTIVE_ROUTE),
        namespace: 'activeRoute',
        options: [
          {
            id: ActiveRouteId.QUERY_PARAMS,
            name: textForActiveRoute.get(ActiveRouteId.QUERY_PARAMS),
            sourceType: ItemSourceType.ACTIVE_ROUTE,
            valueType: StoreItemType.OBJECT,
            value: {}
          },
          {
            id: ActiveRouteId.URL,
            name: textForActiveRoute.get(ActiveRouteId.URL),
            sourceType: ItemSourceType.ACTIVE_ROUTE,
            valueType: StoreItemType.STRING,
            value: ''
          }
        ]
      }
    ]);
  }

  resolveFromListOptionGroup(component: KitchenComponent, ingnoreSelf: boolean): Observable<OptionGroup[]> {
    return this.componentFacade.findParentListComponent(component.id).pipe(
      map((sequenceComponents: PuffComponent[]) => {
        if (!sequenceComponents) {
          return [];
        }

        if (ingnoreSelf) {
          sequenceComponents = sequenceComponents.filter((c: PuffComponent) => c.id !== component.id);
        }

        return sequenceComponents
          .map((c: PuffComponent) => {
            const sequence: SequenceProperty = c.properties[ComponentLogicPropName.SEQUENCE_PROPERTY];
            return [
              {
                order: 1,
                itemSource: ItemSource.LIST_ITEM,
                name: c.properties.name + ' ' + GROUP_TEXT.get(ItemSource.LIST_ITEM),
                namespace: '',
                options: [
                  {
                    id: c.id,
                    valueType: StoreItemType.OBJECT,
                    value: '',
                    name: sequence.itemName,
                    sourceType: ItemSourceType.LIST_ITEM
                  },
                  {
                    id: c.id,
                    valueType: StoreItemType.NUMBER,
                    value: '',
                    name: sequence.indexName,
                    sourceType: ItemSourceType.LIST_ITEM_INDEX
                  }
                ]
              }
            ];
          })
          .flat();
      })
    );
  }
}
