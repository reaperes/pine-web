var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 1,
  host: DB.HOST,
  user: DB.USERNAME,
  password: DB.PASSWORD,
  database: DB.DATABASE
});

/**
 * @class ThreadService
 */

module.exports = {
  /**
   * @param threadId
   * @param callback err, comments
   */
  getComments: function (threadId, callback) {
    if (arguments.length != 2) throw new Error('Arguments does not match');

    pool.query('select id, pub_date, content from pine_comments where thread_id=' + threadId, function (err, rows) {
      if (err) return callback(err);
      if (rows.length == 0) return callback(err, []);
      callback(err, rows);
    });
  }
};