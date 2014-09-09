var express = require('express');
var router = express.Router();

var ThreadService = require(SOURCE_ROOT + '/modules/service/threadservice');

router.get('/', function(req, res) {
  ThreadService.getLatestThreadId(function(err, maxId) {
    res.render('index', {
      maxId: maxId
    });
  });
});

router.get('/threads/:id', function(req, res) {
  ThreadService.getThreadJson(req.params.id, function(err, threadJson) {
    res.send(threadJson);
  });
});

module.exports = router;
