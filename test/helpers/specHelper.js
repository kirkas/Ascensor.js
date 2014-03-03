var defaultTime = 250;
var $fixture;
var WW = 400;
var WH = 600;
var scrollEndSpy;
var scrollStartSpy;
var fixture;

var KEY = {
  DOWN: 40,
  UP: 38,
  LEFT: 37,
  RIGHT: 39,
  A: 65,
  S: 83,
  D: 68,
  W: 87,
};

navigator.__defineGetter__('userAgent', function() {
  return 'foo' // customized user agent
});

navigator.userAgent; // 'foo'
beforeEach(function() {
  loadFixtures('ascensor.html');
  $fixture = $('#ascensorBuilding');
  jasmine.clock().install();
  $(window).off('hashchange');
  window.location.hash = '';
});

afterEach(function() {
  jasmine.clock().uninstall();
  $fixture = null;
  $(window).off('hashchange');
  window.location.hash = '';
});


function getInstanceOfAscensor(parameter) {
  return $fixture.ascensor(parameter);
}

function keyEventGenerator(key) {
  var e = jQuery.Event('keydown');
  e.which = key;
  e.keyCode = key;
  $(document).trigger(e);
}

function matrixToArray(str) {
  return str.match(/(-?[0-9\.]+)/g);
}

function getTransform(el) {
  var results = $(el).css('transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/);

  if (!results) return [0, 0, 0];
  if (results[1] == '3d') return results.slice(2, 5);

  results.push(0);
  return results.slice(5, 8);
}