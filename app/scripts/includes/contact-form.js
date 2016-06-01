const ContactForm = function () {

  const $map = $('.js-contact-map').first();
  const $form = $('.js-contact-form').first();
  const $select = $('.js-contact-form-select').first();

  function init() {
    $map.on('click', handleMapClick);
    $map.on('mouseleave', handleMapMouseLeave);

    $form.on('submit', handleSubmit);

    $select.on('change', handleSelectChange);
  }

  function handleMapClick() {
    $map.find('iframe').css('pointer-events', 'auto');
  }

  function handleMapMouseLeave() {
    $map.find('iframe').css('pointer-events', 'none');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const url = App.globals().api + '/contact';
    const $button = $('#contact-form-submit').first();
    const $actionFail = $form.find('.action-fail').first();
    const $actionDone = $form.find('.action-done').first();

    const placement = 'bottom';
    const trigger = 'manual';

    $button.prop('disabled', true);
    $form.parent().removeClass('done fail');
    $form.parent().addClass('loading');

    let name = $('#contact-form-name').val().trim();
    let email = $('#contact-form-email').val().trim();
    let subject = $('#contact-form-subject').val().trim();
    let message = $('#contact-form-message').val().trim();

    $.post(url, {name, email, subject, message})
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
        $button.prop('disabled', false);

        setTimeout(function () {
          $actionFail.tooltip('hide');
          $actionDone.tooltip('hide');
          $form.parent().removeClass('done fail');
        }, 4000);
      });
  }

  function handleSelectChange() {
    const $placeholder = $('.js-contact-form-select-placeholder').first();

    $placeholder.text($('option:selected', this).text());
  }

  function selectChange(val) {
    $select.val(val).trigger('change');
  }

  return {
    init,
    selectChange
  }

}();
