function resize() {
  WW = $window.width();
  WH = $window.height();
  
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
    
    scrollToStage(floorActive, 1);
    
    node.stop().scrollLeft((self.options.direction[floorActive][1]) * WW).scrollTop((self.options.direction[floorActive][0]) * WH);
  }
}