// jquery extends. copyright jquery.unveil
(function($) {
  $.fn.appear = function(callback) {
    var $w = $(window),
      th = 0,
      threads = this,
      appeared;

    this.one("appear", function() {
      if (typeof callback === "function") callback.call(this);
    });

    function appear() {
      var inview = threads.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
          wb = wt + $w.height(),
          et = $e.offset().top,
          eb = et + $e.height();
        return eb >= wt - th && et <= wb + th;
      });
      appeared = inview.trigger("appear");
      threads = threads.not(appeared);
    }
    $w.on("scroll.appear resize.appear lookup.appear", appear);
    appear();
    return this;
  };
})(window.jQuery);


var IMAGE_BASE_URL = 'http://images.recover39.com/';
var API_BASE_URL = 'http://125.209.194.90:3000';


$(".thread").appear(function () {
  var _this = this;
  console.log(this['id']);
  $.ajax({
    type: 'GET',
    url: API_BASE_URL + '/threads/1',
    success: function (threadJson) {
      var elImg = _this.childNodes[0];
      elImg.setAttribute('src', IMAGE_BASE_URL+threadJson['imageUrl']);
      elImg.style.opacity = 1;

      var elSpan = _this.childNodes[1];
      elSpan.innerHTML = threadJson['content'];
    },
    error: function (e) {
      console.error(e);
    }
  });
});