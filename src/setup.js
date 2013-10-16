node.css({
  "position" : "absolute",
  "width" : WW,
  "height" : WH
});

nodeChildren.width(WW).height(WH).each(function(index) {
  floorCounter += 1;
});

if (self.options.direction === "x" || self.options.direction === "chocolate") {
  nodeChildren.css({
    "position": "absolute",
    "overflow": "auto"
  });
}

if (self.options.keyNavigation) {
  $document.keydown(checkKey);
}

if (self.options.ascensorFloorName && window.location.hash) {
  var hashFloor = getFloorFromHash();
  if(hashFloor){
    floorActive = hashFloor;
  }
}

scrollToStage(floorActive, 1, true);

if (self.options.touchSwipeIntegration) {
  node.swipe({
    swipe: function(event, direction, distance, duration, fingerCount) {
      node.trigger("scrollToDirection", direction);
    },
    threshold: 70
  });
}

$window.resize(function() {
  resize();
}).resize();

if (window.DeviceOrientationEvent) {
  $window.bind('orientationchange', function() {
    resize();
  });
}