export type DeploymentStatus =
  | 'success'
  | 'fail'
  | 'building'
  | 'queued'
  | 'uploading'
  | 'started'
  | 'cancelled'
  | null;

export const FinalStatuses: DeploymentStatus[] = ['success', 'fail', 'cancelled', null];
export const RetryStatuses: DeploymentStatus[] = ['building', 'queued', 'uploading', 'started'];

export interface Deployment {
  createdAt: Date;
  updatedAt: Date;
  status: DeploymentStatus;
  retries: number;
}

export interface Website {
  domain: string;
  latest?: Deployment;
  published?: Deployment;
}

export interface Hosting {
  id: number;
  domain: string;
  configured: boolean;
  environment: 'dev' | 'prod';
  currentDeploymentStatus: DeploymentStatus;
  currentShouldRetry: boolean;
  publishedDeploymentStatus: DeploymentStatus;
  publishedDeploymentDate: Date;
  website?: Website;
}
