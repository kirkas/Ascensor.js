node.css({
  "position" : "absolute",
  "width" : WW,
  "height" : WH
});

nodeChildren.width(WW).height(WH).each(function(index) {
  floorCounter += 1;
  $(this).attr("id", self.options.ascensorName + "Floor" + floorCounter).addClass(self.options.ascensorName + "Floor");
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


$window.on("hashchange", function() {
  hashChange();
});

scrollToStage(floorActive, 1, true);
hashChange(true);

if (self.options.touchSwipeIntegration) {
  node.swipe({
    swipe: function(event, direction, distance, duration, fingerCount) {
      var ascensorDirStr = "";
      if (direction == "up") ascensorDirStr = "Down";
      else if (direction == "down") ascensorDirStr = "Up";
      else if (direction == "left") ascensorDirStr = "Right";
      else if (direction == "right") ascensorDirStr = "Left";
      node.trigger({
        type: "ascensor" + ascensorDirStr,
        floor: floorActive
      });
    },
    threshold: 70
  });
}