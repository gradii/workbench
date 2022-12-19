import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BakeryCommonModule } from '@common/public-api';
import { TriOptionModule } from '@gradii/triangle/core';

import { StoreItemSelectorComponent } from './code-editor/store-item-selector.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { CodeEditorInterpolationService } from './code-editor/code-editor-interpolation.service';
import { CodeEditorUsedValuesService } from './code-editor/used-value.service';
import { DataNotificationListComponent } from '@tools-shared/data-notification-list/data-notification-list.component';
import { CodeEditorOptionsService } from './code-editor/code-editor-options.service';
import { SimpleCodeEditorModule } from '@shared/code-editor/simple-code-editor.module';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { TriIconModule } from '@gradii/triangle/icon';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriSelectModule } from '@gradii/triangle/select';
import { TriInputModule } from '@gradii/triangle/input';

@NgModule({
  declarations: [CodeEditorComponent, StoreItemSelectorComponent, DataNotificationListComponent],
  imports     : [
    CommonModule,
    TriIconModule,
    TriButtonModule,
    TriSelectModule,
    BakeryCommonModule,
    TriInputModule,
    TriPopoverModule,
    SimpleCodeEditorModule,

    TriPopoverModule,
    TriIconModule,
    TriOptionModule
  ],
  exports     : [CodeEditorComponent, DataNotificationListComponent, SimpleCodeEditorModule],
  providers   : [CodeEditorInterpolationService, CodeEditorUsedValuesService, CodeEditorOptionsService]
})
export class ToolsSharedModule {
}
