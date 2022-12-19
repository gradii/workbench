import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '@gradii/triangle/card';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { tasksFactory } from './tasks.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: CardComponent,
    definition: CardDefinitionComponent,
    factory: tasksFactory
  },
  name: 'Tasks',
  icon: '',
  order: 1000,
  previewImage: 'assets/widgets/tasks.png',
  headerSupport: false,
  sidebarSupport: false,
  tags: ['list', 'todo']
};

@NgModule({
  imports: [CommonModule],
  providers: [createWidgetMetaDefinitionProvider(metaDefinition)]
})
export class TasksDefinitionModule {
}
