/**
 * possible server status flag value
 */
export enum ServerStatus {
  STATUS_IN_TRANS = 1,

  //Autocommit mode is set
  STATUS_AUTOCOMMIT = 2,
  //more results exists (more packet follow)
  MORE_RESULTS_EXISTS = 8,

  QUERY_NO_GOOD_INDEX_USED = 16,
  QUERY_NO_INDEX_USED = 32,

  //when using COM_STMT_FETCH, indicate that current cursor still has result (deprecated)
  STATUS_CURSOR_EXISTS = 64,

  //when using COM_STMT_FETCH, indicate that current cursor has finished to send results (deprecated)
  STATUS_LAST_ROW_SENT = 128,

  //database has been dropped
  STATUS_DB_DROPPED = 1 << 8,

  //current escape mode is "no backslash escape"
  STATUS_NO_BACKSLASH_ESCAPES = 1 << 9,

  //A DDL change did have an impact on an existing PREPARE (an automatic reprepare has been executed)
  STATUS_METADATA_CHANGED = 1 << 10,
  QUERY_WAS_SLOW = 1 << 11,

  //this result-set contain stored procedure output parameter
  PS_OUT_PARAMS = 1 << 12,

  //current transaction is a read-only transaction
  STATUS_IN_TRANS_READONLY = 1 << 13,

  //session state change. see Session change type for more information
  SESSION_STATE_CHANGED = 1 << 14,

}
