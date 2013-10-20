function checkKey(e){
  if ($("input, textarea, button").is(":focus")) {
    return;
  }
  switch (e.which) {
  case 40:
  case 83:
    if(self.options.direction == "x") return;
    node.trigger("scrollToDirection", "down");
    break;
  case 38:
  case 87:
    if(self.options.direction == "x") return;
    node.trigger("scrollToDirection", "up");
    break;

  case 37:
  case 65:
    if(self.options.direction == "y") return;
    node.trigger("scrollToDirection", "left");
    break;

  case 39:
  case 68:
    if(self.options.direction == "y") return;
    node.trigger("scrollToDirection", "right");
    break;
  }
}