(function($, window, undefined) {
	var pluginName = "ascensor", defaults = {AscensorName:"ascensor", AscensorFloorName:"", ChildType:"div", WindowsOn:1, Direction:"y", AscensorMap:"", Time:"1000", Easing:"linear", KeyNavigation:true, Queued:false, QueuedDirection:"x"};
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init()
	}
	Plugin.prototype.init = function() {
		var self = this, node = this.element, nodeChildren = $(node).children(self.options.ChildType), floorActive = self.options.WindowsOn, floorCounter = 0, WW, WH, floorXY = self.options.AscensorMap.split(" & "), floorName = self.options.AscensorFloorName.split(" | "), direction = self.options.Direction, hash;
		$(node).css("position", "absolute").width(WW).height(WH);
		$(nodeChildren).width(WW).height(WH).each(function() {
			floorCounter++;
			$(this).attr("id", self.options.AscensorName + "Floor" + floorCounter).addClass(self.options.AscensorName + "Floor")
		});
		if(direction === "x" || direction === "chocolate") {
			$(nodeChildren).css("position", "absolute")
		}
		function hashChange() {
			if(window.location.hash) {
				hash = window.location.hash.split("/").pop();
				$(floorName).each(function(index) {
					if(hash === floorName[index]) {
						floorActive = index + 1;
						$("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive").eq(floorActive - 1).addClass(self.options.AscensorName + "LinkActive");
						targetScroll(floorActive, self.options.Time)
					}
				})
			}
		}
		$(window).on("hashchange", function() {
			hashChange()
		});
		hashChange();
		function elementResize() {
			WW = $(window).width();
			WH = $(window).height();
			$(nodeChildren).width(WW).height(WH);
			$(node).width(WW).height(WH);
			if(direction === "y") {
				$(node).stop().scrollTop((floorActive - 1) * WH)
			}
			if(direction === "x") {
				$(node).stop().scrollLeft((floorActive - 1) * WW);
				$(nodeChildren).each(function(index) {
					$(this).css("left", index * WW)
				})
			}
			if(direction === "chocolate") {
				var target = floorXY[floorActive - 1].split("|");
				$(nodeChildren).each(function(index) {
					var CoordName = floorXY[index].split("|");
					$(this).css({"left":(CoordName[1] - 1) * WW, "top":(CoordName[0] - 1) * WH})
				});
				$(node).stop().scrollLeft((target[1] - 1) * WW).scrollTop((target[0] - 1) * WH)
			}
		}
		$(window).resize(function() {
			elementResize()
		}).load(function() {
			elementResize()
		}).resize();
		if(window.DeviceOrientationEvent) {
			$(window).bind("orientationchange", function() {
				elementResize()
			})
		}
		function targetScroll(floor, time) {
			if(direction === "y") {
				$(node).stop().animate({scrollTop:(floor - 1) * WH}, time, self.options.Easing)
			}
			if(direction === "x") {
				$(node).stop().animate({scrollLeft:(floor - 1) * WW}, time, self.options.Easing)
			}
			if(direction === "chocolate") {
				var target = floorXY[floor - 1].split("|");
				if(self.options.Queued) {
					if(self.options.QueuedDirection === "x") {
						if($(node).scrollLeft() === (target[1] - 1) * WW) {
							$(node).stop().animate({scrollTop:(target[0] - 1) * WH}, time, self.options.Easing)
						}else {
							$(node).stop().animate({scrollLeft:(target[1] - 1) * WW}, time, self.options.Easing, function() {
								$(node).stop().animate({scrollTop:(target[0] - 1) * WH}, time, self.options.Easing)
							})
						}
					}else {
						if(self.options.QueuedDirection === "y") {
							if($(node).scrollTop() === (target[0] - 1) * WH) {
								$(node).stop().animate({scrollLeft:(target[1] - 1) * WW}, time, self.options.Easing)
							}else {
								$(node).stop().animate({scrollTop:(target[0] - 1) * WH}, time, self.options.Easing, function() {
									$(node).stop().animate({scrollLeft:(target[1] - 1) * WW}, time, self.options.Easing)
								})
							}
						}
					}
				}else {
					$(node).stop().animate({scrollLeft:(target[1] - 1) * WW, scrollTop:(target[0] - 1) * WH}, time, self.options.Easing)
				}
			}
			if(self.options.AscensorFloorName !== null) {
				window.location.hash = "/" + floorName[floor - 1]
			}
			$("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive");
			$("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive");
			floorActive = floor
		}
		targetScroll(floorActive, 1);
		function navigationPress(addCoordY, addCoordX) {
			if(!$("input, textarea").is(":focus")) {
				if(direction === "y") {
					if(addCoordY === 1 && addCoordX === 0) {
						if(floorActive + 1 < floorCounter || floorActive + 1 === floorCounter) {
							targetScroll(floorActive + 1, self.options.Time)
						}
					}
					if(addCoordY === -1 && addCoordX === 0) {
						if(floorActive - 1 > 1 || floorActive - 1 === 1) {
							targetScroll(floorActive - 1, self.options.Time)
						}
					}
				}
				if(direction === "x") {
					if(addCoordY === 0 && addCoordX === -1) {
						if(floorActive - 1 > 1 || floorActive - 1 === 1) {
							targetScroll(floorActive - 1, self.options.Time)
						}
					}
					if(addCoordY === 0 && addCoordX === 1) {
						if(floorActive + 1 < floorCounter || floorActive + 1 === floorCounter) {
							targetScroll(floorActive + 1, self.options.Time)
						}
					}
				}
				if(direction === "chocolate") {
					var floorReference = floorXY[floorActive - 1].split("|");
					$.each(floorXY, function(index) {
						if(floorXY[index] === parseInt(floorReference[0], 10) + addCoordY + "|" + (parseInt(floorReference[1], 10) + addCoordX)) {
							targetScroll(index + 1, self.options.Time)
						}
					})
				}
			}
		}
		function checkKey(e) {
			switch(e.keyCode) {
				case 40:
					navigationPress(1, 0);
					break;
				case 38:
					navigationPress(-1, 0);
					break;
				case 37:
					navigationPress(0, -1);
					break;
				case 39:
					navigationPress(0, 1);
					break
			}
		}
		if(self.options.KeyNavigation) {
			if($.browser.mozilla) {
				$(document).keypress(checkKey)
			}else {
				$(document).keydown(checkKey)
			}
		}
		$("." + self.options.AscensorName + "Link").on("click", function() {
			var floorReference = $(this).attr("class");
			floorReference = floorReference.split(" ");
			floorReference = floorReference[1];
			floorReference = floorReference.split(self.options.AscensorName + "Link");
			floorReference = parseInt(floorReference[1], 10);
			targetScroll(floorReference, self.options.Time)
		});
		$("." + self.options.AscensorName + "LinkPrev").on("click", function() {
			floorActive = floorActive - 1;
			if(floorActive < 1) {
				floorActive = floorCounter
			}
			targetScroll(floorActive, self.options.Time)
		});
		$("." + self.options.AscensorName + "LinkNext").on("click", function() {
			floorActive = floorActive + 1;
			if(floorActive > floorCounter) {
				floorActive = 1
			}
			targetScroll(floorActive, self.options.Time)
		})
	};
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options))
			}
		})
	}
})(jQuery, window);