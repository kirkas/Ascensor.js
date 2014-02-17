function getFloorFromHash() {
  if (window.location.hash) {
    hash = window.location.hash.split("#").pop();
    var floor = false;
    if(self.options.ascensorFloorName) {
      $.each(self.options.ascensorFloorName, function(index, floorName) {
        if (hash === self.options.ascensorFloorName[index]) {
          floor = index;
        }
      });
    }
    return floor;
  }
}