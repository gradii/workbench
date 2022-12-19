import { HttpErrorResponse } from '@angular/common/http';
import { createAction } from '@ngneat/effects';

import { ProjectDto } from '@shared/project.service';
import { ProjectSettings } from './project-settings.model';

export namespace ProjectSettingsActions {
  export const loadProjectSettings        = createAction('[Project Settings] Load Project Settings');
  export const loadProjectSettingsSuccess = createAction(
    '[Project Settings] Load Project Settings Success',
    (project: ProjectDto) => ({ project })
  );
  export const loadProjectSettingsFailed  = createAction('[Project Settings] Load Project Settings Failed');

  export const updateProjectSettings        = createAction(
    '[Project Settings] Update Project Settings',
    (settings: ProjectSettings) => ({ settings })
  );
  export const updateProjectSettingsSuccess = createAction(
    '[Project Settings] Update Project Settings Success',
    (project: ProjectDto) => ({ project })
  );
  export const updateProjectSettingsFailed  = createAction(
    '[Project Settings] Update Project Settings Failed',
    (error: HttpErrorResponse) => ({ error })
  );

  export const uploadFavicon        = createAction('[Project Settings] Upload Favicon',
    (favicon: File) => ({ favicon }));
  export const uploadFaviconSuccess = createAction(
    '[Project Settings] Upload Favicon Success',
    (faviconUrl: string) => ({ faviconUrl })
  );
  export const uploadFaviconFailed  = createAction('[Project Settings] Upload Favicon Failed');

  export const setProjectId = createAction('[Project Settings] Set Project', (projectId: string) => ({ projectId }));

  export const setSettings = createAction('[Project Settings] Set Settings',
    (settings: ProjectSettings) => ({ settings }));

  export const clearProjectSettingsFailed = createAction('[Project Settings] Clear Project Settings Failed');
}
