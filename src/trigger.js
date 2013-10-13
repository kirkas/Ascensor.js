function scrollStart() {
  node.trigger({
    type: "ascensorStart",
    floor: floorActive
  });
}

function scrollEnd() {
  node.trigger({
    type: "ascensorEnd",
    floor: floorActive
  });
}

node.on("scrollToDirection", function(event, direction) {
  if (direction == "next") {
    next();
  } else if (direction == "prev") {
    prev();
  } else {
    handleDirection(direction);
  }
});

node.on("scrollToStage", function(event, floor) {
  if(floor > floorCounter) return;
  scrollToStage(floor);
});


node.on("next", function(event, floor) {
  next();
});

node.on("prev", function(event, floor) {
  prev();
});

node.on("update", function() {
  nodeChildren = node.children(self.options.childType);
  resize();
});