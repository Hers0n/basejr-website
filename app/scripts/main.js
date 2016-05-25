//=require includes/breakpoints.js
//=require includes/header.js
//=require includes/feed.js

const App = function () {

  function init() {
    Header.init();
    Feed.init();
  }

  return {
    init
  }

}();

(function () {
  App.init();
}());
