function scrollStart(from, to) {
  var floor = {
    from: from, 
    to: to
  };
  node.trigger("scrollStart", floor);
}

function scrollEnd(from, to) {
  var floor = {
    from: from, 
    to: to
  };
  node.trigger("scrollEnd", floor);
}

node.on("scrollToDirection", function(event, direction) {
  handleDirection(direction);
});

node.on("scrollToStage", function(event, floor) {
  if (floor > floorCounter) return;
  scrollToStage(floor, self.options.time);
});


node.on("next", function(event, floor) {
  self.next();
});

node.on("prev", function(event, floor) {
  prev();
});

node.on("update", function() {
  nodeChildren = node.children(self.options.childType);
  resize();
});