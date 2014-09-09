var mysql = require('mysql');
var pool = mysql.createConnection({
  connectionLimit: 4,
  host: DB.HOST,
  user: DB.USERNAME,
  password: DB.PASSWORD,
  database: 'pine'
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
        pubDate: rows[0].pub_date,
        imageUrl: rows[0].image_url,
        content: rows[0].content
      });
    });
  }
};