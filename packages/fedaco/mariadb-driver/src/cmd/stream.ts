import { Query } from './query';
import { Readable } from 'stream';


/**
 * Protocol COM_QUERY with streaming events.
 * @see https://mariadb.com/kb/en/library/com_query/
 */
export class Stream extends Query {

  socket
  inStream

  constructor(cmdOpts, connOpts, sql, values, socket) {
    super(
      () => {},
      () => {},
      cmdOpts,
      connOpts,
      sql,
      values
    );
    this.socket = socket;
    this.inStream = new Readable({
      objectMode: true,
      read: () => {}
    });

    this.on('fields', function (meta) {
      this.inStream.emit('fields', meta);
    });

    this.on('error', function (err) {
      this.inStream.emit('error', err);
    });

    this.on('end', function (err) {
      if (err) this.inStream.emit('error', err);
      this.inStream.push(null);
    });
  }

  handleNewRows(row) {
    this.inStream.push(row);
  }
}

