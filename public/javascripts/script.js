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
//var API_BASE_URL = 'http://localhost:3000';

$(".thread").appear(function () {
  var _this = this;

  $.ajax({
    type: 'GET',
    url: API_BASE_URL + '/threads/' + this['id'].slice(7),
    success: function (threadJson) {
      var elSpan = _this.childNodes[1];
      elSpan.innerHTML = threadJson['content'];

      _this.dataset.pubdate = threadJson['pub_date'];

      var elImg = _this.childNodes[0];
      if (threadJson['image_url'] != '')
        elImg.setAttribute('src', IMAGE_BASE_URL+threadJson['image_url']);
      elImg.style.opacity = 1;
    },
    error: function (e) {
      console.error(e);
    }
  });
});

$('#bar-right-menu').click(function () {
  if ($(this).hasClass('bar-right-menu-active'))
    closeRightMenu();
  else
    openRightMenu();
});

$('#button-latest-1-week').click(function () {
  closeRightMenu();
  if (isActive($(this)))
    last1WeekMenuDeactive();
  else
    last1WeekMenuActive();
});

function openRightMenu() {
  $('#bar-right-menu').addClass('bar-right-menu-active');
  $('#config-menus').addClass('config-menus-active');
}

function closeRightMenu() {
  $('#bar-right-menu').removeClass('bar-right-menu-active');
  $('#config-menus').removeClass('config-menus-active');
}

function fadeOutThread(jqThread) {
  jqThread.css({opacity: .5});
  jqThread.addClass('thread-fade-out');
}

function fadeInThread(jqThread) {
  jqThread.css({opacity: 1});
  jqThread.removeClass('thread-fade-out');
}

function isActive(jqElement) {
  return jqElement.hasClass('Active');
}

function last1WeekMenuActive() {
  var menu = $('#button-latest-1-week');
  menu.css({opacity:1});
  menu.addClass('Active');

  var last1WeekTime = new Date().getTime() - 604800;  // 60 * 60 * 24 * 7
  $('.thread').each(function (index, element) {
    var pubTime = new Date($(this).data('pubdate')).getTime();
    if (pubTime < last1WeekTime)
      fadeOutThread($(this));
  });
}

function last1WeekMenuDeactive() {
  var menu = $('#button-latest-1-week');
  menu.css({opacity:.4});
  menu.removeClass('Active');

  $('.thread').each(function (index, element) {
    var jqElement = $(element);
    if (jqElement.hasClass('thread-fade-out'))
      fadeInThread(jqElement);
  });
}