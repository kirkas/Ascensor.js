function handleDirection(direction) {
  if (self.options.direction == "y") {
    if (direction == ("left" || "right")) {
      return;
    } else if (direction == "down") {
      self.next();
    } else if (direction == "up") {
      prev();
    }

  } else if (self.options.direction == "x") {
    if (direction == ("up" || "down")) return;
    if (direction == "left") {
      prev();
    } else if (direction == "right") {
      self.next();
    }

  } else if (self.options.direction == "chocolate") {
    if (direction == "down") {
      handleChocolateDirection(1, 0);
    } else if (direction == "up") {
      handleChocolateDirection(-1, 0);
    } else if (direction == "left") {
      handleChocolateDirection(0, - 1);
    } else if (direction == "right") {
      handleChocolateDirection(0, 1);
    }
  }
}

function prev() {
  var prevFloor = floorActive - 1;
  if (prevFloor < 0) {
    if (!self.options.loop) return;
    prevFloor = floorCounter;
  }
  scrollToStage(prevFloor, self.options.time);
}

this.next = function(){
  var nextFloor = floorActive + 1;
  if (nextFloor > floorCounter) {
    if (!self.options.loop) return;
    nextFloor = 0;
  }
  scrollToStage(nextFloor, self.options.time);
};

function handleChocolateDirection(addCoordY, addCoordX) {
  var floorReference = [self.options.ascensorMap[floorActive][0] + addCoordY, self.options.ascensorMap[floorActive][1] + addCoordX];
  $.each(self.options.ascensorMap, function(index) {
    if (floorReference.toString() == self.options.ascensorMap[index].toString()) {
      scrollToStage(index, self.options.time);
    }
  });
}