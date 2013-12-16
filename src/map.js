var floorMap = [];

function generateFloorMap() {

  /* Use only array if chilren is present on stage */
  var directionArray = jQuery.grep(self.options.direction, function(directionArray, index) {
    return (node.children().length > index);
  });
  

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
    if (closest && directionArray.indexOf(closest) !== -1) {
      return directionArray.indexOf(closest);
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
    if (furthest && directionArray.indexOf(furthest) !== -1) {
      return directionArray.indexOf(furthest);
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
    if (floor && directionArray.indexOf(floor) !== -1) {
      return directionArray.indexOf(floor);
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
    if (floor && directionArray.indexOf(floor) !== -1) {
      return directionArray.indexOf(floor);
    } else {
      return false;
    }
  }

  function getFloor(x, y, floorOne, floorTwo) {
    if (floorOne[0] + x == floorTwo[0] && floorOne[1] + y == floorTwo[1]) {
      return directionArray.indexOf(floorTwo);
    } else {
      return false;
    }
  }


  function getFurtherFloorOnAxis(floorArray, axis) {
    var furtherFloor = false;
    jQuery.each(floorArray, function(index, directionArray){
      if(furtherFloor === false || furtherFloor[axis] < directionArray[axis]){
        furtherFloor = directionArray;
      }
    });
    return furtherFloor;
  }
  
  function getClosestFloorOnAxis(floorArray, axis) {
    var furtherFloor=false;
    jQuery.each(floorArray, function(index, directionArray){
      if(furtherFloor === false || furtherFloor[axis] > directionArray[axis]){
        furtherFloor = directionArray;
      }
    });
    return furtherFloor;
  }
  
  function getSameAxisFloor(floorItem, axis) {
    return jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[axis] == floorItem[axis];
      return isOnSameAxis;
    });
  }
  
  var approximateFurtherX = getFurtherFloorOnAxis(directionArray, 1);
  var sameAxisXFurthest = getSameAxisFloor(approximateFurtherX, 1);
  var furtherY = getFurtherFloorOnAxis(sameAxisXFurthest, 0);
  
  var approximateFurtherY = getFurtherFloorOnAxis(directionArray, 0);
  var sameAxisYFurthest = getSameAxisFloor(approximateFurtherY, 0);
  var furtherX = getFurtherFloorOnAxis(sameAxisYFurthest, 1);
  
  floorMap.furthest_x = directionArray.indexOf(furtherX);
  floorMap.furthest_y = directionArray.indexOf(furtherY);
  
  var approximateClosestX = getClosestFloorOnAxis(directionArray, 1);
  var sameAxisXClosest = getSameAxisFloor(approximateClosestX, 1);
  var closestY = getClosestFloorOnAxis(sameAxisXClosest, 0);

  var approximateClosestY = getClosestFloorOnAxis(directionArray, 0);
  var sameAxisYClosest = getSameAxisFloor(approximateClosestY, 0);
  var closestX = getClosestFloorOnAxis(sameAxisYClosest, 1);
  
  floorMap.closest_x = directionArray.indexOf(closestX);
  floorMap.closest_y = directionArray.indexOf(closestY);
  

  $.each(directionArray, function(index, floorItem) {
    var axisXfloor = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0];
      var isCurrentFloor = floorItem == directionArray;
      return (isOnSameAxis && !isCurrentFloor);
    });

    var axisYfloor = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1];
      var isCurrentFloor = floorItem == directionArray;
      return (isOnSameAxis && !isCurrentFloor);
    });

    var directNextXAxis = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0] + 1;
      return isOnSameAxis;
    });

    var directPreviousXAxis = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0] - 1;
      return isOnSameAxis;
    });

    var directNextYAxis = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1] + 1;
      return isOnSameAxis;
    });

    var directPreviousYAxis = jQuery.grep(directionArray, function(directionArray) {
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

    $.each(directionArray, function(indexSecond, floorItemSecond) {
      if (floorMap[index].down === false) floorMap[index].down = getFloor(1, 0, floorItem, floorItemSecond);
      if (floorMap[index].up === false) floorMap[index].up = getFloor(-1, 0, floorItem, floorItemSecond);
      if (floorMap[index].right === false) floorMap[index].right = getFloor(0, 1, floorItem, floorItemSecond);
      if (floorMap[index].left === false) floorMap[index].left = getFloor(0, - 1, floorItem, floorItemSecond);
    });
  });

  console.log(floorMap);
}