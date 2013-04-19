/*********************************************************************************************************
	JQUERY.ASCENSOR.JS
	VERSION: 1.5.6
	DATE: 07/03/2013
**********************************************************************************************************/
(function($, window, undefined) {
	var pluginName = "ascensor", defaults = {AscensorName:"ascensor", AscensorFloorName:null, ChildType:"div", WindowsOn:1, Direction:"y", Loop:true, AscensorMap:"", Time:"1000", Easing:"linear", KeyNavigation:true, Queued:false, QueuedDirection:"x"};
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init()
	}
	Plugin.prototype.init = function() {
		var self = this, node = this.element, nodeChildren = $(node).children(self.options.ChildType), floorActive = self.options.WindowsOn, floorCounter = 0, WW, WH, floorXY = self.options.AscensorMap.split(" & "), direction = self.options.Direction, hash;
		if(self.options.AscensorFloorName !== null) {
			var floorName = self.options.AscensorFloorName.split(" | ")
		}
		$(node).css("position", "absolute").width(WW).height(WH);
		$(nodeChildren).width(WW).height(WH).each(function() {
			floorCounter++;
			$(this).attr("id", self.options.AscensorName + "Floor" + floorCounter).addClass(self.options.AscensorName + "Floor")
		});
		if(self.options.Direction === "x" || self.options.Direction === "chocolate") {
			$(nodeChildren).css("position", "absolute")
		}
		function hashChange(onLoad) {
			if(window.location.hash) {
				hash = window.location.hash.split("/").pop();
				$(floorName).each(function(index) {
					if(hash === floorName[index]) {
						floorActive = index + 1;
						$("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive").eq(floorActive - 1).addClass(self.options.AscensorName + "LinkActive");
						if(!onLoad) {
							targetScroll(floorActive, self.options.Time, true)
						}
					}
				})
			}
		}
		function resize() {
			WW = $(window).width();
			WH = $(window).height();
			$(nodeChildren).width(WW).height(WH);
			$(node).width(WW).height(WH);
			if(self.options.Direction === "y") {
				$(node).stop().scrollTop((floorActive - 1) * WH)
			}
			if(self.options.Direction === "x") {
				$(node).stop().scrollLeft((floorActive - 1) * WW);
				$(nodeChildren).each(function(index) {
					$(this).css("left", index * WW)
				})
			}
			if(self.options.Direction === "chocolate") {
				var target = floorXY[floorActive - 1].split("|");
				$(nodeChildren).each(function(index) {
					var CoordName = floorXY[index].split("|");
					$(this).css({"left":(CoordName[1] - 1) * WW, "top":(CoordName[0] - 1) * WH})
				});
				$(node).stop().scrollLeft((target[1] - 1) * WW).scrollTop((target[0] - 1) * WH)
			}
		}
		$(window).resize(function() {
			resize()
		}).load(function() {
			resize()
		}).resize();
		if(window.DeviceOrientationEvent) {
			$(window).bind("orientationchange", function() {
				resize()
			})
		}
		function targetScroll(floor, time, hashChange) {
			if(hashChange) {
				scrollStart()
			}
			if(self.options.Direction === "y") {
				$(node).stop().animate({scrollTop:(floor - 1) * WH}, time, self.options.Easing, function() {
					scrollEnd()
				})
			}
			if(self.options.Direction === "x") {
				$(node).stop().animate({scrollLeft:(floor - 1) * WW}, time, self.options.Easing, function() {
					scrollEnd()
				})
			}
			if(self.options.Direction === "chocolate") {
				var target = floorXY[floor - 1].split("|");
				if(self.options.Queued) {
					if(self.options.QueuedDirection === "x") {
						if($(node).scrollLeft() === (target[1] - 1) * WW) {
							$(node).stop().animate({scrollTop:(target[0] - 1) * WH}, time, self.options.Easing, function() {
								scrollEnd()
							})
						}else {
							$(node).stop().animate({scrollLeft:(target[1] - 1) * WW}, time, self.options.Easing, function() {
								$(node).stop().animate({scrollTop:(target[0] - 1) * WH}, time, self.options.Easing, function() {
									scrollEnd()
								})
							})
						}
					}else {
						if(self.options.QueuedDirection === "y") {
							if($(node).scrollTop() === (target[0] - 1) * WH) {
								$(node).stop().animate({scrollLeft:(target[1] - 1) * WW}, time, self.options.Easing, function() {
									scrollEnd()
								})
							}else {
								$(node).stop().animate({scrollTop:(target[0] - 1) * WH}, time, self.options.Easing, function() {
									$(node).stop().animate({scrollLeft:(target[1] - 1) * WW}, time, self.options.Easing, function() {
										scrollEnd()
									})
								})
							}
						}
					}
				}else {
					$(node).stop().animate({scrollLeft:(target[1] - 1) * WW, scrollTop:(target[0] - 1) * WH}, time, self.options.Easing, function() {
						scrollEnd()
					})
				}
			}
			if(!hashChange) {
				if(self.options.AscensorFloorName !== null) {
					window.location.hash = "/" + floorName[floor - 1]
				}
			}
			$("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive");
			$("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive");
			floorActive = floor
		}
		function checkKey(e) {
			switch(e.keyCode) {
				case 40:
				case 83:
					$(node).trigger({type:"ascensorDown", floor:floorActive});
					break;
				case 38:
				case 87:
					$(node).trigger({type:"ascensorUp", floor:floorActive});
					break;
				case 37:
				case 65:
					$(node).trigger({type:"ascensorLeft", floor:floorActive});
					break;
				case 39:
				case 68:
					$(node).trigger({type:"ascensorRight", floor:floorActive});
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
		function scrollStart() {
			$(node).trigger({type:"ascensorStart", floor:floorActive})
		}
		function scrollEnd() {
			$(node).trigger({type:"ascensorEnd", floor:floorActive})
		}
		function down() {
			if(self.options.Direction == "y") {
				$(node).trigger({type:"ascensorNext", floor:floorActive})
			}else {
				if(self.options.Direction == "chocolate") {
					chocolateDirection(1, 0)
				}
			}
		}
		function up() {
			if(self.options.Direction == "y") {
				$(node).trigger({type:"ascensorPrev", floor:floorActive})
			}else {
				if(self.options.Direction == "chocolate") {
					chocolateDirection(-1, 0)
				}
			}
		}
		function left() {
			if(self.options.Direction == "x") {
				$(node).trigger({type:"ascensorPrev", floor:floorActive})
			}else {
				if(self.options.Direction == "chocolate") {
					chocolateDirection(0, 1)
				}
			}
		}
		function right() {
			if(self.options.Direction == "x") {
				$(node).trigger({type:"ascensorNext", floor:floorActive})
			}else {
				if(self.options.Direction == "chocolate") {
					chocolateDirection(0, -1)
				}
			}
		}
		function prev() {
			floorActive = floorActive - 1;
			if(floorActive < 1) {
				if(self.options.Loop) {
					floorActive = floorCounter
				}else {
					floorActive = 1
				}
			}
			targetScroll(floorActive, self.options.Time)
		}
		function next() {
			floorActive = floorActive + 1;
			if(floorActive > floorCounter) {
				if(self.options.Loop) {
					floorActive = floorCounter
				}else {
					floorActive = 1
				}
			}
			targetScroll(floorActive, self.options.Time)
		}
		function chocolateDirection(addCoordY, addCoordX) {
			var floorReference = floorXY[floorActive - 1].split("|");
			$.each(floorXY, function(index) {
				if(floorXY[index] === parseInt(floorReference[0], 10) + addCoordY + "|" + (parseInt(floorReference[1], 10) + addCoordX)) {
					targetScroll(index + 1, self.options.Time)
				}
			})
		}
		$(node).on("ascensorLeft", function() {
			right()
		});
		$(node).on("ascensorRight", function() {
			left()
		});
		$(node).on("ascensorUp", function() {
			up()
		});
		$(node).on("ascensorDown", function() {
			down()
		});
		$(node).on("ascensorNext", function() {
			next()
		});
		$(node).on("ascensorPrev", function() {
			prev()
		});
		$("." + self.options.AscensorName + "LinkPrev").on("click", function() {
			prev()
		});
		$("." + self.options.AscensorName + "LinkNext").on("click", function() {
			next()
		});
		$("." + self.options.AscensorName + "LinkLeft").on("click", function() {
			left()
		});
		$("." + self.options.AscensorName + "LinkRight").on("click", function() {
			right()
		});
		$("." + self.options.AscensorName + "LinkUp").on("click", function() {
			down()
		});
		$("." + self.options.AscensorName + "LinkDown").on("click", function() {
			up()
		});
		$("." + self.options.AscensorName + "Link").on("click", function() {
			var floorReference = parseInt($(this).attr("class").split(" ")[1].split(self.options.AscensorName + "Link")[1], 10);
			targetScroll(floorReference, self.options.Time)
		});
		targetScroll(floorActive, 1, true);
		$(window).on("hashchange", function() {
			hashChange()
		});
		hashChange(true)
	};
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options))
			}
		})
	}
})(jQuery, window);