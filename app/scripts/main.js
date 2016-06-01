//=require includes/bootstrap.js
//=require includes/breakpoints.js
//=require includes/header.js
//=require includes/feed-form.js
//=require includes/contact-form.js

const App = function () {

  const $logoLink = $('.js-jump-top');
  const $contactLink = $('.js-jump-contact');
  const $joinusLink = $('.js-jump-joinus');

  function init() {
    Header.init();
    FeedForm.init();
    ContactForm.init();

    $logoLink.on('click', handleLogoLink);
    $contactLink.on('click', handleHashLink);
    $joinusLink.on('click', handleHashLink);

    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
      if (window.location.hash.length > 3) {
        goToByScroll(window.location.hash.replace('#', ''));
      }
    }
  }

  function globals() {
    return {
      hostname: 'http://www.basejr.com.br',
      api: 'http://internal.basejr.com.br'
    };
  }

  function handleLogoLink(event) {
    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
      event.preventDefault();
      goToByScroll('top');
      window.location.hash = '';
    }
  }

  function handleHashLink(event) {
    event.preventDefault();

    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
      goToByScroll($(this).data('hash'));
      window.location.hash = $(this).data('hash');

    } else {
      window.location = App.globals().hostname + '/#' + $(this).data('hash');
    }
  }

  function goToByScroll(href) {
    if (href == 'contato') {
      ContactForm.selectChange('informacoes');

    } else if (href == 'participe') {
      ContactForm.selectChange('processo_seletivo');
      href = 'contato';
    }

    if (href == 'top') {
      $('html, body').animate({
        scrollTop: 0
      }, 'slow');

    } else {
      $('html, body').animate({
        scrollTop: $('#' + href).offset().top - 50
      }, 'slow');
    }
  }

  return {
    init,
    globals
  }

}();

(function () {
  App.init();
}());
