import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { ProjectDto } from '@shared/project.service';
import { ProjectSettings } from './project-settings.model';

export namespace ProjectSettingsActions {
  export const loadProjectSettings = createAction('[Project Settings] Load Project Settings');
  export const loadProjectSettingsSuccess = createAction(
    '[Project Settings] Load Project Settings Success',
    props<{ project: ProjectDto }>()
  );
  export const loadProjectSettingsFailed = createAction('[Project Settings] Load Project Settings Failed');

  export const updateProjectSettings = createAction(
    '[Project Settings] Update Project Settings',
    props<{ settings: ProjectSettings }>()
  );
  export const updateProjectSettingsSuccess = createAction(
    '[Project Settings] Update Project Settings Success',
    props<{ project: ProjectDto }>()
  );
  export const updateProjectSettingsFailed = createAction(
    '[Project Settings] Update Project Settings Failed',
    props<{ error: HttpErrorResponse }>()
  );

  export const uploadFavicon = createAction('[Project Settings] Upload Favicon', props<{ favicon: File }>());
  export const uploadFaviconSuccess = createAction(
    '[Project Settings] Upload Favicon Success',
    props<{ faviconUrl: string }>()
  );
  export const uploadFaviconFailed = createAction('[Project Settings] Upload Favicon Failed');

  export const setProjectId = createAction('[Project Settings] Set Project', props<{ projectId: string }>());

  export const setSettings = createAction('[Project Settings] Set Settings', props<{ settings: ProjectSettings }>());

  export const clearProjectSettingsFailed = createAction('[Project Settings] Clear Project Settings Failed');
}
