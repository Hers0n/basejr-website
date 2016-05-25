const Feed = function () {

  const $form = $('.js-feed-form').first();
  const $input = $form.find('input').first();

  function init() {
    $form.on('submit', handleSubmit);
  }

  function handleSubmit(event) {
    event.preventDefault();

    let email = $input.val().trim();
    
    console.log(email);
  }

  return {
    init
  }

}();
