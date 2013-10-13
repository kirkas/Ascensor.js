function resize() {
  WW = $window.width();
  WH = $window.height();
  
  nodeChildren.width(WW).height(WH);
  node.width(WW).height(WH);

  if (self.options.direction === "y") {
    node.stop().scrollTop((self.floorActive) * WH);
  }

  if (self.options.direction === "x") {
    node.stop().scrollLeft((self.floorActive) * WW);
    nodeChildren.each(function(index) {
      $(this).css("left", index * WW);
    });
  }

  if (self.options.direction === "chocolate") {
    nodeChildren.each(function(index) {
      $(this).css({
        "left": (self.options.ascensorMap[index][1]) * WW,
        "top": (self.options.ascensorMap[index][0]) * WH
      });
    });
    node.stop().scrollLeft((self.options.ascensorMap[floorActive][1]) * WW).scrollTop((self.options.ascensorMap[floorActive][0]) * WH);
  }
}