import { PluginAuth } from './plugin-auth';
import Crypto from 'crypto';

/**
 * Standard authentication plugin
 */
export class NativePasswordAuth extends PluginAuth {

  constructor(packSeq, compressPackSeq, pluginData, resolve, reject, multiAuthResolver) {
    super(resolve, reject, multiAuthResolver);
    this.pluginData = pluginData;
    this.sequenceNo = packSeq;
    this.compressSequenceNo = compressPackSeq;
  }
  pluginData;
  sequenceNo;
  compressSequenceNo;

  onPacketReceive;

  static encryptPassword(password, seed, algorithm) {
    if (!password) return Buffer.alloc(0);

    let hash = Crypto.createHash(algorithm);
    const stage1 = hash.update(password, 'utf8').digest();
    hash = Crypto.createHash(algorithm);

    const stage2 = hash.update(stage1).digest();
    hash = Crypto.createHash(algorithm);

    hash.update(seed);
    hash.update(stage2);

    const digest = hash.digest();
    const returnBytes = Buffer.allocUnsafe(digest.length);
    for (let i = 0; i < digest.length; i++) {
      returnBytes[i] = stage1[i] ^ digest[i];
    }
    return returnBytes;
  }

  start(out, opts, info) {
    //seed is ended with a null byte value.
    const data = this.pluginData.slice(0, 20);
    const authToken = NativePasswordAuth.encryptPassword(opts.password, data, 'sha1');

    out.startPacket(this);
    if (authToken.length > 0) {
      out.writeBuffer(authToken, 0, authToken.length);
      out.flushBuffer(true);
    } else {
      out.writeEmptyPacket(true);
    }
    this.emit('send_end');
    this.onPacketReceive = this.successSend;
  }
}
