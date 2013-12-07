node.css({
  "position" : "absolute"
});

nodeChildren.each(function(index) {
  floorCounter += 1;
});

node.bind("DOMNodeInserted", function(event){
  if(node.children().length > nodeChildren.length || node.children().length < nodeChildren.length) {
    nodeChildren = node.children(self.options.childType);
    if (self.options.direction === "x" || chocolate) {
      nodeChildren.css({
        "position": "absolute",
        "overflow": "auto"
      });
    }
    floorCounter = -1;
    nodeChildren.each(function(index) {
      floorCounter += 1;
    });

    childrenLenght = node.children().length;
    node.trigger("refresh");
    resize();
  }
});



if (self.options.direction === "x" || chocolate) {
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

scrollToStage(floorActive, 1);

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
}).load(function(){
  resize();
}).resize();

if (window.DeviceOrientationEvent) {
  $window.bind('orientationchange', function() {
    resize();
  });
}