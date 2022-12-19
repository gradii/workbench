import { ErrorCodes } from '../const/error-code';

export class SqlError extends Error {
  fatal;
  errno;
  sqlState;
  code;

  constructor(msg, fatal, info, sqlState, errno, additionalStack, addHeader) {
    super(
      `${
        addHeader === undefined || addHeader ?
          `(conn=${info ? (info.threadId ? info.threadId : -1) : -1}, no: ${errno ? errno : -1}, SQLState: ${sqlState ? sqlState : 'HY000'}) ` :
          ''
      }${msg}`
    );
    this.fatal = fatal;
    this.errno = errno;
    this.sqlState = sqlState;
    if (errno > 45000 && errno < 46000) {
      //driver error
      this.code = errByNo[errno] || 'UNKNOWN';
    } else {
      this.code = ErrorCodes[this.errno] || 'UNKNOWN';
    }
    if (additionalStack) {
      //adding caller stack, removing initial "Error:\n"
      this.stack +=
        `
 From event:
${additionalStack.substring(additionalStack.indexOf('\n') + 1)}`;
    }
  }
}

/**
 * Error factory, so error get connection information.
 *
 * @param msg               current error message
 * @param fatal             is error fatal
 * @param info              connection information
 * @param sqlState          sql state
 * @param errno             error number
 * @param additionalStack   additional stack trace to see
 * @param addHeader         add connection information
 * @returns {Error} the error
 */
export function createError(
  msg,
  fatal,
  info,
  sqlState,
  errno,
  additionalStack?,
  addHeader?
) {
  return new SqlError(msg, fatal, info, sqlState, errno, additionalStack, addHeader);
}

/********************************************************************************
 * Driver specific errors
 ********************************************************************************/
export enum Errors {

  ER_CONNECTION_ALREADY_CLOSED = 45001,
  ER_ALREADY_CONNECTING = 45002,
  ER_MYSQL_CHANGE_USER_BUG = 45003,
  ER_CMD_NOT_EXECUTED_DESTROYED = 45004,
  ER_NULL_CHAR_ESCAPEID = 45005,
  ER_NULL_ESCAPEID = 45006,
  ER_NOT_IMPLEMENTED_FORMAT = 45007,
  ER_NODE_NOT_SUPPORTED_TLS = 45008,
  ER_SOCKET_UNEXPECTED_CLOSE = 45009,
  ER_UNEXPECTED_PACKET = 45011,
  ER_CONNECTION_TIMEOUT = 45012,
  ER_CMD_CONNECTION_CLOSED = 45013,
  ER_CHANGE_USER_BAD_PACKET = 45014,
  ER_PING_BAD_PACKET = 45015,
  ER_MISSING_PARAMETER = 45016,
  ER_PARAMETER_UNDEFINED = 45017,
  ER_PLACEHOLDER_UNDEFINED = 45018,
  ER_SOCKET = 45019,
  ER_EOF_EXPECTED = 45020,
  ER_LOCAL_INFILE_DISABLED = 45021,
  ER_LOCAL_INFILE_NOT_READABLE = 45022,
  ER_SERVER_SSL_DISABLED = 45023,
  ER_AUTHENTICATION_BAD_PACKET = 45024,
  ER_AUTHENTICATION_PLUGIN_NOT_SUPPORTED = 45025,
  ER_SOCKET_TIMEOUT = 45026,
  ER_POOL_ALREADY_CLOSED = 45027,
  ER_GET_CONNECTION_TIMEOUT = 45028,
  ER_SETTING_SESSION_ERROR = 45029,
  ER_INITIAL_SQL_ERROR = 45030,
  ER_BATCH_WITH_NO_VALUES = 45031,
  ER_RESET_BAD_PACKET = 45032,
  ER_WRONG_IANA_TIMEZONE = 45033,
  ER_LOCAL_INFILE_WRONG_FILENAME = 45034,
  ER_ADD_CONNECTION_CLOSED_POOL = 45035,
  ER_WRONG_AUTO_TIMEZONE = 45036,
  ER_CLOSING_POOL = 45037,
  ER_TIMEOUT_NOT_SUPPORTED = 45038,
  ER_INITIAL_TIMEOUT_ERROR = 45039,
  ER_DUPLICATE_FIELD = 45040,
  ER_CLIENT_OPTION_INCOMPATIBILITY = 45041,
  ER_PING_TIMEOUT = 45042,
  ER_BAD_PARAMETER_VALUE = 45043,
  ER_CANNOT_RETRIEVE_RSA_KEY = 45044,
  ER_MINIMUM_NODE_VERSION_REQUIRED = 45045,
}
