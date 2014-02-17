function scrollToStage(floor, time, firstrun) {
  firstrun = firstrun ||  false;
  scrollStart(floorActive, floor);

  var animationParams = {
    time: time || self.options.time,
    easing: self.options.easing,
    callback: function() {
      scrollEnd(floorActive, floor);
    }
  };

  if (self.options.direction === "y") {
    animationParams.property = {
      scrollTop: (floor) * NH
    };
  } else if (self.options.direction === "x") {
    animationParams.property = {
      scrollLeft: (floor) * NW
    };
  } else if (chocolate) {
    animationParams.property = {
      scrollLeft: (self.options.direction[floor][1]) * NW,
      scrollTop: (self.options.direction[floor][0]) * NH
    };

    if (self.options.queued) {
      var sameXposition = node.scrollLeft() === self.options.direction[floor][1] * NW;
      var sameYposition = node.scrollTop() === self.options.direction[floor][0] * NH;
      if (self.options.queued === "x") {
        if (sameXposition) {
          animationParams.property = {
            scrollTop: (self.options.direction[floor][0]) * NH
          };
        } else {
          animationParams.property = {
            scrollLeft: (self.options.direction[floor][1]) * NW
          };
          animationParams.callback = function() {
            node.stop().animate({
                scrollTop: (self.options.direction[floor][0]) * NH
              },
              time,
              self.options.easing,

              function() {
                scrollEnd(floorActive, floor);

              });
          };
        }
      } else if (self.options.queued === "y") {
        if (sameYposition) {
          animationParams.property = {
            scrollLeft: (self.options.direction[floor][1]) * NW
          };
        } else {
          animationParams.property = {
            scrollTop: (self.options.direction[floor][0]) * NH
          };
          animationParams.callback = function() {
            node.stop().animate({
                scrollLeft: (self.options.direction[floor][1]) * NW
              },
              time,
              self.options.easing,

              function() {
                scrollEnd(floorActive, floor);
              });
          };
        }
      }
    }
  }

  node.stop().animate(animationParams.property, time, self.options.easing, animationParams.callback);

  if (firstrun && typeof(self.options.ready) == "function") {
    self.options.ready();
  }

  if (self.options.ascensorFloorName) {
    window.location.replace(('' + window.location).split('#')[0] + '#' + self.options.ascensorFloorName[floor]);
  }

  floorActive = floor;
  node.data("current-floor", floorActive);
}