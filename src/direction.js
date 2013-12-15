function handleDirection(direction) {
  if (self.options.direction == "y") {
    if (direction == ("left" || "right")) return;
    if (direction == "down") {
      self.next();
    } else if (direction == "up") {
      self.prev();
    }
  } else if (self.options.direction == "x") {
    if (direction == ("up" || "down")) return;
    if (direction == "left") {
      self.prev();
    } else if (direction == "right") {
      self.next();
    }
  } else if (chocolate) {
    var targetId;

    if (floorMap[floorActive][direction] !== false) {
      targetId = floorMap[floorActive][direction];
    } else if (self.options.jump === true && floorMap[floorActive].closest[direction] !== false) {
      targetId = floorMap[floorActive].closest[direction];

    } else if (self.options.loop === true && floorMap[floorActive].furthest[direction] !== false) {
      targetId = floorMap[floorActive].furthest[direction];
    } else if (self.options.loop === "increment" && floorMap[floorActive].increment[direction] !== false) {
      targetId = floorMap[floorActive].increment[direction];
    } else if (self.options.loop === "increment-x" && (direction == "right" || direction == "left") && floorMap[floorActive].increment[direction] !== false) {
      targetId = floorMap[floorActive].increment[direction];
    } else if (self.options.loop === "increment-y" && (direction == "down" || direction == "up") && floorMap[floorActive].increment[direction] !== false) {
      targetId = floorMap[floorActive].increment[direction];
    } else if (self.options.loop == "loop-x" && (direction == "right" || direction == "left") && floorMap[floorActive].furthest[direction] !== false) {
      targetId = floorMap[floorActive].furthest[direction];
    } else if (self.options.loop == "loop-y" && (direction == "down" || direction == "up") && floorMap[floorActive].furthest[direction] !== false) {
      targetId = floorMap[floorActive].furthest[direction];
    }

    if (typeof targetId === "number") {
      scrollToStage(targetId, self.options.time);
    }
  }
}

this.prev = function() {
  var prevFloor = floorActive - 1;
  if (prevFloor < 0) {
    if (!self.options.loop) return;
    prevFloor = floorCounter;
  }
  scrollToStage(prevFloor, self.options.time);
};

this.next = function() {
  var nextFloor = floorActive + 1;
  if (nextFloor > floorCounter) {
    if (!self.options.loop) return;
    nextFloor = 0;
  }
  scrollToStage(nextFloor, self.options.time);
};