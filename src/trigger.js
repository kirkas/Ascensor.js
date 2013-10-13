function scrollStart() {
  node.trigger({
    type: "ascensorStart",
    floor: floorActive
  });
}

function scrollEnd() {
  node.trigger({
    type: "ascensorEnd",
    floor: floorActive
  });
}

node.on("scrollToStage", function(event, direction) {
  if (direction == "next") {
    next();
  } else if (direction == "prev") {
    prev();
  } else {
    handleDirection(direction);
  }
});

node.on("update", function() {
  nodeChildren = node.children(self.options.childType);
  resize();
});


var className = self.options.ascensorName;




  $("." + className + "Link").on("click", function() {

    //look for the second class and split the number
    var floorReference = parseInt(($(this).attr("class").split(" ")[1].split(self.options.ascensorName + "Link"))[1], 10);

    //target the floor number
    scrollToStage(floorReference, self.options.time);

  });