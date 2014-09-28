var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 4,
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
   * @method getLatestThreads
   * @param count
   * @param callback
   * @return callback err, rows, fields
   */
  getLatestThreads: function(count, callback) {
    pool.query('select pub_date, image_url, content from pine_threads order by pub_date desc limit 0, ' + count, callback);
  },

  /**
   * @method getLatestThreadId
   * @param callback err, maxId
   */
  getLatestThreadId: function(callback) {
    pool.query('select id from pine_threads order by pub_date desc limit 0, 1;', function (err, rows, fields) {
      callback(err, rows[0].id);
    });
  },

  /**
   * @param id
   * @param callback err, id, pubDate, imageUrl, content
   */
  getThreadJson: function(id, callback) {
    pool.query('select id, pub_date, image_url, content from pine_threads where id = '+id+';', function (err, rows, fields) {
      if (rows.length == 0) return callback(err, {});
      callback(err, {
        id: rows[0].id,
        pub_date: rows[0].pub_date,
        image_url: rows[0].image_url,
        content: rows[0].content
      });
    });
  },

  /**
   * @param count
   * @param offset
   * @param reverse if true, return older thread since offset
   * @param callback err, threads(id, pub_date, image_url, content, like_count) array
   */
  getThreads: function (count, offset, reverse, callback) {
    if (arguments.length != 4) throw new Error('Arguments does not match');

    var getLatestQuery = 'SELECT threads.id id, threads.pub_date pub_date, threads.image_url image_url, threads.content content, COUNT(likes.id) AS like_count '
                       + 'FROM pine_threads AS threads '
                       + '  LEFT OUTER JOIN pine_threads_likes AS likes ON threads.id = likes.threads_id '
                       + 'GROUP BY threads.id ORDER BY threads.id DESC LIMIT 0, ' + count;
    var getOffsetReverseQuery = 'SELECT threads.id id, threads.pub_date pub_date, threads.image_url image_url, threads.content content, COUNT(likes.id) AS like_count '
                              + 'FROM pine_threads AS threads '
                              + '  LEFT OUTER JOIN pine_threads_likes AS likes ON threads.id = likes.threads_id '
                              + 'WHERE threads.id < ' + offset + ' GROUP BY threads.id ORDER BY threads.id DESC LIMIT 0, ' + count;
    var getOffsetQuery = 'SELECT threads.id id, threads.pub_date pub_date, threads.image_url image_url, threads.content content, COUNT(likes.id) AS like_count '
                       + 'FROM pine_threads AS threads '
                       + '  LEFT OUTER JOIN pine_threads_likes AS likes ON threads.id = likes.threads_id '
                       + 'WHERE threads.id > ' + offset + ' GROUP BY threads.id ORDER BY threads.id DESC LIMIT 0, ' + count;

    if (offset == 0 || typeof offset != 'number')
      pool.query(getLatestQuery, handleResultSet);
    else
      if (reverse == true)
        pool.query(getOffsetReverseQuery, handleResultSet);
      else
        pool.query(getOffsetQuery, handleResultSet);

    function handleResultSet(err, rows) {
      if (err) return callback(err);
      if (rows.length == 0) return callback(err, []);
      return callback(err, rows);
    }
  }
};