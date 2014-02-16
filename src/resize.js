function getProperValue (value, parentValue) {
  if(typeof (value) == "string") {
    if(value.indexOf("%") !== -1) return parentValue / 100 * parseInt(value, 10);
    if(value.indexOf("px") !== -1) return parseInt(value, 10);
  } else {
    return value;
  }
}

function resize() {

  WW = getProperValue(self.options.width, self.options.context.width());
  WH = getProperValue(self.options.height, self.options.context.height());

  nodeChildren.width(WW).height(WH);
  node.width(WW).height(WH);

  if (self.options.direction === "y") {
    node.stop().scrollTop((floorActive) * WH);
  }

  if (self.options.direction === "x") {
    node.stop().scrollLeft((floorActive) * WW);
    nodeChildren.each(function(index) {
      $(this).css("left", index * WW);
    });
  }

  if (chocolate) {
    nodeChildren.each(function(index) {
      $(this).css({
        "left": (self.options.direction[index][1]) * WW,
        "top": (self.options.direction[index][0]) * WH
      });
    });
    node.stop().scrollLeft((self.options.direction[floorActive][1]) * WW).scrollTop((self.options.direction[floorActive][0]) * WH);
  }
}