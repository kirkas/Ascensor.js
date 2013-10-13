/*
Ascensor.js 
version: 1.6.2 (2013-10-12)
description: Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system
repository: https://github.com/kirkas/Ascensor.js
license: BSD
author: Léo Galley <contact@kirkas.ch>
*/
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
(function($, window, document) {
    function Plugin(element, options) {
        this.element = element, this.options = $.extend({}, defaults, options), this._defaults = defaults, 
        this._name = pluginName, this.init();
    }
    var pluginName = "ascensor", defaults = {
        ascensorName: "ascensor",
        // First, choose the ascensor name
        ascensorFloorName: null,
        // Choose name for each floor
        childType: "div",
        // Specify the child type if there are no 'div'
        windowsOn: 0,
        // Choose the floor to start on
        direction: "y",
        // specify if direction is x,y or chocolate
        loop: !0,
        // specify if direction is x,y or chocolate
        ascensorMap: "",
        // If you choose chocolate for direction, speficy position
        time: "1000",
        // Specify speed of transition
        easing: "linear",
        // Specify easing option
        keyNavigation: !0,
        // choose if you want direction key support
        touchSwipeIntegration: !1,
        // choose if you want swipe event support (requires http://labs.rampinteractive.co.uk/touchSwipe/)
        queued: !1,
        // choose if you want direction scroll queued
        queuedDirection: "x"
    };
    Plugin.prototype.init = function() {
        function resize() {
            WW = $window.width(), WH = $window.height(), nodeChildren.width(WW).height(WH), 
            node.width(WW).height(WH), "y" === self.options.direction && node.stop().scrollTop(self.floorActive * WH), 
            "x" === self.options.direction && (node.stop().scrollLeft(self.floorActive * WW), 
            nodeChildren.each(function(index) {
                $(this).css("left", index * WW);
            })), "chocolate" === self.options.direction && (nodeChildren.each(function(index) {
                $(this).css({
                    left: self.options.ascensorMap[index][1] * WW,
                    top: self.options.ascensorMap[index][0] * WH
                });
            }), node.stop().scrollLeft(self.options.ascensorMap[floorActive][1] * WW).scrollTop(self.options.ascensorMap[floorActive][0] * WH));
        }
        function handleDirection(direction) {
            if ("y" == self.options.direction) {
                if ("left" == direction) return;
                "down" == direction ? next() : "up" == direction && prev();
            } else if ("y" == self.options.direction) {
                if ("up" == direction) return;
                "left" == direction ? prev() : "right" == direction && next();
            } else "chocolate" == self.options.direction && ("down" == direction ? handleChocolateDirection(1, 0) : "up" == direction ? handleChocolateDirection(-1, 0) : "left" == direction ? handleChocolateDirection(0, -1) : "right" == direction && handleChocolateDirection(0, 1));
        }
        function prev() {
            var prevFloor = floorActive - 1;
            0 > prevFloor && (prevFloor = self.options.loop ? floorCounter : 0), scrollToStage(prevFloor, self.options.time);
        }
        function next() {
            var nextFloor = floorActive + 1;
            nextFloor > floorCounter && (nextFloor = self.options.loop ? 0 : floorCounter), 
            scrollToStage(nextFloor, self.options.time);
        }
        function handleChocolateDirection(addCoordY, addCoordX) {
            var floorReference = [ self.options.ascensorMap[floorActive][0] + addCoordY, self.options.ascensorMap[floorActive][1] + addCoordX ];
            $.each(self.options.ascensorMap, function(index) {
                "" + floorReference == "" + self.options.ascensorMap[index] && scrollToStage(index, self.options.time);
            });
        }
        function hashChange(onLoad) {
            window.location.hash && (hash = window.location.hash.split("/").pop(), $(self.options.ascensorFloorName).each(function(index) {
                hash === self.options.ascensorFloorName[index] && (floorActive = index, $("." + self.options.ascensorName + "Link").removeClass(self.options.ascensorName + "LinkActive").eq(floorActive).addClass(self.options.ascensorName + "LinkActive"), 
                onLoad || scrollToStage(floorActive, self.options.time, !0));
            }));
        }
        function scrollToStage(floor, time, hashChange) {
            var animationParams = {
                time: time,
                easing: self.options.easing,
                callback: function() {
                    scrollEnd();
                }
            };
            if ("y" === self.options.direction) animationParams.property = {
                scrollTop: floor * WH
            }; else if ("x" === self.options.direction) animationParams.property = {
                scrollLeft: floor * WW
            }; else if ("chocolate" === self.options.direction && (animationParams.property = {
                scrollLeft: self.options.ascensorMap[floor][1] * WW,
                scrollTop: self.options.ascensorMap[floor][0] * WH
            }, self.options.queued)) {
                var sameXposition = node.scrollLeft() === self.options.ascensorMap[floor][1] * WW, sameYposition = node.scrollTop() === self.options.ascensorMap[floor][0] * WH;
                "x" === self.options.queuedDirection ? sameXposition ? animationParams.property = {
                    scrollTop: self.options.ascensorMap[floor][0] * WH
                } : (animationParams.property = {
                    scrollLeft: self.options.ascensorMap[floor][1] * WW
                }, animationParams.callback = function() {
                    node.stop().animate({
                        scrollTop: self.options.ascensorMap[floor][0] * WH
                    }, time, self.options.easing, function() {
                        scrollEnd();
                    });
                }) : "y" === self.options.queuedDirection && (sameYposition ? animationParams.property = {
                    scrollLeft: self.options.ascensorMap[floor][1] * WW
                } : (animationParams.property = {
                    scrollTop: self.options.ascensorMap[floor][0] * WH
                }, animationParams.callback = function() {
                    node.stop().animate({
                        scrollLeft: self.options.ascensorMap[floor][1] * WW
                    }, time, self.options.easing, function() {
                        scrollEnd();
                    });
                }));
            }
            node.stop().animate(animationParams.property, time, self.options.easing, animationParams.callback), 
            hashChange || null === self.options.ascensorFloorName || (window.location.hash = "/" + self.options.ascensorFloorName[floor]), 
            $("." + self.options.ascensorName + "Link").removeClass(self.options.ascensorName + "LinkActive"), 
            $("." + self.options.ascensorName + "Link" + floor).addClass(self.options.ascensorName + "LinkActive"), 
            floorActive = floor;
        }
        function scrollEnd() {
            node.trigger({
                type: "ascensorEnd",
                floor: floorActive
            });
        }
        function checkKey(e) {
            if (!$("input, textarea, button").is(":focus")) switch (e.which) {
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
            }
        }
        var //height/width settings
        WW, WH, //hash 
        hash, self = this, node = $(this.element), nodeChildren = node.children(self.options.childType), //floor counter settings
        floorActive = self.options.windowsOn, floorCounter = -1, $document = (self.options.direction, 
        $(document)), $window = $(window);
        node.on("scrollToStage", function(event, direction) {
            "next" == direction ? next() : "prev" == direction ? prev() : handleDirection(direction);
        }), node.on("scrollToFloor", function(event, floor) {
            floor > floorCounter || scrollToStage(floor);
        }), node.on("next", function() {
            next();
        }), node.on("prev", function() {
            prev();
        }), node.on("update", function() {
            nodeChildren = node.children(self.options.childType), resize();
        }), node.css({
            position: "absolute",
            width: WW,
            height: WH
        }), nodeChildren.width(WW).height(WH).each(function() {
            floorCounter += 1;
        }), ("x" === self.options.direction || "chocolate" === self.options.direction) && nodeChildren.css({
            position: "absolute",
            overflow: "auto"
        }), self.options.keyNavigation && $document.keydown(checkKey), $window.resize(function() {
            resize();
        }).load(function() {
            resize();
        }).resize(), window.DeviceOrientationEvent && $window.bind("orientationchange", function() {
            resize();
        }), $window.on("hashchange", function() {
            hashChange();
        }), scrollToStage(floorActive, 1, !0), hashChange(!0), self.options.touchSwipeIntegration && node.swipe({
            swipe: function(event, direction) {
                var ascensorDirStr = "";
                "up" == direction ? ascensorDirStr = "Down" : "down" == direction ? ascensorDirStr = "Up" : "left" == direction ? ascensorDirStr = "Right" : "right" == direction && (ascensorDirStr = "Left"), 
                node.trigger({
                    type: "ascensor" + ascensorDirStr,
                    floor: floorActive
                });
            },
            threshold: 70
        });
    }, $.fn[pluginName] = function(options) {
        return this.each(function() {
            $.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        });
    };
})(jQuery, window, document);