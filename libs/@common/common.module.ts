import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriCheckboxModule } from '@gradii/triangle/checkbox';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriInputModule } from '@gradii/triangle/input';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { SearchService } from './@core/search.service';

import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { IconComponent } from './components/icon/icon.component';
import { InputIconComponent } from './components/input-icon/input-icon.component';
import { PasswordInputIconComponent } from './components/input-icon/password-input-icon.component';
import { InputUnitComponent, InputUnitListComponent } from './components/input-unit/input-unit.component';
import { NotificationLabelComponent } from './components/notification-label/notification-label.component';
import { OptionGroupIconDirective } from './components/option-group-icon/option-group-icon.directive';
import { TrimDirective } from './directives/trim.directive';
import { PfSafePipe } from './pipes/safe.pipe';
import { ScrollService } from './services/scroll.service';
import { SpacingService } from './services/spacing.service';
import { EmailValidatorDirective } from './validation/email-validator.directive';
import { PasswordValidatorDirective } from './validation/password-validator.directive';

const COMPONENTS = [
  IconComponent,
  InputIconComponent,
  InputUnitListComponent,
  InputUnitComponent,
  PasswordInputIconComponent,
  ButtonGroupComponent,
  TrimDirective,
  EmailValidatorDirective,
  PasswordValidatorDirective,
  NotificationLabelComponent,
  OptionGroupIconDirective
];

@NgModule({
  imports     : [
    CommonModule,
    TriInputModule,
    TriButtonModule,
    TriCheckboxModule,
    TriPopoverModule,
    TriTooltipModule,
    TriIconModule
  ],
  declarations: [...COMPONENTS, PfSafePipe],
  providers   : [
    SearchService,
    SpacingService,
    ScrollService
    // { provide: NbPositionBuilderService, useClass: PositionBuilderService }
  ],
  exports     : [...COMPONENTS, CommonModule, PfSafePipe]
})
export class BakeryCommonModule {
}
