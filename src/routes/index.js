var express = require('express');
var router = express.Router();

var ThreadService = require(SOURCE_ROOT + '/modules/service/threadservice');
var CommentService = require(SOURCE_ROOT + '/modules/service/commentservice');


router.get('/', function(req, res) {
  res.render('index');
});

/**
 * @param count
 * @param offset
 * @param reverse
 */
router.get('/threads', function(req, res) {
  var params = req.query;

  var count = params.count !== undefined ? parseInt(params.count) : 0;
  var offset = params.offset !== undefined ? parseInt(params.offset) : 0;
  var reverse = params.reverse !== undefined ? Boolean(params.reverse) : false;

  ThreadService.getThreads(count, offset, reverse, function (err, threads) {
    if (err) return res.send(err);
    return res.send(threads);
  });
});

router.get('/threads/:id', function(req, res) {
  ThreadService.getThreadJson(req.params.id, function (err, threadJson) {
    res.send(threadJson);
  });
});

router.get('/threads/:id/comments', function (req, res) {
  CommentService.getComments(req.params.id, function (err, comments) {
    res.send(comments);
  });
});

module.exports = router;
