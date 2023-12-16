import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardComponent } from '@nebular/theme';

import { createWidgetMetaDefinitionProvider, WidgetMetaDefinition } from '../../definition';
import { CardDefinitionComponent } from '../../components-definitions/card/card-definition';
import { tasksFactory } from './tasks.factory';

const metaDefinition: WidgetMetaDefinition = {
  definition: {
    id: 'card',
    componentType: NbCardComponent,
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
