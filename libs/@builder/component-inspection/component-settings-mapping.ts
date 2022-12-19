import { Type } from '@angular/core';
import { AccordionEditorComponent } from './components/accordion-editor.component';
import { BarChartEditorComponent } from './components/bar-chart-editor.component';
import { BubbleMapEditorComponent } from './components/bubble-map-editor.component';
import { ButtonLinkEditorComponent } from './components/button-link-editor.component';
import { ButtonEditorComponent } from './components/button-editor.component';
import { CalendarEditorComponent } from './components/calendar-editor.component';
import { CardEditorComponent } from './components/card-editor.component';
import { CheckboxEditorComponent } from './components/checkbox-editor.component';
import { DatepickerEditorComponent } from './components/datepicker-editor.component';
import { DividerEditorComponent } from './components/divider-editor.component';
import { DoughnutChartEditorComponent } from './components/doughnut-chart-editor.component';
import { HeaderEditorComponent } from './components/header-editor.component';
import { HeadingEditorComponent } from './components/heading-editor.component';
import { IconEditorComponent } from './components/icon-editor.component';
import { IframeEditorComponent } from './components/iframe-editor.component';
import { ImageEditorComponent } from './components/image-editor.component';
import { InputEditorComponent } from './components/input-editor.component';
import { LinkEditorComponent } from './components/link-editor.component';
import { ListEditorComponent } from './components/list-editor.component';
import { MapEditorComponent } from './components/map-editor.component';
import { MenuEditorComponent } from './components/menu-editor.component';
import { MultipleAxisChartEditorComponent } from './components/multiple-axis-chart-editor.component';
import { MultipleBarChartEditorComponent } from './components/multiple-bar-chart-editor.component';
import { ProgressBarEditorComponent } from './components/progress-bar-editor.component';
import { RadioEditorComponent } from './components/radio-editor.component';
import { SelectEditorComponent } from './components/select-editor.component';
import { SidebarEditorComponent } from './components/sidebar-editor.component';
import { SmartTableEditorComponent } from './components/smart-table-editor.component';
import { SpaceEditorComponent } from './components/space-editor.component';
import { StepperEditorComponent } from './components/stepper-editor.component';
import { TableEditorComponent } from './components/table-editor.component';
import { TabsEditorComponent } from './components/tabs-editor.component';
import { TextEditorComponent } from './components/text-editor.component';
import { SettingsView } from './settings-view';

const settings: { [key: string]: Type<SettingsView<any>> } = {
  header           : HeaderEditorComponent,
  sidebar          : SidebarEditorComponent,
  menu             : MenuEditorComponent,
  text             : TextEditorComponent,
  card             : CardEditorComponent,
  link             : LinkEditorComponent,
  tabs             : TabsEditorComponent,
  input            : InputEditorComponent,
  space            : SpaceEditorComponent,
  button           : ButtonEditorComponent,
  buttonLink       : ButtonLinkEditorComponent,
  select           : SelectEditorComponent,
  radio            : RadioEditorComponent,
  checkbox         : CheckboxEditorComponent,
  calendar         : CalendarEditorComponent,
  progressBar      : ProgressBarEditorComponent,
  smartTable       : SmartTableEditorComponent,
  table            : TableEditorComponent,
  heading          : HeadingEditorComponent,
  image            : ImageEditorComponent,
  icon             : IconEditorComponent,
  multipleAxisChart: MultipleAxisChartEditorComponent,
  multipleBarChart : MultipleBarChartEditorComponent,
  doughnutChart    : DoughnutChartEditorComponent,
  bubbleMap        : BubbleMapEditorComponent,
  barChart         : BarChartEditorComponent,
  map              : MapEditorComponent,
  accordion        : AccordionEditorComponent,
  list             : ListEditorComponent,
  datepicker       : DatepickerEditorComponent,
  iframe           : IframeEditorComponent,
  divider          : DividerEditorComponent,
  stepper          : StepperEditorComponent
};

export function getSettingsView<T>(type: string): Type<SettingsView<T>> {
  const settingsView: Type<SettingsView<T>> = settings[type];

  if (!settingsView) {
    throw new Error(`editor inspection for ${type} component is not found.`);
  }

  return settingsView;
}
