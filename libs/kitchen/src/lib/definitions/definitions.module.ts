import { NgModule } from '@angular/core';
import { BakeryCommonModule } from '@common';
import {
  AccordionDefinitionModule, ButtonDefinitionModule, ButtonLinkDefinitionModule, CalendarDefinitionModule,
  CardDefinitionModule, CheckboxDefinitionModule, DatepickerDefinitionModule, DividerDefinitionModule,
  DoughnutChartDefinitionModule, HeaderDefinitionModule, HeadingDefinitionModule, IconDefinitionModule,
  IframeDefinitionModule, ImageDefinitionModule, InputDefinitionModule, LinkDefinitionModule, ListDefinitionModule,
  MapDefinitionModule, MenuDefinitionModule, MultipleAxisChartDefinitionModule, MultipleBarChartDefinitionModule,
  PieChartDefinitionModule, ProgressBarDefinitionModule, RadioDefinitionModule, SelectDefinitionModule,
  SidebarDefinitionModule, SidebarToggleDefinitionModule, SmartTableDefinitionModule, SpaceDefinitionModule,
  StepperDefinitionModule, TableDefinitionModule, TabsDefinitionModule, TextDefinitionModule
} from './components-definitions';
import { DefinitionUtilsModule } from './definition-utils';

import { DefinitionsComponent } from './definitions.component';
import {
  ContactsDefinitionModule, Login2DefinitionModule, Login3DefinitionModule, LoginDefinitionModule,
  MultiColumnFormDefinitionModule, OrdersDefinitionModule, ProfileDefinitionModule, Register2DefinitionModule,
  RegisterDefinitionModule, StatisticsDefinitionModule, StatusCardDefinitionModule, StatusChart2DefinitionModule,
  StatusChartDefinitionModule, TasksDefinitionModule, UsersDefinitionModule
} from './widget-definitions';

const DEFINITIONS = [DefinitionsComponent];

@NgModule({
  imports: [
    DefinitionUtilsModule,
    CardDefinitionModule,
    ButtonDefinitionModule,
    ButtonLinkDefinitionModule,
    InputDefinitionModule,
    TextDefinitionModule,
    SpaceDefinitionModule,
    CheckboxDefinitionModule,
    SelectDefinitionModule,
    RadioDefinitionModule,
    ProgressBarDefinitionModule,
    CalendarDefinitionModule,
    LinkDefinitionModule,
    TabsDefinitionModule,
    StepperDefinitionModule,
    PieChartDefinitionModule,
    MultipleAxisChartDefinitionModule,
    MultipleBarChartDefinitionModule,
    DoughnutChartDefinitionModule,
    MapDefinitionModule,
    TableDefinitionModule,
    SmartTableDefinitionModule,
    HeadingDefinitionModule,
    ImageDefinitionModule,
    MenuDefinitionModule,
    IconDefinitionModule,
    AccordionDefinitionModule,
    ListDefinitionModule,
    HeaderDefinitionModule,
    DatepickerDefinitionModule,
    SidebarDefinitionModule,
    SidebarToggleDefinitionModule,
    LoginDefinitionModule,
    RegisterDefinitionModule,
    ContactsDefinitionModule,
    UsersDefinitionModule,
    OrdersDefinitionModule,
    StatisticsDefinitionModule,
    TasksDefinitionModule,
    Login2DefinitionModule,
    Register2DefinitionModule,
    Login3DefinitionModule,
    ProfileDefinitionModule,
    StatusCardDefinitionModule,
    StatusChartDefinitionModule,
    StatusChart2DefinitionModule,
    MultiColumnFormDefinitionModule,
    IframeDefinitionModule,
    DividerDefinitionModule,

    BakeryCommonModule,
  ],
  exports: [...DEFINITIONS],
  declarations: [...DEFINITIONS]
})
export class DefinitionsModule {
}
