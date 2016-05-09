const Breakpoint = function () {

  /* must match css breakpoints, check app/styles/includes/variables.scss */
  const bp = {
    medium: 768,
    large: 1200
  };

  function viewport() {
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0];

    return {
      width: w.innerWidth || e.clientWidth || g.clientWidth,
      height: w.innerHeight || e.clientHeight || g.clientHeight
    }
  }

  function is(query) {
    switch (query) {
      case 'small':
        return active() == 'small';
      case 'medium':
        return active() == 'medium';
      case 'large':
        return active() == 'large';
      case 'not small':
        return active() == 'medium' || active() == 'large';
      default:
        return false;
    }
  }

  function active() {
    let cw = viewport().width;
    if (cw < bp.medium) return 'small';
    if (cw < bp.large) return 'medium';
    if (cw >= bp.large) return 'large';
  }

  function large() {
    return bp.large;
  }

  function medium() {
    return bp.medium;
  }

  return {
    active,
    is,
    large,
    medium,
    viewport
  }

}();
