function getFloorFromHash() {
  if (window.location.hash) {
    hash = window.location.hash.split("/").pop();
    var floor = false;
    $(self.options.ascensorFloorName).each(function(index, floorName) {
      if (hash === self.options.ascensorFloorName[index]) {
        floor = index ;
      }
    });
    return floor;
  }
}