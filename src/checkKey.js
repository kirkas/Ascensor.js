function checkKey(e){
  if ($("input, textarea, button").is(":focus")) {
    return;
  }
  switch (e.which) {
  case 40:
  case 83:
    handleDirection("down");
    break;
  case 38:
  case 87:
    handleDirection("up");
    break;

  case 37:
  case 65:
    handleDirection("left");
    break;

  case 39:
  case 68:
    handleDirection("right");
    break;
  }
}