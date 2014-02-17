var defaultTime = 300;
var $fixture;
var WW = 400;
var WH = 600;
var scrollEndSpy;
var scrollStartSpy;
var fixture;

beforeEach(function() {
  loadFixtures("ascensor.html");
  loadFixtures("ascensorWrapper.html");
  $fixture = $("#ascensorBuilding");
  $fixtureWrapper = $("#ascensorWrapper");
  jasmine.clock().install();
});

afterEach(function() {
  jasmine.clock().uninstall();
  $fixture = null;
  $fixtureWrapper = null;
  fixture = null;
});

function getWrappedOfAscensor(parameter) {
  return $fixtureWrapper.find("#ascensorBuilding").ascensor(parameter);
}

function getInstanceOfAscensor(parameter) {
  return $fixture.ascensor(parameter);
}

function keyEventGenerator(key) {
  var e = jQuery.Event("keydown");
  e.which = key;
  e.keyCode = key;
  $(document).trigger(e);
}

// $(document).ready(function() {
//   WW = $(window).width();
//   WH = $(window).height();
// });

// $(window).resize(function() {
//   WW = $(window).width();
//   WH = $(window).height();
// }).resize();