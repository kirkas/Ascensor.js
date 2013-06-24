/*
Ascensor.js 
version: 1.6.2 (2013-06-05)
description: Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system
repository: https://github.com/kirkas/Ascensor.js
license: BSD
author: Léo Galley <contact@kirkas.ch>
*/
(function($, window) {
    /* Plugin defaults definitions */
    function Plugin(element, options) {
        this.element = element, this.options = $.extend({}, defaults, options), this._defaults = defaults, 
        this._name = pluginName, this.init();
    }
    /* Plugin defaults options */
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
        queued: !1,
        // choose if you want direction scroll queued
        queuedDirection: "x",
        // choose if you want direction scroll queued "x" or "y" (default : "x")
        overflow: "scroll"
    };
    Plugin.prototype.init = function() {
        /* Hash function */
        function hashChange(onLoad) {
            //if the url have an "hash"
            window.location.hash && (//cut the "#/" part
            hash = window.location.hash.split("/").pop(), //for each floorName given
            $(self.options.ascensorFloorName).each(function(index) {
                //compare with the hash, if equal
                hash === self.options.ascensorFloorName[index] && (//the floor become the index of equivalent floorName
                floorActive = index, //remove and add class "link active" to the current link
                $("." + self.options.ascensorName + "Link").removeClass(self.options.ascensorName + "LinkActive").eq(floorActive).addClass(self.options.ascensorName + "LinkActive"), 
                //Scroll to the target floor
                onLoad || targetScroll(floorActive, self.options.time, !0));
            }));
        }
        /* Resize function */
        function resize() {
            //update WW & WH variables
            WW = $(document).width(), WH = $(document).height(), //node and node children get have window widht & height
            $(nodeChildren).width(WW).height(WH), $(node).width(WW).height(WH), //if direction is y
            "y" === self.options.direction && //stop animation and update node scrollTop
            $(node).stop().scrollTop(floorActive * WH), //if direction is x
            "x" === self.options.direction && (//stop animation and update scrollLeft
            $(node).stop().scrollLeft(floorActive * WW), //deplace each children depending on index and left margin
            $(nodeChildren).each(function(index) {
                $(this).css("left", index * WW);
            })), //if direction is chocolate
            "chocolate" === self.options.direction && (//for each children
            $(nodeChildren).each(function(index) {
                //deplace each children in x/y, depending on the index position
                $(this).css({
                    left: self.options.ascensorMap[index][1] * WW,
                    top: self.options.ascensorMap[index][0] * WH
                });
            }), //stop animation and update scrollLeft & scrollTop
            $(node).stop().scrollLeft(self.options.ascensorMap[floorActive][1] * WW).scrollTop(self.options.ascensorMap[floorActive][0] * WH));
        }
        /* Scroll function */
        function targetScroll(floor, time, hashChange) {
            hashChange && scrollStart(), //if direction is y
            "y" === self.options.direction && //stop animation and animate the "scrollTop" to the targeted floor
            $(node).stop().animate({
                scrollTop: floor * WH
            }, time, self.options.easing, function() {
                scrollEnd();
            }), //if direction is x
            "x" === self.options.direction && //stop animation and animate the "scrollLeft" to the targeted floor
            $(node).stop().animate({
                scrollLeft: floor * WW
            }, time, self.options.easing, function() {
                scrollEnd();
            }), //if direction is chocolate
            "chocolate" === self.options.direction && (//get target axis
            //if queued options is true
            self.options.queued ? //queued direction is "x"
            "x" === self.options.queuedDirection ? //if target is on the same horizontal level
            $(node).scrollLeft() === self.options.ascensorMap[floor][1] * WW ? //stop animation and animate the "scrollTop" to the targeted floor
            $(node).stop().animate({
                scrollTop: self.options.ascensorMap[floor][0] * WH
            }, time, self.options.easing, function() {
                scrollEnd();
            }) : //stop animation, first  animate the "scrollLeft" to the targeted floor
            $(node).stop().animate({
                scrollLeft: self.options.ascensorMap[floor][1] * WW
            }, time, self.options.easing, //and then animate the "scrollTop" to the targeted floor
            function() {
                $(node).stop().animate({
                    scrollTop: self.options.ascensorMap[floor][0] * WH
                }, time, self.options.easing, function() {
                    scrollEnd();
                });
            }) : "y" === self.options.queuedDirection && (//if target is on the same vertical level
            $(node).scrollTop() === self.options.ascensorMap[floor][0] * WH ? //stop animation and animate the "scrollLeft" to the targeted floor
            $(node).stop().animate({
                scrollLeft: self.options.ascensorMap[floor][1] * WW
            }, time, self.options.easing, function() {
                scrollEnd();
            }) : //stop animation, first  animate the "scrollTop" to the targeted floor
            $(node).stop().animate({
                scrollTop: self.options.ascensorMap[floor][0] * WH
            }, time, self.options.easing, //and then animate the "scrollLeft" to the targeted floor
            function() {
                $(node).stop().animate({
                    scrollLeft: self.options.ascensorMap[floor][1] * WW
                }, time, self.options.easing, function() {
                    scrollEnd();
                });
            })) : //stop animation,  animate the "scrollLeft" & "scrollTop" to the targeted floor
            $(node).stop().animate({
                scrollLeft: self.options.ascensorMap[floor][1] * WW,
                scrollTop: self.options.ascensorMap[floor][0] * WH
            }, time, self.options.easing, function() {
                scrollEnd();
            })), hashChange || null !== self.options.ascensorFloorName && (//update url hash
            window.location.hash = "/" + self.options.ascensorFloorName[floor]), //remove linkActive class on every link
            $("." + self.options.ascensorName + "Link").removeClass(self.options.ascensorName + "LinkActive"), 
            //add LinkActive class to equivalent Link
            $("." + self.options.ascensorName + "Link" + floor).addClass(self.options.ascensorName + "LinkActive"), 
            //update floorActive variable
            floorActive = floor;
        }
        //check key function
        function checkKey(e) {
            if ($("input, textarea, button").is(":focus")) return !1;
            switch (e.which) {
              //keyDown  
                case 40:
              case 83:
                $(node).trigger({
                    type: "ascensorDown",
                    floor: floorActive
                });
                break;

              //keyUp
                case 38:
              case 87:
                $(node).trigger({
                    type: "ascensorUp",
                    floor: floorActive
                });
                break;

              //keyLeft
                case 37:
              case 65:
                $(node).trigger({
                    type: "ascensorLeft",
                    floor: floorActive
                });
                break;

              //keyright
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
            "y" == self.options.direction ? $(node).trigger({
                type: "ascensorNext",
                floor: floorActive
            }) : "chocolate" == self.options.direction && chocolatedirection(1, 0);
        }
        function up() {
            "y" == self.options.direction ? $(node).trigger({
                type: "ascensorPrev",
                floor: floorActive
            }) : "chocolate" == self.options.direction && chocolatedirection(-1, 0);
        }
        function left() {
            "x" == self.options.direction ? $(node).trigger({
                type: "ascensorPrev",
                floor: floorActive
            }) : "chocolate" == self.options.direction && chocolatedirection(0, -1);
        }
        function right() {
            "x" == self.options.direction ? $(node).trigger({
                type: "ascensorNext",
                floor: floorActive
            }) : "chocolate" == self.options.direction && chocolatedirection(0, 1);
        }
        function prev() {
            var prevFloor = floorActive - 1;
            0 > prevFloor && (prevFloor = self.options.loop ? floorCounter : 0), targetScroll(prevFloor, self.options.time);
        }
        function next() {
            var nextFloor = floorActive + 1;
            nextFloor > floorCounter && (nextFloor = self.options.loop ? 0 : floorCounter), 
            targetScroll(nextFloor, self.options.time);
        }
        function chocolatedirection(addCoordY, addCoordX) {
            var floorReference = [ self.options.ascensorMap[floorActive][0] + addCoordY, self.options.ascensorMap[floorActive][1] + addCoordX ];
            $.each(self.options.ascensorMap, function(index) {
                "" + floorReference == "" + self.options.ascensorMap[index] && targetScroll(index, self.options.time);
            });
        }
        /* Settings */
        var //height/width settings
        WW, WH, //hash 
        hash, self = this, node = this.element, nodeChildren = $(node).children(self.options.childType), //floor counter settings
        floorActive = self.options.windowsOn, floorCounter = -1;
        if (self.options.direction, /* Start plugin actions */
        //define position,height & width
        $(node).css("position", "absolute").width(WW).height(WH), $(node).css("overflow", self.options.overflow), 
        //define height & width
        $(nodeChildren).width(WW).height(WH).each(function() {
            //count floor
            floorCounter += 1, //give class and spcific id
            $(this).attr("id", self.options.ascensorName + "Floor" + floorCounter).addClass(self.options.ascensorName + "Floor");
        }), // if direction is x or chocolate
        ("x" === self.options.direction || "chocolate" === self.options.direction) && //children position = absolute
        $(nodeChildren).css({
            position: "absolute",
            overflow: "auto"
        }), //bind to resize
        $(window).resize(function() {
            resize();
        }).load(function() {
            resize();
        }).resize(), //if browser is mobile
        window.DeviceOrientationEvent && //add orientation check
        $(window).bind("orientationchange", function() {
            resize();
        }), self.options.keyNavigation) {
            $(document).keydown(checkKey);
        }
        $(node).on("ascensorLeft", function() {
            left();
        }), $(node).on("ascensorRight", function() {
            right();
        }), $(node).on("ascensorUp", function() {
            up();
        }), $(node).on("ascensorDown", function() {
            down();
        }), $(node).on("ascensorNext", function() {
            next();
        }), $(node).on("ascensorPrev", function() {
            prev();
        }), //on ascensor prev link click
        $("." + self.options.ascensorName + "LinkPrev").on("click", function() {
            prev();
        }), //on ascensor next click
        $("." + self.options.ascensorName + "LinkNext").on("click", function() {
            next();
        }), // on ancensor left click
        $("." + self.options.ascensorName + "LinkLeft").on("click", function() {
            left();
        }), // on ancensor right click
        $("." + self.options.ascensorName + "LinkRight").on("click", function() {
            right();
        }), // on ancensor up click
        $("." + self.options.ascensorName + "LinkUp").on("click", function() {
            down();
        }), // on ancensor down click
        $("." + self.options.ascensorName + "LinkDown").on("click", function() {
            up();
        }), $("." + self.options.ascensorName + "Link").on("click", function() {
            //look for the second class and split the number
            var floorReference = parseInt($(this).attr("class").split(" ")[1].split(self.options.ascensorName + "Link")[1], 10);
            //target the floor number
            targetScroll(floorReference, self.options.time);
        }), //scroll to active floor at start
        targetScroll(floorActive, 1, !0), //when hash change, start hashchange function
        $(window).on("hashchange", function() {
            hashChange();
        }), //start hashChange function at document loading
        hashChange(!0);
    }, $.fn[pluginName] = function(options) {
        return this.each(function() {
            $.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        });
    };
})(jQuery, window);