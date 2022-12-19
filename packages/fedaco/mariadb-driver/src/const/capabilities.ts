/**
 * Capabilities list ( with 'CLIENT_' removed)
 * @see https://mariadb.com/kb/en/library/1-connecting-connecting/#capabilities
 */
export class Capabilities {
  /* mysql/old mariadb server/client */
  static readonly MYSQL = 1n;
  /* Found instead of affected rows */
  static readonly FOUND_ROWS = 2n;
  /* get all column flags */
  static readonly LONG_FLAG = 4n;
  /* one can specify db on connect */
  static readonly CONNECT_WITH_DB = 8n;
  /* don't allow database.table.column */
  static readonly NO_SCHEMA = 1n << 4n;
  /* can use compression protocol */
  static readonly COMPRESS = 1n << 5n;
  /* odbc client */
  static readonly ODBC = 1n << 6n;
  /* can use LOAD DATA LOCAL */
  static readonly LOCAL_FILES = 1n << 7n;
  /* ignore spaces before '' */
  static readonly IGNORE_SPACE = 1n << 8n;
  /* new 4.1 protocol */
  static readonly PROTOCOL_41 = 1n << 9n;
  /* this is an interactive client */
  static readonly INTERACTIVE = 1n << 10n;
  /* switch to ssl after handshake */
  static readonly SSL = 1n << 11n;
  /* IGNORE sigpipes */
  static readonly IGNORE_SIGPIPE = 1n << 12n;
  /* client knows about transactions */
  static readonly TRANSACTIONS = 1n << 13n;
  /* old flag for 4.1 protocol  */
  static readonly RESERVED = 1n << 14n;
  /* new 4.1 authentication */
  static readonly SECURE_CONNECTION = 1n << 15n;
  /* enable/disable multi-stmt support */
  static readonly MULTI_STATEMENTS = 1n << 16n;
  /* enable/disable multi-results */
  static readonly MULTI_RESULTS = 1n << 17n;
  /* multi-results in ps-protocol */
  static readonly PS_MULTI_RESULTS = 1n << 18n;
  /* client supports plugin authentication */
  static readonly PLUGIN_AUTH = 1n << 19n;
  /* permits connection attributes */
  static readonly CONNECT_ATTRS = 1n << 20n;
  /* Enable authentication response packet to be larger than 255 bytes. */
  static readonly PLUGIN_AUTH_LENENC_CLIENT_DATA = 1n << 21n;
  /* Don't close the connection for a connection with expired password. */
  static readonly CAN_HANDLE_EXPIRED_PASSWORDS = 1n << 22n;

  /**
   * Capable of handling server state change information. Its a hint to the
   * server to include the state change information in Ok packet.
   */
  static readonly SESSION_TRACK = 1n << 23n;
  /* Client no longer needs EOF packet */
  static readonly DEPRECATE_EOF = 1n << 24n;
  static readonly SSL_VERIFY_SERVER_CERT = 1n << 30n;

  /* MariaDB extended capabilities */

  /* Permit bulk insert*/
  static readonly MARIADB_CLIENT_STMT_BULK_OPERATIONS = 1n << 34n;

  /* Clients supporting extended metadata */
  static readonly MARIADB_CLIENT_EXTENDED_TYPE_INFO = 1n << 35n;
}

