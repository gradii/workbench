import { PlanConfig, plansConfig } from './acl-config';

export interface RoleEvaluatorContext {
  projectsNumber: number;
  themesNumber: number;
  pagesNumber: number;
  createdAt: Date;
  pages: string[];
  plan: string;
  featureAmplify: boolean;
}

export function evaluatePrivileges(context: RoleEvaluatorContext): string[] {
  const { plan, pagesNumber, themesNumber, projectsNumber } = context;
  const planConfig: PlanConfig = plansConfig[plan];
  const privileges = [];

  if (projectsNumber < planConfig.limits.projects) {
    privileges.push('projectCreator');
  }

  if (themesNumber < planConfig.limits.themes) {
    privileges.push('themeCreator');
  }

  if (pagesNumber < planConfig.limits.pages) {
    privileges.push('pageCreator');
  }

  return privileges;
}
