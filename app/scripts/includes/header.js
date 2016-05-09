const Header = function () {

  const $body = $('body');
  const $header = $('.header').first();
  const $btn = $('.js-header-menu-toggle').first();

  function init() {
    $btn.on('click', toggleCallback);
  }

  function toggleCallback() {
    $header.toggleClass('header--expanded');
    $body.toggleClass('header--expanded');
  }

  return {
    init
  }
}();
