// From https://gist.github.com/lorenzopolidori/3794226
function has3d() {
  var el = document.createElement('p'),
    support3D,
    transforms = {
      'webkitTransform': '-webkit-transform',
      'OTransform': '-o-transform',
      'msTransform': '-ms-transform',
      'MozTransform': '-moz-transform',
      'transform': 'transform'
    };

  // Add it to the body to get the computed style
  document.body.insertBefore(el, null);

  for (var t in transforms) {
    if (el.style[t] !== undefined) {
      el.style[t] = 'translate3d(1px,1px,1px)';
      support3D = window.getComputedStyle(el).getPropertyValue(transforms[t]);
    }
  }

  document.body.removeChild(el);

  return (support3D !== undefined && support3D.length > 0 && support3D !== "none");
}