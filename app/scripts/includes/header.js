const Header = function () {

  const $body = $('body');
  const $header = $('.header').first();
  const $btn = $('.js-header-menu-toggle').first();

  function init() {
    $btn.on('click', expandCallback);

    $(window).on('scroll', fixCallback);
  }

  function expandCallback() {
    $header.toggleClass('header--expanded');
    $body.toggleClass('header--expanded');
  }

  function fixCallback() {
    if ($(window).scrollTop() >= 100) {
      $header.addClass('header--fixed');
    } else {
      $header.removeClass('header--fixed');
    }
  }

  return {
    init
  }
}();
