function scrollToStage(floor, time, hashChange) {
  var animationParams = {
    time: time,
    easing: self.options.easing,
    callback: function() {
      scrollEnd();
    }
  };

  if (self.options.direction === "y") {
    animationParams.property = {
      scrollTop: (floor) * WH
    };
  } else if (self.options.direction === "x") {
    animationParams.property = {
      scrollLeft: (floor) * WW
    };
  } else if (self.options.direction === "chocolate") {
    animationParams.property = {
      scrollLeft: (self.options.ascensorMap[floor][1]) * WW,
      scrollTop: (self.options.ascensorMap[floor][0]) * WH
    };

    if (self.options.queued) {
      var sameXposition = node.scrollLeft() === self.options.ascensorMap[floor][1] * WW;
      var sameYposition = node.scrollTop() === self.options.ascensorMap[floor][0] * WH;
      if (self.options.queuedDirection === "x") {
        if (sameXposition) {
          animationParams.property = {
            scrollTop: (self.options.ascensorMap[floor][0]) * WH
          };
        } else {
          animationParams.property = {
            scrollLeft: (self.options.ascensorMap[floor][1]) * WW
          };
          animationParams.callback = function() {
            node.stop().animate({
              scrollTop: (self.options.ascensorMap[floor][0]) * WH
            },
            time,
            self.options.easing,

            function() {
              scrollEnd();
            });
          };
        }
      } else if (self.options.queuedDirection === "y") {
        if (sameYposition) {
          animationParams.property = {
            scrollLeft: (self.options.ascensorMap[floor][1]) * WW
          };
        } else {
          animationParams.property = {
            scrollTop: (self.options.ascensorMap[floor][0]) * WH
          };
          animationParams.callback = function() {
            node.stop().animate({
              scrollLeft: (self.options.ascensorMap[floor][1]) * WW
            },
            time,
            self.options.easing,

            function() {
              scrollEnd();
            });
          };
        }
      }
    }
  }

  node.stop().animate(animationParams.property, time, self.options.easing, animationParams.callback);

  if (!hashChange && self.options.ascensorFloorName !== null) {
    window.location.hash = "/" + self.options.ascensorFloorName[floor];
  }

  floorActive = floor;
}