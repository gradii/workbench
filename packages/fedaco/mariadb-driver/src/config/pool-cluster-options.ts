export class PoolClusterOptions {

  canRetry = true;
  removeNodeErrorCount = 5;
  restoreNodeTimeout = 1000;
  defaultSelector = 'RR';

  constructor(opts) {
    if (opts) {
      this.canRetry = opts.canRetry === undefined ? true : opts.canRetry;
      this.removeNodeErrorCount = opts.removeNodeErrorCount || 5;
      this.restoreNodeTimeout = opts.restoreNodeTimeout || 1000;
      this.defaultSelector = opts.defaultSelector || 'RR';
    }
  }
}

