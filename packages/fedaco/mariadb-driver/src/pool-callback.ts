import { PoolBase } from './pool-base';
import { ConnectionCallback } from './connection-callback';
import { Errors } from './misc/errors';

export class PoolCallback extends PoolBase {

  getConnectionPromise = this.getConnection.bind(this);
  endPromise = this.end.bind(this);
  queryPromise = this.query.bind(this);
  batchPromise = this.batch.bind(this);
  emptyError = (err) => {
  };

  constructor(options) {
    super(options, processTaskCallback, createConnectionPoolCallback, pingPromise);
  }


  private processTaskCallback(conn, sql, values, isBatch) {
    if (sql) {
      return new Promise((resolve, reject) => {
        const fct = isBatch ? conn.batch : conn.query;
        fct(sql, values, (err, rows, fields) => {
          conn.releaseWithoutError();
          if (err) {
            reject(err);
            return;
          }
          return resolve(rows);
        });
      });
    } else {
      return Promise.resolve(conn);
    }
  };

  private pingPromise(conn) {
    return new Promise((resolve, reject) => {
      conn.ping(options.pingTimeout, (err) => {
        if (err) {
          reject(err);
        } else resolve();
      });
    });
  };

  private createConnectionPoolCallback(pool) {
    const conn = new ConnectionCallback(options.connOptions);
    return new Promise(function(resolve, reject) {
      conn.connect((err) => {
        if (err) {
          reject(err);
        } else {
          if (pool.closed) {
            //discard connection
            conn.end((err) => {
            });
            reject(
              Errors.createError(
                'Cannot create new connection to pool, pool closed',
                true,
                null,
                '08S01',
                Errors.ER_ADD_CONNECTION_CLOSED_POOL,
                null
              )
            );
          } else {
            const initialEnd = conn.end;
            conn.forceEnd = () => {
              return new Promise(function(res, rej) {
                initialEnd((err) => {
                  if (err) {
                    rej(err);
                  } else {
                    res();
                  }
                });
              });
            };

            conn.release = function(cb) {
              if (pool.closed) {
                pool._discardConnection(conn);
                if (cb) cb();
                return;
              }
              if (options.noControlAfterUse) {
                pool._releaseConnection(conn);
                if (cb) cb();
                return;
              }

              //if server permit it, reset the connection, or rollback only if not
              // COM_RESET_CONNECTION exist since mysql 5.7.3 and mariadb 10.2.4
              // but not possible to use it with mysql waiting for https://bugs.mysql.com/bug.php?id=97633 correction.
              // and mariadb only since https://jira.mariadb.org/browse/MDEV-18281
              let revertFunction = conn.rollback;
              if (
                options.resetAfterUse &&
                conn.info.isMariaDB() &&
                ((conn.info.serverVersion.minor === 2 && conn.info.hasMinVersion(10, 2, 22)) ||
                 conn.info.hasMinVersion(10, 3, 13))
              ) {
                revertFunction = conn.reset;
              }
              revertFunction((errCall) => {
                if (errCall) {
                  //uncertain connection state.
                  pool._discardConnection(conn);
                  if (cb) cb();
                  return;
                } else {
                  pool._releaseConnection(conn);
                }
                if (cb) cb();
              });
            };
            conn.end = conn.release;
            conn.releaseWithoutError = () => {
              conn.end((err) => {
              });
            };
            resolve(conn);
          }
        }
      });
    });
  };

  end(callback) {
    endPromise()
      .then(() => {
        if (callback) callback(null);
      })
      .catch(callback || emptyError);
  }

  /**
   * Execute query using text protocol with callback emit columns/data/end/error
   * events to permit streaming big result-set
   *
   * @param sql     sql parameter Object can be used to supersede default option.
   *                Object must then have sql property.
   * @param values  object / array of placeholder values (not mandatory)
   * @param cb      callback
   * @returns {Query} query
   */
  query(sql, values, cb) {
    let _cb = cb,
      _values = values;

    if (typeof values === 'function') {
      _cb = values;
      _values = undefined;
    }

    queryPromise(sql, _values)
      .then((rows) => {
        if (_cb) _cb(null, rows, rows.meta);
      })
      .catch(_cb || emptyError);
  };

  batch(sql, values, cb) {
    let _values = values,
      _cb = cb;

    if (typeof values === 'function') {
      _cb = values;
      _values = undefined;
    }

    batchPromise(sql, _values)
      .then((rows) => {
        if (_cb) _cb(null, rows, rows.meta);
      })
      .catch(_cb || emptyError);
  };

  getConnection(callback) {
    getConnectionPromise()
      .then((conn) => {
        if (callback) callback(null, conn);
      })
      .catch(callback || emptyError);
  };
}
