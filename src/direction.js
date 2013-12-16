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

    /* If existing, use direct depending floor */
    if (floorMap[floorActive][direction] !== false) {
      targetId = floorMap[floorActive][direction];
    }

    /* Jump is set to true, use the closest floor in that same direction */
    else if (self.options.jump === true && floorMap[floorActive].closest[direction] !== false) {
      targetId = floorMap[floorActive].closest[direction];
    }

    /* If loop is set to true, use the furthest floor */
    else if (self.options.loop === true) {
      targetId = floorMap[floorActive].furthest[direction];
      
    /* If loop is specify on axis */
    } else if (self.options.loop == "loop-x" && (direction == "right" || direction == "left") && floorMap[floorActive].furthest[direction] !== false) {
      targetId = floorMap[floorActive].furthest[direction];
    } else if (self.options.loop == "loop-y" && (direction == "down" || direction == "up") && floorMap[floorActive].furthest[direction] !== false) {
      targetId = floorMap[floorActive].furthest[direction];
    }

    /* if loop is set to a increment */
    else if (typeof self.options.loop === "string") {
      var correctYDirection = ((direction == "down" || direction == "up") && self.options.loop == "increment-y");
      var correctXDirection = ((direction == "right" || direction == "left") && self.options.loop == "increment-x");
      
      /* if a increment is possible */
      if (floorMap[floorActive].increment[direction] !== false) {
        if (correctYDirection || correctXDirection || self.options.loop == "increment") {
          targetId = floorMap[floorActive].increment[direction];
        }
        
      /* If you are on the last/first floor, jump to the opposite floor */
      } else {
        if (direction == "right" || direction == "left" ) {
          if (self.options.loop == "increment-y") return;
          if (floorActive == floorMap.furthest_x) {
            targetId = floorMap.closest_x;
          } else if (floorActive == floorMap.closest_x) {
            targetId = floorMap.furthest_x;
          }
        } else if (direction == "down" || direction == "up" ) {
          if (self.options.loop == "increment-x") return;
          if (floorActive == floorMap.furthest_y) {
            targetId = floorMap.closest_y;
          } else if (floorActive == floorMap.closest_y) {
            targetId = floorMap.furthest_y;
          }
        }
      }
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