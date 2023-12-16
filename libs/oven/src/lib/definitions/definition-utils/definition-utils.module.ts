import { NgModule } from '@angular/core';

import { DefinitionDirective } from './definition.directive';
import { RegisterSidebarDirective } from './register-sidebar.directive';
import { SlotPlaceholderDirective } from './slot-placeholder.directive';
import { SlotDirective } from './slot.directive';
import { TextDirective } from './text/text.directive';
import { UIDataService } from './ui-data.service';
import { WithActionsDirective } from './with-actions.directive';
import { WithDisabledDirective } from './with-disabled.directive';
import { WithFormFieldWidthDirective } from './with-form-field-width.directive';
import { WithIconSizeDirective } from './with-icon-size.directive';
import { WithMenuDisabledDirective } from './with-menu-disabled.directive';
import { OvenWithThemeVariableDirective } from './with-theme-variable.directive';
import { WithMarginsDirective } from './with-margins.directive';
import { WithRadiusDirective } from './with-radius.directive';
import { WithSizeDirective } from './with-size.directive';
import { WithPaddingsDirective } from './with-paddings.directive';
import { WithSpaceHeightDirective } from './with-space-height.directive';
import { WithTextStylesDirective } from './with-text-styles.directive';
import { WithNavigationDirective } from './with-navigation.directive';
import { WithBackgroundDirective } from './with-background.directive';
import { WithSpaceWidthDirective } from './with-space-width.directive';
import { DividerHelperDirective } from './divider-helper.directive';
import { WithVisibleDirective } from './with-visible.directive';

export interface ComponentDefinition<T> {
  definition: DefinitionDirective<T>;
}

const directives = [
  SlotDirective,
  DefinitionDirective,
  SlotPlaceholderDirective,
  WithMarginsDirective,
  WithTextStylesDirective,
  WithNavigationDirective,
  WithSizeDirective,
  WithPaddingsDirective,
  WithRadiusDirective,
  WithSpaceHeightDirective,
  WithSpaceWidthDirective,
  WithDisabledDirective,
  WithIconSizeDirective,
  WithBackgroundDirective,
  WithFormFieldWidthDirective,
  WithActionsDirective,
  OvenWithThemeVariableDirective,
  RegisterSidebarDirective,
  WithMenuDisabledDirective,
  WithVisibleDirective,
  DividerHelperDirective,
  TextDirective
];

@NgModule({
  exports: [...directives],
  declarations: [...directives],
  providers: [UIDataService]
})
export class DefinitionUtilsModule {
}
