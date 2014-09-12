var IMAGE_BASE_URL = 'http://images.recover39.com/';
var API_BASE_URL = 'http://125.209.194.90:3000';
//var API_BASE_URL = 'http://localhost:3000';

$(window).on('beforeunload', function() {
  $(window).scrollTop(0);
});

$(document).ready(function () {
  var isLoading = true;
  var isBottom = false;

  // get initial thread
  $.ajax({
    type: 'GET',
    url: API_BASE_URL + '/threads',
    data: {count: 60, offset: 0},
    success: function (datas, status) {
      $.each(datas, function (index, data) {
        addThreadInDiv(data);
      });
      isLoading = false;
    },
    error: function (e) {
      console.error(e);
    }
  });

  // get previous thread
  $(window).scroll(function () {
    if(isNearBottom() && !isLoading && !isBottom) {
      isLoading = true;
      var lastThreadId = $('#thread-container div:last-child').data('id');
      if (lastThreadId == 1)
        isBottom = true;

      $.ajax({
        type: 'GET',
        url: API_BASE_URL + '/threads',
        data: {count: 60, offset: lastThreadId, reverse: true},
        success: function (datas, status) {
          $.each(datas, function (index, data) {
            addThreadInDiv(data, true);
          });
          isLoading = false;
        },
        error: function (e) {
          console.error(e);
        }
      });
    }
  });

  // left menu click
  $('#bar-left-menu').click(function () {
    $('body').toggleClass('active');
    $('#header-menu').toggleClass('active');
    $('#page-wrap').toggleClass('active');
    $('#bars').toggleClass('active');
  });

  /**
   * @param data thread object
   * @param veil effect true or false
   */
  function addThreadInDiv(data, veil) {
    var $div = $('<div/>', {
      'class': 'thread',
      'data-id': data['id'],
      'data-pubdate': data['pub_date']
    });
    var $img = $('<img/>');
    if (data['image_url'] == '')
      $img.attr('src', 'images/img_no_img_thread.jpg');
    else {
      if (veil) {
        $img.attr('data-src', IMAGE_BASE_URL + data['image_url']).css('opacity', 0);
        $img.unveil(0, function () {
          $(this).load(function () {
            this.style.opacity = 1;
          })
        });
      }
      else
        $img.attr('src', IMAGE_BASE_URL + data['image_url']);
    }
    var $span = $('<span>' + data['content'] + '<span/>');
    $img.appendTo($div);
    $span.appendTo($div);
    $div.appendTo($('#thread-container'));
  }

  /**
   * @returns {boolean}
   */
  function isNearBottom() {
    if (isLoading) return false;
    return $(window).scrollTop() + $(window).height() > $(document).height() - 100;
  }
});

























//$(".thread").appear(function () {
//  var _this = this;
//
//  $.ajax({
//    type: 'GET',
//    url: API_BASE_URL + '/threads/' + this['id'].slice(7),
//    success: function (threadJson) {
//      var elSpan = _this.childNodes[1];
//      elSpan.innerHTML = threadJson['content'];
//
//      _this.dataset.pubdate = threadJson['pub_date'];
//
//      var elImg = _this.childNodes[0];
//      if (threadJson['image_url'] != '')
//        elImg.setAttribute('src', IMAGE_BASE_URL+threadJson['image_url']);
//      elImg.style.opacity = 1;
//    },
//    error: function (e) {
//      console.error(e);
//    }
//  });
//});

//$('#bar-right-menu').click(function () {
//  if ($(this).hasClass('bar-right-menu-active'))
//    closeRightMenu();
//  else
//    openRightMenu();
//});
//
//$('#button-latest-1-week').click(function () {
//  closeRightMenu();
//  if (isActive($(this)))
//    last1WeekMenuDeactive();
//  else
//    last1WeekMenuActive();
//});
//
//function openRightMenu() {
//  $('#bar-right-menu').addClass('bar-right-menu-active');
//  $('#config-menus').addClass('config-menus-active');
//}
//
//function closeRightMenu() {
//  $('#bar-right-menu').removeClass('bar-right-menu-active');
//  $('#config-menus').removeClass('config-menus-active');
//}
//
//function fadeOutThread(jqThread) {
//  jqThread.css({opacity: .5});
//  jqThread.addClass('thread-fade-out');
//}
//
//function fadeInThread(jqThread) {
//  jqThread.css({opacity: 1});
//  jqThread.removeClass('thread-fade-out');
//}
//
//function isActive(jqElement) {
//  return jqElement.hasClass('Active');
//}
//
//function last1WeekMenuActive() {
//  var menu = $('#button-latest-1-week');
//  menu.css({opacity:1});
//  menu.addClass('Active');
//
//  var last1WeekTime = new Date().getTime() - 604800000;  // 1000 * 60 * 60 * 24 * 7
//  $('.thread').each(function (index, element) {
//    var pubTime = new Date($(this).data('pubdate')).getTime();
//    if (pubTime < last1WeekTime)
//      fadeOutThread($(this));
//  });
//}
//
//function last1WeekMenuDeactive() {
//  var menu = $('#button-latest-1-week');
//  menu.css({opacity:.4});
//  menu.removeClass('Active');
//
//  $('.thread').each(function (index, element) {
//    var jqElement = $(element);
//    if (jqElement.hasClass('thread-fade-out'))
//      fadeInThread(jqElement);
//  });
//}