var defaultTime = 300;
var $fixture;
var WW = $(window).width();
var WH = $(window).height();
var scrollEndSpy;
var scrollStartSpy;
var fixture;
beforeEach(function() {
  loadFixtures("ascensor.html");
  $fixture = $("#ascensorBuilding");
  fixture = $('<div id="ascensorBuilding"><div></div><div></div><div></div></div>');
});

afterEach(function() {

  $fixture = null;
  fixture = null;
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

$(document).ready(function() {
  WW = $(window).width();
  WH = $(window).height();
});

$(window).resize(function() {
  WW = $(window).width();
  WH = $(window).height();
}).resize();