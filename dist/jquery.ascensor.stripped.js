/*! Ascensor.js 2013-04-21 */
(function($, window) {
    function Plugin(element, options) {
        this.element = element, this.options = $.extend({}, defaults, options), this._defaults = defaults, 
        this._name = pluginName, this.init();
    }
    var pluginName = "ascensor", defaults = {
        AscensorName: "ascensor",
        AscensorFloorName: null,
        ChildType: "div",
        WindowsOn: 1,
        Direction: "y",
        Loop: !0,
        AscensorMap: "",
        Time: "1000",
        Easing: "linear",
        KeyNavigation: !0,
        Queued: !1,
        QueuedDirection: "x"
    };
    Plugin.prototype.init = function() {
        function hashChange(onLoad) {
            window.location.hash && (hash = window.location.hash.split("/").pop(), $(floorName).each(function(index) {
                hash === floorName[index] && (floorActive = index + 1, $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive").eq(floorActive - 1).addClass(self.options.AscensorName + "LinkActive"), 
                onLoad || targetScroll(floorActive, self.options.Time, !0));
            }));
        }
        function resize() {
            if (WW = $(window).width(), WH = $(window).height(), $(nodeChildren).width(WW).height(WH), 
            $(node).width(WW).height(WH), "y" === self.options.Direction && $(node).stop().scrollTop((floorActive - 1) * WH), 
            "x" === self.options.Direction && ($(node).stop().scrollLeft((floorActive - 1) * WW), 
            $(nodeChildren).each(function(index) {
                $(this).css("left", index * WW);
            })), "chocolate" === self.options.Direction) {
                var target = floorXY[floorActive - 1].split("|");
                $(nodeChildren).each(function(index) {
                    var CoordName = floorXY[index].split("|");
                    $(this).css({
                        left: (CoordName[1] - 1) * WW,
                        top: (CoordName[0] - 1) * WH
                    });
                }), $(node).stop().scrollLeft((target[1] - 1) * WW).scrollTop((target[0] - 1) * WH);
            }
        }
        function targetScroll(floor, time, hashChange) {
            if (hashChange && scrollStart(), "y" === self.options.Direction && $(node).stop().animate({
                scrollTop: (floor - 1) * WH
            }, time, self.options.Easing, function() {
                scrollEnd();
            }), "x" === self.options.Direction && $(node).stop().animate({
                scrollLeft: (floor - 1) * WW
            }, time, self.options.Easing, function() {
                scrollEnd();
            }), "chocolate" === self.options.Direction) {
                var target = floorXY[floor - 1].split("|");
                self.options.Queued ? "x" === self.options.QueuedDirection ? $(node).scrollLeft() === (target[1] - 1) * WW ? $(node).stop().animate({
                    scrollTop: (target[0] - 1) * WH
                }, time, self.options.Easing, function() {
                    scrollEnd();
                }) : $(node).stop().animate({
                    scrollLeft: (target[1] - 1) * WW
                }, time, self.options.Easing, function() {
                    $(node).stop().animate({
                        scrollTop: (target[0] - 1) * WH
                    }, time, self.options.Easing, function() {
                        scrollEnd();
                    });
                }) : "y" === self.options.QueuedDirection && ($(node).scrollTop() === (target[0] - 1) * WH ? $(node).stop().animate({
                    scrollLeft: (target[1] - 1) * WW
                }, time, self.options.Easing, function() {
                    scrollEnd();
                }) : $(node).stop().animate({
                    scrollTop: (target[0] - 1) * WH
                }, time, self.options.Easing, function() {
                    $(node).stop().animate({
                        scrollLeft: (target[1] - 1) * WW
                    }, time, self.options.Easing, function() {
                        scrollEnd();
                    });
                })) : $(node).stop().animate({
                    scrollLeft: (target[1] - 1) * WW,
                    scrollTop: (target[0] - 1) * WH
                }, time, self.options.Easing, function() {
                    scrollEnd();
                });
            }
            hashChange || null !== self.options.AscensorFloorName && (window.location.hash = "/" + floorName[floor - 1]), 
            $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive"), 
            $("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive"), 
            floorActive = floor;
        }
        function checkKey(e) {
            switch (e.keyCode) {
              case 40:
              case 83:
                $(node).trigger({
                    type: "ascensorDown",
                    floor: floorActive
                });
                break;

              case 38:
              case 87:
                $(node).trigger({
                    type: "ascensorUp",
                    floor: floorActive
                });
                break;

              case 37:
              case 65:
                $(node).trigger({
                    type: "ascensorLeft",
                    floor: floorActive
                });
                break;

              case 39:
              case 68:
                $(node).trigger({
                    type: "ascensorRight",
                    floor: floorActive
                });
            }
        }
        function scrollStart() {
            $(node).trigger({
                type: "ascensorStart",
                floor: floorActive
            });
        }
        function scrollEnd() {
            $(node).trigger({
                type: "ascensorEnd",
                floor: floorActive
            });
        }
        function down() {
            "y" == self.options.Direction ? $(node).trigger({
                type: "ascensorNext",
                floor: floorActive
            }) : "chocolate" == self.options.Direction && chocolateDirection(1, 0);
        }
        function up() {
            "y" == self.options.Direction ? $(node).trigger({
                type: "ascensorPrev",
                floor: floorActive
            }) : "chocolate" == self.options.Direction && chocolateDirection(-1, 0);
        }
        function left() {
            "x" == self.options.Direction ? $(node).trigger({
                type: "ascensorPrev",
                floor: floorActive
            }) : "chocolate" == self.options.Direction && chocolateDirection(0, 1);
        }
        function right() {
            "x" == self.options.Direction ? $(node).trigger({
                type: "ascensorNext",
                floor: floorActive
            }) : "chocolate" == self.options.Direction && chocolateDirection(0, -1);
        }
        function prev() {
            floorActive -= 1, 1 > floorActive && (floorActive = self.options.Loop ? floorCounter : 1), 
            targetScroll(floorActive, self.options.Time);
        }
        function next() {
            floorActive += 1, floorActive > floorCounter && (floorActive = self.options.Loop ? 1 : floorCounter), 
            targetScroll(floorActive, self.options.Time);
        }
        function chocolateDirection(addCoordY, addCoordX) {
            var floorReference = floorXY[floorActive - 1].split("|");
            $.each(floorXY, function(index) {
                floorXY[index] === parseInt(floorReference[0], 10) + addCoordY + "|" + (parseInt(floorReference[1], 10) + addCoordX) && targetScroll(index + 1, self.options.Time);
            });
        }
        var WW, WH, hash, self = this, node = this.element, nodeChildren = $(node).children(self.options.ChildType), floorActive = self.options.WindowsOn, floorCounter = 0, floorXY = self.options.AscensorMap.split(" & ");
        if (self.options.Direction, null !== self.options.AscensorFloorName) var floorName = self.options.AscensorFloorName.split(" | ");
        if ($(node).css("position", "absolute").width(WW).height(WH), $(nodeChildren).width(WW).height(WH).each(function() {
            floorCounter++, $(this).attr("id", self.options.AscensorName + "Floor" + floorCounter).addClass(self.options.AscensorName + "Floor");
        }), ("x" === self.options.Direction || "chocolate" === self.options.Direction) && $(nodeChildren).css("position", "absolute"), 
        $(window).resize(function() {
            resize();
        }).load(function() {
            resize();
        }).resize(), window.DeviceOrientationEvent && $(window).bind("orientationchange", function() {
            resize();
        }), self.options.KeyNavigation) {
            var FIREFOX = /Firefox/i.test(navigator.userAgent);
            FIREFOX ? $(document).keypress(checkKey) : $(document).keydown(checkKey);
        }
        $(node).on("ascensorLeft", function() {
            right();
        }), $(node).on("ascensorRight", function() {
            left();
        }), $(node).on("ascensorUp", function() {
            up();
        }), $(node).on("ascensorDown", function() {
            down();
        }), $(node).on("ascensorNext", function() {
            next();
        }), $(node).on("ascensorPrev", function() {
            prev();
        }), $("." + self.options.AscensorName + "LinkPrev").on("click", function() {
            prev();
        }), $("." + self.options.AscensorName + "LinkNext").on("click", function() {
            next();
        }), $("." + self.options.AscensorName + "LinkLeft").on("click", function() {
            left();
        }), $("." + self.options.AscensorName + "LinkRight").on("click", function() {
            right();
        }), $("." + self.options.AscensorName + "LinkUp").on("click", function() {
            down();
        }), $("." + self.options.AscensorName + "LinkDown").on("click", function() {
            up();
        }), $("." + self.options.AscensorName + "Link").on("click", function() {
            var floorReference = parseInt($(this).attr("class").split(" ")[1].split(self.options.AscensorName + "Link")[1], 10);
            targetScroll(floorReference, self.options.Time);
        }), targetScroll(floorActive, 1, !0), $(window).on("hashchange", function() {
            hashChange();
        }), hashChange(!0);
    }, $.fn[pluginName] = function(options) {
        return this.each(function() {
            $.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        });
    };
})(jQuery, window);