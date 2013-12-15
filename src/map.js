var floorMap = [];
function generateFloorMap() {
  
  function getClosestFloor(floor, floorCollection, axis, direction) {
    var goal = floor[axis];
    var closest = false;
    $.each(floorCollection, function() {
      if (((direction == "right" ||  direction == "down") && (this[axis] > floor[axis])) || ((direction == "left" ||  direction == "up") && (this[axis] < floor[axis]))) {
        if (!closest || Math.abs(this[axis] - goal) < Math.abs(closest[axis] - goal)) {
          closest = this;
        }
      }
    });
    if(closest && self.options.direction.indexOf(closest) !== -1) {
      return self.options.direction.indexOf(closest);
    } else {
      return false;
    }
  }

  function getfurthestFloor(floor, floorCollection, axis, direction) {
    var goal = floor[axis];
    var furthest = false;
    $.each(floorCollection, function() {
      if (!furthest || Math.abs(this[axis] - goal) > Math.abs(furthest[axis] - goal)) {
         furthest = this;
      }
    });
    if(furthest && self.options.direction.indexOf(furthest) !== -1) {
      return self.options.direction.indexOf(furthest);
    } else {
      return false;
    }
  }
  
  function getIncrementedFloor(floorCollection, axis) {
    var goal = 0;
    var floor = false;
    $.each(floorCollection, function() {
      if (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) {
         floor = this;
      }
    });
    if(floor && self.options.direction.indexOf(floor) !== -1) {
      return self.options.direction.indexOf(floor);
    } else {
      return false;
    }
  }
  
  function getDecrementedFloor(floorCollection, axis) {
    var goal = 0;
    var floor = false;
    $.each(floorCollection, function() {
      if (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) {
         floor = this;
      }
    });
    if(floor && self.options.direction.indexOf(floor) !== -1) {
      return self.options.direction.indexOf(floor);
    } else {
      return false;
    }
  }

  function getFloor(x, y, floorOne, floorTwo) {
    if(floorOne[0] + x == floorTwo[0] && floorOne[1] + y == floorTwo[1]) {
      return self.options.direction.indexOf(floorTwo);
    } else {
      return false;
    }
  }

  $.each(self.options.direction, function(index, floorItem) {
    var axisXfloor = jQuery.grep(self.options.direction, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0];
      var isCurrentFloor = floorItem == directionArray;
      return (isOnSameAxis && !isCurrentFloor);
    });

    var axisYfloor = jQuery.grep(self.options.direction, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1];
      var isCurrentFloor = floorItem == directionArray;
      return (isOnSameAxis && !isCurrentFloor);
    });
    
    var directNextXAxis = jQuery.grep(self.options.direction, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0]+1;
      return isOnSameAxis;
    });
    
    var directPreviousXAxis = jQuery.grep(self.options.direction, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0] - 1;
      return isOnSameAxis;
    });
    
    var directNextYAxis = jQuery.grep(self.options.direction, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1]+1;
      return isOnSameAxis;
    });
    
    var directPreviousYAxis = jQuery.grep(self.options.direction, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1] - 1;
      return isOnSameAxis;
    });

    floorMap[index] = {
      "down": false,
      "up": false,
      "right": false,
      "left": false,
      "increment": {
        "down": getIncrementedFloor(directNextYAxis, 1),
        "up": getDecrementedFloor(directPreviousYAxis, 0),
        "right": getIncrementedFloor(directNextXAxis, 0),
        "left": getDecrementedFloor(directPreviousXAxis, 1)
      },
      "closest": {
        "down": getClosestFloor(floorItem, axisYfloor, 0, "down"),
        "up": getClosestFloor(floorItem, axisYfloor, 0, "up"),
        "right": getClosestFloor(floorItem, axisXfloor, 1, "right"),
        "left": getClosestFloor(floorItem, axisXfloor, 1, "left")
      },
      "furthest": {
        "down": getfurthestFloor(floorItem, axisYfloor, 0, "down"),
        "up": getfurthestFloor(floorItem, axisYfloor, 0, "up"),
        "right": getfurthestFloor(floorItem, axisXfloor, 1, "right"),
        "left": getfurthestFloor(floorItem, axisXfloor, 1, "left")
      }
    };

    $.each(self.options.direction, function(indexSecond, floorItemSecond) {
      if (floorMap[index].down === false) floorMap[index].down = getFloor(1, 0, floorItem, floorItemSecond);
      if (floorMap[index].up === false) floorMap[index].up = getFloor(-1, 0, floorItem, floorItemSecond);
      if (floorMap[index].right === false) floorMap[index].right = getFloor(0, 1, floorItem, floorItemSecond);
      if (floorMap[index].left === false) floorMap[index].left = getFloor(0, -1, floorItem, floorItemSecond);
    });
  });
}