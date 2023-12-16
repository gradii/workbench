import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BakeryCommonModule } from '@common';
import { NbButtonModule, NbIconModule, NbInputModule, NbSelectModule, NbPopoverModule } from '@nebular/theme';

import { StoreItemSelectorComponent } from './code-editor/store-item-selector.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { CodeEditorInterpolationService } from './code-editor/code-editor-interpolation.service';
import { CodeEditorUsedValuesService } from './code-editor/used-value.service';
import { DataNotificationListComponent } from '@tools-shared/data-notification-list/data-notification-list.component';
import { CodeEditorOptionsService } from './code-editor/code-editor-options.service';
import { SimpleCodeEditorModule } from '@shared/code-editor/simple-code-editor.module';

@NgModule({
  declarations: [CodeEditorComponent, StoreItemSelectorComponent, DataNotificationListComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule,
    BakeryCommonModule,
    NbInputModule,
    NbPopoverModule,
    SimpleCodeEditorModule
  ],
  exports: [CodeEditorComponent, DataNotificationListComponent, SimpleCodeEditorModule],
  providers: [CodeEditorInterpolationService, CodeEditorUsedValuesService, CodeEditorOptionsService],
  entryComponents: [CodeEditorComponent, StoreItemSelectorComponent]
})
export class ToolsSharedModule {
}
