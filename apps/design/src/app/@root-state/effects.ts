import { ProjectSettingsEffects } from './project-settings/project-settings.effects';
import { AnalyticsEffects } from '@root-state/analytics.effects';
import { FeatureEffects } from '@root-state/feature/feature.effects';
import { ProjectBriefEffects } from '@root-state/projects/project-brief.effects';
import { HostingEffects } from '@root-state/hosting/hosting.effects';

export const RootEffects = [
  AnalyticsEffects,
  FeatureEffects,
  ProjectBriefEffects,
  ProjectSettingsEffects,
  HostingEffects
];
