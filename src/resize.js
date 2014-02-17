function getCss(index, property) {
  var parentCss = NW;
  if (property == "top") parentCss = NH;
  var css = {
    property: (index * parentCss)
  };
  if (self.supportTransform) {
    var transformAxis = "translateX";
    if (property == "top") transformAxis = "translateY";
    css = {
      "transform": transformAxis + '(' + index * 100 + '%)'
    };
  }
  return css;
}

function resize() {

  NH = node.width();
  NW = node.height();

  if (self.options.direction === "y") {
    node.stop().scrollTop((floorActive) * NH);
    nodeChildren.each(function(index) {
      $(this).css(getCss(index, "top"));
    });
  }

  if (self.options.direction === "x") {
    node.stop().scrollLeft((floorActive) * NW);
    nodeChildren.each(function(index) {
      $(this).css(getCss(index, "left"));
    });
  }

  if (chocolate) {
    node.stop().scrollLeft((self.options.direction[floorActive][1]) * NW).scrollTop((self.options.direction[floorActive][0]) * NH);
    nodeChildren.each(function(index) {
      var css = {
        "left": (self.options.direction[index][1]) * NW,
        "top": (self.options.direction[index][0]) * NH
      };

      if (self.supportTransform) css = {
        "transform": 'translateX(' + (self.options.direction[index][1]) * 100 + '%) translateY(' + (self.options.direction[index][0]) * 100 + '%)'
      };
      $(this).css(css);
    });
  }
}