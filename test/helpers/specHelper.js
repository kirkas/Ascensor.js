var defaultTime = 300;
var $fixture;
var WW = 400;
var WH = 600;
var scrollEndSpy;
var scrollStartSpy;
var fixture;

beforeEach(function() {
  loadFixtures("ascensor.html");
  $fixture = $("#ascensorBuilding");
  jasmine.clock().install();
});

afterEach(function() {
  jasmine.clock().uninstall();
  $fixture = null;
});


function getInstanceOfAscensor(parameter) {
  return $fixture.ascensor(parameter);
}

function keyEventGenerator(key) {
  var e = jQuery.Event("keydown");
  e.which = key;
  e.keyCode = key;
  $(document).trigger(e);
}

function matrixToArray(str) {
  return str.match(/(-?[0-9\.]+)/g);
};

function getTransform(el) {
  var results = $(el).css('-webkit-transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/)

  if (!results) return [0, 0, 0];
  if (results[1] == '3d') return results.slice(2, 5);

  results.push(0);
  return results.slice(5, 8);
}