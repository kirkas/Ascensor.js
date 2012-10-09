/*********************************************************************************************************

    JQUERY.ASCENSOR.JS
        VERSION: 1.4.2
        DATE: 9/10/2012


    INDEX
        1. PLUGIN DEFAULTS OPTIONS
        2. NODE OPTIONS DEFINITIONS
        3. SETTINGS
        4. HASH ANALYSIS
        5. RESIZE FONCTION
        6. SCROLLTO FONCTION
        7. KEYPRESS FONCTION
        8. ASSIGN CLICK TO FUNCTION
        9. LINK FONCTION DEFINITION
        10. KEYPRESS EVENT
        11. MOBILE ROTATION DETECTION
        12. WINDOW RESIZE EVENT
        13. WRAPPER AROUND THE PLUGIN

**********************************************************************************************************/


;(function ($, window, undefined) {


    /***********************************************************************
        1. PLUGIN DEFAULTS OPTION
    ***********************************************************************/
    var pluginName = 'ascensor',
        defaults = {
            ChildType: "div",
            WindowsOn: 1,
            Direction: "y",
            AscensorMap: "",
            AscensorName: "ascensor",
            AscensorFloorName: "",
            Time: "1000",
            Easing: "linear",
            KeyNavigation: true
        };


    /***********************************************************************
        2. NODE OPTIONS DEFINITIONS
    ***********************************************************************/
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }


    Plugin.prototype.init = function () {


        /***********************************************************************
            3. SETTINGS
        ***********************************************************************/

        //element settings
        var self = this;
        var node = this.element;
        var nodeChildren = $(node).children(self.options.ChildType);

        //stage counter settings
        var StageOn = self.options.WindowsOn;
        var StageNumber = 0;

        //height/width settings
        var WW;
        var WH;

        //plugins settings
        var floorXY = self.options.AscensorMap.split(" & ");
        var floorName = self.options.AscensorFloorName.split(" | ");
        var direction = self.options.Direction;

        //hash var
        var hash = window.location.hash.split("/").pop();


        /***********************************************************************
            4. HASH ANALYSIS
        ***********************************************************************/
        if (self.options.AscensorFloorName !== null) {
            $(floorName).each(function (index) {
                if (hash === floorName[index]) {
                    StageOn = index + 1;
                    $("." + self.options.AscensorName + "Link")
                        .eq(StageOn - 1)
                        .addClass(self.options.AscensorName + "LinkActive");
                }
            });
        }



        /***********************************************************************
            5. RESIZE FONCTION
        ***********************************************************************/
        function elementResize() {

            WW = $(window).width();
            WH = $(window).height();

            $(nodeChildren).width(WW).height(WH);
            $(node).width(WW).height(WH);

            if (direction === "y") {
                $(node).stop().scrollTop((StageOn - 1) * WH);
            }

            if (direction === "x") {
                $(node).stop().scrollLeft((StageOn - 1) * WW);
                $(nodeChildren).css("position", "absolute").each(function (index) {
                    $(this).css("left", index * WW);
                });
            }

            if (direction === "chocolate") {
                var target = floorXY[StageOn - 1].split("|");

                $(nodeChildren).each(function (index) {
                    var CoordName = floorXY[index].split("|");
                    $(this).css({"position": "absolute", "left": (CoordName[1] - 1) * WW, "top": (CoordName[0] - 1) * WH}); 
                });
                $(node).stop().scrollLeft((target[1] - 1) * WW).scrollTop((target[0] - 1) * WH);
            }
        }


        /***********************************************************************
            6. SCROLLTO FONCTION
        ***********************************************************************/
        function targetScroll(floor, time) {
            if (direction === "y") {
                $(node).stop().animate({scrollTop: (floor - 1) * $(window).height()},time,self.options.Easing);
            }

            if (direction === "x") {
                $(node).stop().animate({scrollLeft: (floor - 1) * $(window).width()},time,self.options.Easing);
            }

            if (direction === "chocolate") {
                var target = floorXY[floor - 1].split("|");
                $(node).stop().animate({scrollLeft: (target[1] - 1) * $(window).width(),scrollTop: (target[0] - 1) * $(window).height()},time,self.options.Easing);
            }

            if (self.options.AscensorFloorName !== null) {
                window.location.hash = "/" + floorName[floor - 1];
            }

            $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive");
            $("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive");

            StageOn = floor;
        }


        /***********************************************************************
            7. KEYPRESS FUNCTION
        ***********************************************************************/
        function navigationPress(addCoordY, addCoordX) {

            if (direction === "y") {
                if (addCoordY === 1 && addCoordX === 0) {
                    if (StageOn + 1 < StageNumber || StageOn + 1 === StageNumber) {
                        targetScroll(StageOn + 1, self.options.Time);
                    }
                }
                if (addCoordY === -1 && addCoordX === 0) {
                    if (StageOn - 1 > 1 || StageOn - 1 === 1) {
                        targetScroll(StageOn - 1, self.options.Time);
                    }
                }
            }

            if (direction === "x") {
                if (addCoordY === 0 && addCoordX === -1) {
                    if (StageOn - 1 > 1 || StageOn - 1 === 1) {
                        targetScroll(StageOn - 1, self.options.Time);
                    }
                }
                if (addCoordY === 0 && addCoordX === 1) {
                    if (StageOn + 1 < StageNumber || StageOn + 1 === StageNumber) {
                        targetScroll(StageOn + 1 , self.options.Time);
                    }
                }
            }

            if (direction === "chocolate") {
                var floorReference = floorXY[StageOn - 1].split("|");
                $.each(floorXY, function (index) {
                    if (floorXY[index] === (parseInt(floorReference[0], 10) + addCoordY) + "|" + (parseInt(floorReference[1], 10) + addCoordX)) {
                        targetScroll(index + 1, self.options.Time);
                    }
                });
            }
        }

        function checkKey(e) {
            switch (e.keyCode) {
            case 40:
                navigationPress(1, 0);
                break;
            case 38:
                navigationPress(-1, 0);
                break;
            case 37:
                navigationPress(0, - 1);
                break;
            case 39:
                navigationPress(0, 1);
                break;
            }
        }


        /***********************************************************************
            8. START PLUGIN ACTION
        ***********************************************************************/
        $(node)
            .css("position", "absolute")
            .width(WW)
            .height(WH);

        $(nodeChildren)
            .width(WW)
            .height(WH)
            .each(function () {
                StageNumber++;
                $(this)
                    .attr("id", self.options.AscensorName + "Floor" + StageNumber)
                    .addClass(self.options.AscensorName + "Floor");
            });


        /***********************************************************************
            9. LINK FONCTION DEFINITION
        ***********************************************************************/
        $("." + self.options.AscensorName + "Link").on("click", function () {
            var floorReference = $(this).attr("class");
                floorReference = floorReference.split(" ");
                floorReference = floorReference[1];
                floorReference = floorReference.split(self.options.AscensorName + "Link");
                floorReference = parseInt(floorReference[1], 10);
            targetScroll(floorReference, self.options.Time);
        });

        $("." + self.options.AscensorName + "LinkPrev").on("click", function () {

            if (StageOn - 1 < 1) {
                StageOn = StageNumber;
            }
            targetScroll(StageOn, self.options.Time);
        });


        $("." + self.options.AscensorName + "LinkNext").on("click", function () {
            if (StageOn + 1 > StageNumber) {
                StageOn = 1;
            }
            targetScroll(StageOn, self.options.Time);
        });


        /***********************************************************************
            10. KEYPRESS EVENT
        ***********************************************************************/
        if (self.options.KeyNavigation) {
            if ($.browser.mozilla) {
                $(document).keypress(checkKey);
            } else {
                $(document).keydown(checkKey);
            }
        }


        /***********************************************************************
            11. MOBILE ROTATION DETECTION
        ***********************************************************************/
        if (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)) {
            var previousOrientation = 0;
            var checkOrientation = function () {
                if (window.orientation !== previousOrientation) {
                    previousOrientation = window.orientation;
                    elementResize();
                }
            };
            window.addEventListener("resize", checkOrientation, false);
            window.addEventListener("orientationchange", checkOrientation, false);
            setInterval(checkOrientation, 200);
        }


        /***********************************************************************
            12. WINDOW RESIZE EVENT
        ***********************************************************************/
        $(window).resize(function () {
            elementResize();
        }).resize();

        elementResize();
        targetScroll(StageOn, 1)
    };


    /***********************************************************************
        13. WRAPPER AROUND PLUGIN
    ***********************************************************************/
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery, window));