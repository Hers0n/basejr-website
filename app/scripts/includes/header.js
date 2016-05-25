//=require breakpoints.js

const Header = function () {

  const $body = $('body');
  const $header = $('.header').first();
  const $btn = $('.js-header-menu-toggle').first();

  function init() {
    $btn.on('click', expandedCallback);

    $(window).on('scroll', fixedCallback);

    $(window).on('resize', resetCallback);
  }

  function expandedCallback() {
    $header.toggleClass('header--expanded');
    $body.toggleClass('header--expanded');
  }

  function fixedCallback() {
    if ($(window).scrollTop() >= 100) {
      $header.addClass('header--fixed');
    } else {
      $header.removeClass('header--fixed');
    }
  }

  function resetCallback() {
    if(Breakpoint.is('not small')) {
      $header.removeClass('header--expanded');
      $body.removeClass('header--expanded');
    }
  }

  return {
    init
  }

}();
