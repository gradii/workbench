import { Type } from '@angular/core';
import { SettingsComponent } from '../../../account/settings/settings.component';
import { BarChartSettingsComponent } from './components/bar-chart-settings.component';
import { ButtonLinkSettingsComponent } from './components/button-link-settings.component';
import { ButtonSettingsComponent } from './components/button-settings.component';
import { CalendarSettingsComponent } from './components/calendar-settings.component';
import { CardSettingsComponent } from './components/card-settings.component';
import { CheckboxSettingsComponent } from './components/checkbox-settings.component';
import { HeaderSettingsComponent } from './components/header-settings.component';
import { HeadingSettingsComponent } from './components/heading-settings.component';
import { IconSettingsComponent } from './components/icon-settings.component';
import { ImageSettingsComponent } from './components/image-settings.component';
import { InputSettingsComponent } from './components/input-settings.component';
import { LineChartSettingsComponent } from './components/line-chart-settings.component';
import { LinkSettingsComponent } from './components/link-settings.component';
import { ListSettingsComponent } from './components/list-settings.component';
import { MapSettingsComponent } from './components/map-settings.component';
import { MenuSettingsComponent } from './components/menu-settings.component';
import { PieChartSettingsComponent } from './components/pie-chart-settings.component';
import { MultipleBarChartSettingsComponent } from './components/multiple-bar-chart-settings.component';
import { MultipleAxisChartSettingsComponent } from './components/multiple-axis-chart-settings.component';
import { DoughnutChartSettingsComponent } from './components/doughnut-chart-settings.component';
import { BubbleMapSettingsComponent } from './components/bubble-map-settings.component';
import { ProgressBarSettingsComponent } from './components/progress-bar-settings.component';
import { SidebarSettingsComponent } from './components/sidebar-settings.component';
import { TableSettingsComponent } from './components/table-settings.component';
import { SmartTableSettingsComponent } from './components/smart-table-settings.component';
import { TabsSettingsComponent } from './components/tabs-settings.component';
import { RadioSettingsComponent } from './components/radio-settings.component';
import { SelectSettingsComponent } from './components/select-settings.component';
import { SpaceSettingsComponent } from './components/space-settings.component';
import { TextSettingsComponent } from './components/text-settings.component';
import { AccordionSettingsComponent } from './components/accordion-settings.component';
import { DatepickerSettingsComponent } from './components/datepicker-settings.component';
import { IframeSettingsComponent } from './components/iframe-settings.component';
import { SettingsView } from './settings-view';
import { DividerSettingsComponent } from './components/divider-settings.component';
import { StepperSettingsComponent } from './components/stepper-settings.component';

const settings: { [key: string]: Type<SettingsView<any>> } = {
  header: HeaderSettingsComponent,
  sidebar: SidebarSettingsComponent,
  menu: MenuSettingsComponent,
  text: TextSettingsComponent,
  card: CardSettingsComponent,
  link: LinkSettingsComponent,
  tabs: TabsSettingsComponent,
  input: InputSettingsComponent,
  space: SpaceSettingsComponent,
  button: ButtonSettingsComponent,
  buttonLink: ButtonLinkSettingsComponent,
  select: SelectSettingsComponent,
  radio: RadioSettingsComponent,
  checkbox: CheckboxSettingsComponent,
  calendar: CalendarSettingsComponent,
  progressBar: ProgressBarSettingsComponent,
  smartTable: SmartTableSettingsComponent,
  table: TableSettingsComponent,
  heading: HeadingSettingsComponent,
  image: ImageSettingsComponent,
  icon: IconSettingsComponent,
  lineChart: LineChartSettingsComponent,
  pieChart: PieChartSettingsComponent,
  multipleAxisChart: MultipleAxisChartSettingsComponent,
  multipleBarChart: MultipleBarChartSettingsComponent,
  doughnutChart: DoughnutChartSettingsComponent,
  bubbleMap: BubbleMapSettingsComponent,
  barChart: BarChartSettingsComponent,
  map: MapSettingsComponent,
  accordion: AccordionSettingsComponent,
  list: ListSettingsComponent,
  datepicker: DatepickerSettingsComponent,
  iframe: IframeSettingsComponent,
  divider: DividerSettingsComponent,
  stepper: StepperSettingsComponent
};

export function getSettingsView<T>(type: string): Type<SettingsView<T>> {
  const settingsView: Type<SettingsView<T>> = settings[type];

  if (!settingsView) {
    throw new Error(`Can't resolve settings view for ${type} component.`);
  }

  return settingsView;
}
