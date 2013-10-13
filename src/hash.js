function hashChange(onLoad) {
  if (window.location.hash) {
    hash = window.location.hash.split("/").pop();
    $(self.options.ascensorFloorName).each(function(index, floorName) {
      if (hash === self.options.ascensorFloorName[index]) {
        floorActive = index;
        $("." + self.options.ascensorName + "Link").removeClass(self.options.ascensorName + "LinkActive").eq(floorActive).addClass(self.options.ascensorName + "LinkActive");
        if (!onLoad) {
          scrollToStage(floorActive, self.options.time, true);
        }
      }
    });
  }
}