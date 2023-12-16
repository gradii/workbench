export function getProjectVersion(): string {
  return require('../../../../../package.json').version;
}

export function getModelVersion(): number {
  return require('../../../../../package.json').modelVersion;
}
