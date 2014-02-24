nodeChildren.each(function(index) {
  floorCounter += 1;
});


node.css({
  "position": "absolute",
  "overflow": "hidden",
  "top": "0",
  "left": "0",
  "width": self.options.width,
  "height": self.options.height
});

nodeChildren.css({
  "position": "absolute",
  "overflow": "auto",
  "top": "0",
  "left": "0",
  "width": "100%",
  "height": "100%"
});


NH = node.width();
NW = node.height();

if (chocolate) {
  generateFloorMap();
}

node.data("current-floor", floorActive);

if (self.options.keyNavigation) {
  $document.keydown(checkKey);
}

if (self.options.ascensorFloorName && window.location.hash) {
  var hashFloor = getFloorFromHash();
  if (hashFloor) {
    floorActive = hashFloor;
  }
}

$(window).on('hashchange', function() {
  var hashFloor = getFloorFromHash();
  if (hashFloor && !node.is(':animated')) {
    scrollToStage(hashFloor, self.options.time);
  }
});

$window.resize(function() {
  resize();
}).load(function() {
  resize();
}).resize();


if (window.DeviceOrientationEvent) {
  $window.bind('orientationchange', function() {
    resize();
  });
}

scrollToStage(floorActive, 1, true);