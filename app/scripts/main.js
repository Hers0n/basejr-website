//=require includes/breakpoints.js
//=require includes/header.js

const App = function () {

  function init() {
    Header.init();
  }

  return {
    init
  }

}();

(function () {
  App.init();
}());
