import { DataEffects } from '@tools-state/data/data.effects';
import { DownloadEffects } from '@tools-state/download/download.effects';
import { PageEffects } from '@tools-state/page/page.effects';
import { AppEffects } from '@tools-state/app/app.effects';
import { ClipboardEffects } from '@tools-state/clipboard/clipboard.effects';
import { ProjectEffects } from '@tools-state/project/project.effects';
import { ThemeEffects } from '@tools-state/theme/theme.effects';
import { WorkingAreaEffects } from '@tools-state/working-area/working-area.effects';
import { ComponentEffects } from '@tools-state/component/component.effects';
import { ImageEffects } from '@tools-state/image/image.effects';
import { BreakpointEffects } from '@tools-state/breakpoint/breakpoint.effects';
import { TutorialBriefEffects } from '@tools-state/tutorial-brief/tutorial-brief.effects';
import { StepEffects } from '@tools-state/tutorial-step/step.effects';
import { LessonEffects } from '@tools-state/tutorial-lesson/lesson.effects';
import { TutorialEffects } from '@tools-state/tutorial/tutorial.effects';
import { SettingsEffects } from '@tools-state/settings/settings.effects';
import { HistoryEffects } from '@tools-state/history/history.effects';

export const ToolsEffects = [
  PageEffects,
  AppEffects,
  ClipboardEffects,
  ComponentEffects,
  DownloadEffects,
  ProjectEffects,
  WorkingAreaEffects,
  ThemeEffects,
  ImageEffects,
  BreakpointEffects,
  TutorialBriefEffects,
  TutorialEffects,
  LessonEffects,
  StepEffects,
  SettingsEffects,
  HistoryEffects,
  DataEffects
];
