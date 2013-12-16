node.css({
  "position" : "absolute",
  "overflow": "hidden"
});

nodeChildren.each(function(index) {
  floorCounter += 1;
});

if (self.options.direction === "x" || chocolate) {
  nodeChildren.css({
    "position": "absolute",
    "overflow": "auto"
  });
}

if(chocolate){
  generateFloorMap();
}

node.data("current-floor", floorActive);

if (self.options.keyNavigation) {
  $document.keydown(checkKey);
}

if (self.options.ascensorFloorName && window.location.hash) {
  var hashFloor = getFloorFromHash();
  if(hashFloor){
    floorActive = hashFloor;
  }
}

scrollToStage(floorActive, 1);

if (self.options.touchSwipeIntegration) {
  node.swipe({
    swipe: function(event, direction, distance, duration, fingerCount) {
      node.trigger("scrollToDirection", direction);
    },
    threshold: 70
  });
}

$(window).on('hashchange',function(){
  var hashFloor = getFloorFromHash();
  if(hashFloor && !node.is(':animated')){
    scrollToStage(hashFloor, self.options.time);
  }
}),



$window.resize(function() {
  resize();
}).load(function(){
  resize();
}).resize();

if (window.DeviceOrientationEvent) {
  $window.bind('orientationchange', function() {
    resize();
  });
}

