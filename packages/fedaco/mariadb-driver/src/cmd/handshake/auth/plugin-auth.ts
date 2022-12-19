import { Command } from '../../command';

/**
 * Base authentication plugin
 */
export class PluginAuth extends Command {

  multiAuthResolver

  constructor(resolve, reject, multiAuthResolver) {
    super(resolve, reject);
    this.multiAuthResolver = multiAuthResolver;
  }

  successSend(packet, out, opts, info) {
    this.emit('end');
    this.multiAuthResolver(packet, out, opts, info);
  }
}
