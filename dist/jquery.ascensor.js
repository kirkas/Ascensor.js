/*! Ascensor.js 2013-04-21 */
/*********************************************************************************************************

	INDEX
		1. PLUGIN DEFAULTS OPTIONS
		2. NODE OPTIONS DEFINITIONS
		3. SETTINGS
		4. START PLUGIN ACTION
		5. HASH FUNCTION
		6. RESIZE FONCTION
		7. SCROLLTO FONCTION
		8. KEYPRESS FUNCTION
		9. LINK FONCTION DEFINITION
		10. MOBILE ROTATION DETECTION
		11. WINDOW RESIZE EVENT
		12. WRAPPER AROUND PLUGIN

		check on :
        - Chrome v22 
				- Safari v6.0.1
				- firefox 15.0.1
				- opera v12.02 
				- IE 8
				- IE9

				- Chrome mobile (IOS)
				- Safari mobile (IOS)

	Please, sand request/bug to contact@kirkas.ch

**********************************************************************************************************/
(function($, window) {
    /***********************************************************************
		2. NODE OPTIONS DEFINITIONS
	***********************************************************************/
    function Plugin(element, options) {
        this.element = element, this.options = $.extend({}, defaults, options), this._defaults = defaults, 
        this._name = pluginName, this.init();
    }
    /***********************************************************************
		1. PLUGIN DEFAULTS OPTION
	********************************************************************** */
    var pluginName = "ascensor", defaults = {
        //	First, choose the ascensor name
        AscensorName: "ascensor",
        //	Choose name for each floor
        AscensorFloorName: null,
        //	Specify the child type if there are no 'div'
        ChildType: "div",
        //	Choose the floor to start on
        WindowsOn: 1,
        //	specify if direction is x,y or chocolate
        Direction: "y",
        //	specify if direction is x,y or chocolate
        Loop: !0,
        //	If you choose chocolate for direction, speficy position
        AscensorMap: "",
        //	Specify speed of transition
        Time: "1000",
        //	Specify easing option
        Easing: "linear",
        //	choose if you want direction key support
        KeyNavigation: !0,
        //	choose if you want direction scroll queued
        Queued: !1,
        //	choose if you want direction scroll queued "x" or "y" (default : "x")
        QueuedDirection: "x"
    };
    Plugin.prototype.init = function() {
        /***********************************************************************
			5. HASH FUNCTION
		***********************************************************************/
        function hashChange(onLoad) {
            //if the url have an "hash"
            window.location.hash && (//cut the "#/" part
            hash = window.location.hash.split("/").pop(), //for each floorName given
            $(floorName).each(function(index) {
                //compare with the hash, if equal
                hash === floorName[index] && (//the floor become the index of equivalent floorName
                floorActive = index + 1, //remove and add class "link active" to the current link
                $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive").eq(floorActive - 1).addClass(self.options.AscensorName + "LinkActive"), 
                //Scroll to the target floor
                onLoad || targetScroll(floorActive, self.options.Time, !0));
            }));
        }
        /***********************************************************************
			6. RESIZE FONCTION
		***********************************************************************/
        function resize() {
            //if direction is chocolate
            if (//update WW & WH variables
            WW = $(window).width(), WH = $(window).height(), //node and node children get have window widht & height
            $(nodeChildren).width(WW).height(WH), $(node).width(WW).height(WH), //if direction is y
            "y" === self.options.Direction && //stop animation and update node scrollTop
            $(node).stop().scrollTop((floorActive - 1) * WH), //if direction is x
            "x" === self.options.Direction && (//stop animation and update scrollLeft
            $(node).stop().scrollLeft((floorActive - 1) * WW), //deplace each children depending on index and left margin
            $(nodeChildren).each(function(index) {
                $(this).css("left", index * WW);
            })), "chocolate" === self.options.Direction) {
                // get current floor axis axis info
                var target = floorXY[floorActive - 1].split("|");
                //for each children
                $(nodeChildren).each(function(index) {
                    //get equivalent axis info
                    var CoordName = floorXY[index].split("|");
                    //deplace each children in x/y, depending on the index position
                    $(this).css({
                        left: (CoordName[1] - 1) * WW,
                        top: (CoordName[0] - 1) * WH
                    });
                }), //stop animation and update scrollLeft & scrollTop
                $(node).stop().scrollLeft((target[1] - 1) * WW).scrollTop((target[0] - 1) * WH);
            }
        }
        /***********************************************************************
			7. SCROLLTO FONCTION
		***********************************************************************/
        function targetScroll(floor, time, hashChange) {
            //if direction is chocolate
            if (hashChange && scrollStart(), //if direction is y
            "y" === self.options.Direction && //stop animation and animate the "scrollTop" to the targeted floor
            $(node).stop().animate({
                scrollTop: (floor - 1) * WH
            }, time, self.options.Easing, function() {
                scrollEnd();
            }), //if direction is x
            "x" === self.options.Direction && //stop animation and animate the "scrollLeft" to the targeted floor
            $(node).stop().animate({
                scrollLeft: (floor - 1) * WW
            }, time, self.options.Easing, function() {
                scrollEnd();
            }), "chocolate" === self.options.Direction) {
                //get target axis
                var target = floorXY[floor - 1].split("|");
                //if queued options is true
                self.options.Queued ? //queued direction is "x"
                "x" === self.options.QueuedDirection ? //if target is on the same horizontal level
                $(node).scrollLeft() === (target[1] - 1) * WW ? //stop animation and animate the "scrollTop" to the targeted floor
                $(node).stop().animate({
                    scrollTop: (target[0] - 1) * WH
                }, time, self.options.Easing, function() {
                    scrollEnd();
                }) : //stop animation, first  animate the "scrollLeft" to the targeted floor
                $(node).stop().animate({
                    scrollLeft: (target[1] - 1) * WW
                }, time, self.options.Easing, //and then animate the "scrollTop" to the targeted floor
                function() {
                    $(node).stop().animate({
                        scrollTop: (target[0] - 1) * WH
                    }, time, self.options.Easing, function() {
                        scrollEnd();
                    });
                }) : "y" === self.options.QueuedDirection && (//if target is on the same vertical level
                $(node).scrollTop() === (target[0] - 1) * WH ? //stop animation and animate the "scrollLeft" to the targeted floor
                $(node).stop().animate({
                    scrollLeft: (target[1] - 1) * WW
                }, time, self.options.Easing, function() {
                    scrollEnd();
                }) : //stop animation, first  animate the "scrollTop" to the targeted floor
                $(node).stop().animate({
                    scrollTop: (target[0] - 1) * WH
                }, time, self.options.Easing, //and then animate the "scrollLeft" to the targeted floor
                function() {
                    $(node).stop().animate({
                        scrollLeft: (target[1] - 1) * WW
                    }, time, self.options.Easing, function() {
                        scrollEnd();
                    });
                })) : //stop animation,  animate the "scrollLeft" & "scrollTop" to the targeted floor
                $(node).stop().animate({
                    scrollLeft: (target[1] - 1) * WW,
                    scrollTop: (target[0] - 1) * WH
                }, time, self.options.Easing, function() {
                    scrollEnd();
                });
            }
            hashChange || null !== self.options.AscensorFloorName && (//update url hash
            window.location.hash = "/" + floorName[floor - 1]), //remove linkActive class on every link
            $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive"), 
            //add LinkActive class to equivalent Link
            $("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive"), 
            //update floorActive variable
            floorActive = floor;
        }
        //check key function
        function checkKey(e) {
            switch (e.keyCode) {
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
        /***********************************************************************
			3. SETTINGS
		***********************************************************************/
        //element settings
        var //height/width settings
        WW, WH, //hash 
        hash, self = this, node = this.element, nodeChildren = $(node).children(self.options.ChildType), //floor counter settings
        floorActive = self.options.WindowsOn, floorCounter = 0, //plugins settings
        floorXY = self.options.AscensorMap.split(" & ");
        if (self.options.Direction, null !== self.options.AscensorFloorName) var floorName = self.options.AscensorFloorName.split(" | ");
        if (/***********************************************************************
			4. START PLUGIN ACTION
		***********************************************************************/
        //define position,height & width
        $(node).css("position", "absolute").width(WW).height(WH), //define height & width
        $(nodeChildren).width(WW).height(WH).each(function() {
            //count floor
            floorCounter++, //give class and spcific id
            $(this).attr("id", self.options.AscensorName + "Floor" + floorCounter).addClass(self.options.AscensorName + "Floor");
        }), // if direction is x or chocolate
        ("x" === self.options.Direction || "chocolate" === self.options.Direction) && //children position = absolute
        $(nodeChildren).css("position", "absolute"), //bind to resize
        $(window).resize(function() {
            resize();
        }).load(function() {
            resize();
        }).resize(), //if browser is mobile
        window.DeviceOrientationEvent && //add orientation check
        $(window).bind("orientationchange", function() {
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
        }), //on ascensor prev link click
        $("." + self.options.AscensorName + "LinkPrev").on("click", function() {
            prev();
        }), //on ascensor next click
        $("." + self.options.AscensorName + "LinkNext").on("click", function() {
            next();
        }), // on ancensor left click
        $("." + self.options.AscensorName + "LinkLeft").on("click", function() {
            left();
        }), // on ancensor right click
        $("." + self.options.AscensorName + "LinkRight").on("click", function() {
            right();
        }), // on ancensor up click
        $("." + self.options.AscensorName + "LinkUp").on("click", function() {
            down();
        }), // on ancensor down click
        $("." + self.options.AscensorName + "LinkDown").on("click", function() {
            up();
        }), $("." + self.options.AscensorName + "Link").on("click", function() {
            //look for the second class and split the number
            var floorReference = parseInt($(this).attr("class").split(" ")[1].split(self.options.AscensorName + "Link")[1], 10);
            //target the floor number
            targetScroll(floorReference, self.options.Time);
        }), //scroll to active floor at start
        targetScroll(floorActive, 1, !0), //when hash change, start hashchange function
        $(window).on("hashchange", function() {
            hashChange();
        }), //start hashChange function at document loading
        hashChange(!0);
    }, /***********************************************************************
		12. WRAPPER AROUND PLUGIN
	***********************************************************************/
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            $.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        });
    };
})(jQuery, window);