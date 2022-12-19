import { ConnectionOptions } from './connection-options';

export class PoolOptions {
  acquireTimeout;
  connectionLimit;
  idleTimeout;
  leakDetectionTimeout;
  initializationTimeout;
  minDelayValidation;
  minimumIdle;
  noControlAfterUse;
  resetAfterUse;
  pingTimeout;
  connOptions;

  constructor(opts) {
    if (typeof opts === 'string') {
      opts = ConnectionOptions.parse(opts);

      //set data type
      if (opts.acquireTimeout) opts.acquireTimeout = parseInt(opts.acquireTimeout, 10);
      if (opts.connectionLimit) opts.connectionLimit = parseInt(opts.connectionLimit, 10);
      if (opts.idleTimeout) opts.idleTimeout = parseInt(opts.idleTimeout, 10);
      if (opts.leakDetectionTimeout)
        opts.leakDetectionTimeout = parseInt(opts.leakDetectionTimeout, 10);
      if (opts.initializationTimeout)
        opts.initializationTimeout = parseInt(opts.initializationTimeout, 10);
      if (opts.minDelayValidation) opts.minDelayValidation = parseInt(opts.minDelayValidation, 10);
      if (opts.minimumIdle) opts.minimumIdle = parseInt(opts.minimumIdle, 10);
      if (opts.noControlAfterUse) opts.noControlAfterUse = opts.noControlAfterUse == 'true';
      if (opts.resetAfterUse) opts.resetAfterUse = opts.resetAfterUse == 'true';
      if (opts.pingTimeout) opts.pingTimeout = parseInt(opts.pingTimeout, 10);
    }

    this.acquireTimeout = opts.acquireTimeout === undefined ? 10000 : opts.acquireTimeout;
    this.connectionLimit = opts.connectionLimit === undefined ? 10 : opts.connectionLimit;
    this.idleTimeout = opts.idleTimeout || 1800;
    this.leakDetectionTimeout = opts.leakDetectionTimeout || 0;
    this.initializationTimeout =
      opts.initializationTimeout === undefined ? 30000 : opts.initializationTimeout;
    this.minDelayValidation = opts.minDelayValidation === undefined ? 500 : opts.minDelayValidation;
    this.minimumIdle =
      opts.minimumIdle === undefined
        ? this.connectionLimit
        : Math.min(opts.minimumIdle, this.connectionLimit);
    this.noControlAfterUse = opts.noControlAfterUse || false;
    this.resetAfterUse = opts.resetAfterUse === undefined ? true : opts.resetAfterUse;
    this.pingTimeout = opts.pingTimeout || 250;
    this.connOptions = new ConnectionOptions(opts);

    if (this.acquireTimeout > 0 && this.connOptions.connectTimeout > this.acquireTimeout) {
      this.connOptions.connectTimeout = this.acquireTimeout;
    }
  }
}
