import { Command } from './command';
import { Errors } from '../misc/errors';

/**
 * send a COM_RESET_CONNECTION: permits to reset a connection without re-authentication.
 * @see https://mariadb.com/kb/en/library/com_reset_connection/
 */
export class Reset extends Command {
  onPacketReceive;

  constructor(resolve, reject) {
    super(resolve, reject);
  }

  start(out, opts, info) {
    out.startPacket(this);
    out.writeInt8(0x1f);
    out.flushBuffer(true);
    this.emit('send_end');
    this.onPacketReceive = this.readResetResponsePacket;
  }

  /**
   * Read response packet.
   * packet can be :
   * - an ERR_Packet
   * - a OK_Packet
   *
   * @param packet  query response
   * @param out     output writer
   * @param opts    connection options
   * @param info    connection info
   */
  readResetResponsePacket(packet, out, opts, info) {
    if (packet.peek() !== 0x00) {
      return this.throwNewError(
        'unexpected packet',
        false,
        info,
        '42000',
        Errors.ER_RESET_BAD_PACKET
      );
    }

    packet.skip(1); //skip header
    packet.skipLengthCodedNumber(); //affected rows
    packet.skipLengthCodedNumber(); //insert ids

    info.status = packet.readUInt16();
    this.successEnd(null);
  }
}
