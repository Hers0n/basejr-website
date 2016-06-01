//=require breakpoints.js

const FeedForm = function () {

  const $form = $('.js-feed-form').first();

  function init() {
    $form.on('submit', handleSubmit);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const url = App.globals().api + '/mail';
    const $input = $form.find('input').first();
    const $button = $form.find('button').first();
    const $actionFail = $form.find('.action-fail').first();
    const $actionDone = $form.find('.action-done').first();

    $button.prop('disabled', true);
    $input.prop('disabled', true);
    $form.parent().removeClass('done fail');
    $form.parent().addClass('loading');

    let email = $input.val().trim();
    const placement = 'top';
    const trigger = 'manual';

    $.post(url, {email})
      .done(function () {
        $form.parent().addClass('done');

        $actionDone.tooltip({
          placement,
          trigger
        });
        $actionDone.tooltip('show');
      })
      .fail(function () {
        $form.parent().addClass('fail');

        $actionFail.tooltip({
          placement,
          trigger
        });
        $actionFail.tooltip('show');
      })
      .always(function () {
        $form.parent().removeClass('loading');

        setTimeout(function () {
          $input.val('');
          $input.prop('disabled', false);
          $button.prop('disabled', false);
          $actionFail.tooltip('hide');
          $actionDone.tooltip('hide');
          $form.parent().removeClass('done fail');
        }, 4000);
      });
  }

  return {
    init
  }

}();
