import { AccountEffects } from '@account-state/account.effects';
import { ProfileService } from '@account-state/profile/profile.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BakeryCommonModule } from '@common';
import { TriPasswordAuthStrategyOptions } from '@gradii/triangle/auth';
import { TriTooltipModule } from '@gradii/triangle/tooltip';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { ToolsSharedModule } from '@tools-shared/tools-shared.module';
import { ToolsEffects } from '@tools-state/tools.effects';
import { ProjectsModule } from 'apps/devops/src/app/workbench/account/projects/projects.module';
import { ApiActionComponent } from './api-action/api-action.component';
import { ApiWorkflowComponent } from './api-workflow/api-workflow.component';
import { PlayApiRoutingModule } from './play-api-routing.module';

// import 'style-loader!./styles/styles.scss';

export function authErrorGetter(module: string, res: HttpErrorResponse, options: TriPasswordAuthStrategyOptions) {
  return res.error;
}

@NgModule({
  declarations: [
    ApiActionComponent,

    ApiWorkflowComponent
  ],
  imports: [
    CommonModule,
    PlayApiRoutingModule,
    // ToolsRoutingModule,
    BakeryCommonModule,
    ReactiveFormsModule,



    // StoreModule.forFeature('account', fromAccount.reducers),
    EffectsNgModule.forFeature(AccountEffects),

    // StoreModule.forFeature('tools', fromTools.reducers, { metaReducers: fromTools.storeConfig.metaReducers }),
    EffectsNgModule.forFeature(ToolsEffects),

    // NotFoundModule,
    TriTooltipModule,
    // TutorialsModule,
    // TutorialSharedModule,
    // TutorialDialogModule,
    ToolsSharedModule,
    // WorkflowModule,
    ProjectsModule

  ],
  providers: [ProfileService]
})
export class PlayApiModule {
}
