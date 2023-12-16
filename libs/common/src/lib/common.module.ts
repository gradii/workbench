import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbOverlayModule,
  NbPopoverModule,
  NbPositionBuilderService,
  NbTooltipModule
} from '@nebular/theme';
import { SearchService } from './@core/search.service';

import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { IconComponent } from './components/icon/icon.component';
import { InputIconComponent } from './components/input-icon/input-icon.component';
import { InputSearchResultsComponent } from './components/input-search/input-search-results.component';
import { InputSearchDirective } from './components/input-search/input-search.directive';
import { PasswordInputIconComponent } from './components/input-icon/password-input-icon.component';
import { InputUnitComponent, InputUnitListComponent } from './components/input-unit/input-unit.component';
import { OptionGroupIconDirective } from './components/option-group-icon/option-group-icon.directive';
import { PositionBuilderService } from './@core/position-builder.service';
import { NotificationLabelComponent } from './components/notification-label/notification-label.component';
import { TrimDirective } from './directives/trim.directive';
import { EmailValidatorDirective } from './validation/email-validator.directive';
import { PasswordValidatorDirective } from './validation/password-validator.directive';
import { SpacingService } from './services/spacing.service';
import { ScrollService } from './services/scroll.service';

const COMPONENTS = [
  IconComponent,
  InputIconComponent,
  InputUnitListComponent,
  InputUnitComponent,
  PasswordInputIconComponent,
  InputSearchDirective,
  ButtonGroupComponent,
  TrimDirective,
  EmailValidatorDirective,
  PasswordValidatorDirective,
  NotificationLabelComponent,
  OptionGroupIconDirective
];

@NgModule({
  imports: [
    CommonModule,
    NbOverlayModule,
    NbButtonModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbIconModule,
    NbTooltipModule
  ],
  declarations: [...COMPONENTS, InputSearchResultsComponent],
  providers: [
    SearchService,
    SpacingService,
    ScrollService,
    { provide: NbPositionBuilderService, useClass: PositionBuilderService }
  ],
  exports: [...COMPONENTS, CommonModule],
  entryComponents: [InputSearchResultsComponent]
})
export class BakeryCommonModule {
}
