/*********************************************************************************************************

	JQUERY.ASCENSOR.JS
		VERSION: 1.5.6
		DATE: 07/03/2013

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


;
(function($, window, undefined) {


  /***********************************************************************
		1. PLUGIN DEFAULTS OPTION
	********************************************************************** */
  var pluginName = 'ascensor',
    defaults = {

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
      Loop: true,

      //	If you choose chocolate for direction, speficy position
      AscensorMap: "",

      //	Specify speed of transition
      Time: "1000",

      //	Specify easing option
      Easing: "linear",

      //	choose if you want direction key support
      KeyNavigation: true,

      //	choose if you want direction scroll queued
      Queued: false,

      //	choose if you want direction scroll queued "x" or "y" (default : "x")
      QueuedDirection: "x"
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


  Plugin.prototype.init = function() {


    /***********************************************************************
			3. SETTINGS
		***********************************************************************/

    //element settings
    var
    self = this,
      node = this.element,
      nodeChildren = $(node).children(self.options.ChildType),

      //floor counter settings
      floorActive = self.options.WindowsOn,
      floorCounter = 0,

      //height/width settings
      WW,
      WH,

      //plugins settings
      floorXY = self.options.AscensorMap.split(" & "),
      direction = self.options.Direction,

      //hash 
      hash;


    if (self.options.AscensorFloorName !== null) {
      var floorName = self.options.AscensorFloorName.split(" | ")
    }

    /***********************************************************************
			4. START PLUGIN ACTION
		***********************************************************************/

    //define position,height & width
    $(node).css("position", "absolute").width(WW).height(WH)

    //define height & width
    $(nodeChildren).width(WW).height(WH)

    //for each floor
    .each(function() {

      //count floor
      floorCounter++;

      //give class and spcific id
      $(this).attr("id", self.options.AscensorName + "Floor" + floorCounter).addClass(self.options.AscensorName + "Floor");
    });

    // if direction is x or chocolate
    if (self.options.Direction === "x" || self.options.Direction === "chocolate") {

      //children position = absolute
      $(nodeChildren).css("position", "absolute");
    }




    /***********************************************************************
			5. HASH FUNCTION
		***********************************************************************/
    function hashChange(onLoad) {

      //if the url have an "hash"
      if (window.location.hash) {

        //cut the "#/" part
        hash = window.location.hash.split("/").pop();

        //for each floorName given
        $(floorName).each(function(index) {

          //compare with the hash, if equal
          if (hash === floorName[index]) {

            //the floor become the index of equivalent floorName
            floorActive = index + 1;

            //remove and add class "link active" to the current link
            $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive").eq(floorActive - 1).addClass(self.options.AscensorName + "LinkActive");

            //Scroll to the target floor
            
            if(!onLoad){
              targetScroll(floorActive, self.options.Time, true);
            }
          }

        });

      }

    }

    


    /***********************************************************************
			6. RESIZE FONCTION
		***********************************************************************/
    function resize() {

      //update WW & WH variables
      WW = $(window).width();
      WH = $(window).height();

      //node and node children get have window widht & height
      $(nodeChildren).width(WW).height(WH);

      $(node).width(WW).height(WH);

      //if direction is y
      if (self.options.Direction === "y") {

        //stop animation and update node scrollTop
        $(node).stop().scrollTop((floorActive - 1) * WH);
      }

      //if direction is x
      if (self.options.Direction === "x") {

        //stop animation and update scrollLeft
        $(node).stop().scrollLeft((floorActive - 1) * WW);

        //deplace each children depending on index and left margin
        $(nodeChildren).each(function(index) {
          $(this).css("left", index * WW);
        });
      }

      //if direction is chocolate
      if (self.options.Direction === "chocolate") {

        // get current floor axis axis info
        var target = floorXY[floorActive - 1].split("|");

        //for each children
        $(nodeChildren).each(function(index) {

          //get equivalent axis info
          var CoordName = floorXY[index].split("|");

          //deplace each children in x/y, depending on the index position
          $(this).css({
            "left": (CoordName[1] - 1) * WW,
            "top": (CoordName[0] - 1) * WH
          });

        });

        //stop animation and update scrollLeft & scrollTop
        $(node).stop().scrollLeft((target[1] - 1) * WW).scrollTop((target[0] - 1) * WH);
      }
    }

    //bind to resize
    $(window).resize(function() {
      resize();
    }).load(function() {
      resize();
    }).resize();

    //if browser is mobile
    if (window.DeviceOrientationEvent) {

      //add orientation check
      $(window).bind('orientationchange', function() {
        resize();
      });
    }



    /***********************************************************************
			7. SCROLLTO FONCTION
		***********************************************************************/
    function targetScroll(floor, time, hashChange) {
      
      if(hashChange){
        scrollStart()
      }

      //if direction is y
      if (self.options.Direction === "y") {

        //stop animation and animate the "scrollTop" to the targeted floor
        $(node).stop().animate({
          scrollTop: (floor - 1) * WH
        },
        time,
        self.options.Easing, function() {
          scrollEnd();
        });
      }

      //if direction is x
      if (self.options.Direction === "x") {

        //stop animation and animate the "scrollLeft" to the targeted floor
        $(node).stop().animate({
          scrollLeft: (floor - 1) * WW
        },
        time,
        self.options.Easing, function() {
          scrollEnd();
        });
      }


      //if direction is chocolate
      if (self.options.Direction === "chocolate") {

        //get target axis
        var target = floorXY[floor - 1].split("|");

        //if queued options is true
        if (self.options.Queued) {

          //queued direction is "x"
          if (self.options.QueuedDirection === "x") {

            //if target is on the same horizontal level
            if ($(node).scrollLeft() === (target[1] - 1) * WW) {

              //stop animation and animate the "scrollTop" to the targeted floor
              $(node).stop().animate({
                scrollTop: (target[0] - 1) * WH
              },
              time,
              self.options.Easing, function() {
                scrollEnd();
              });

              //if target is not on the same level
            } else {

              //stop animation, first  animate the "scrollLeft" to the targeted floor
              $(node).stop().animate({
                scrollLeft: (target[1] - 1) * WW
              },
              time,
              self.options.Easing,

              //and then animate the "scrollTop" to the targeted floor
              function() {
                $(node).stop().animate({
                  scrollTop: (target[0] - 1) * WH
                },
                time,
                self.options.Easing, function() {
                  scrollEnd();
                });
              });
            }

            //if queued direction is set on y
          } else if (self.options.QueuedDirection === "y") {

            //if target is on the same vertical level
            if ($(node).scrollTop() === (target[0] - 1) * WH) {

              //stop animation and animate the "scrollLeft" to the targeted floor
              $(node).stop().animate({
                scrollLeft: (target[1] - 1) * WW
              },
              time,
              self.options.Easing, function() {
                scrollEnd();
              });

              //if target is not on the same vertical level
            } else {

              //stop animation, first  animate the "scrollTop" to the targeted floor
              $(node).stop().animate({
                scrollTop: (target[0] - 1) * WH
              },
              time,
              self.options.Easing,

              //and then animate the "scrollLeft" to the targeted floor
              function() {
                $(node).stop().animate({
                  scrollLeft: (target[1] - 1) * WW
                },
                time,
                self.options.Easing, function() {
                  scrollEnd();
                });
              });
            }

          }

          //if queued option is false
        } else {

          //stop animation,  animate the "scrollLeft" & "scrollTop" to the targeted floor
          $(node).stop().animate({
            scrollLeft: (target[1] - 1) * WW,
            scrollTop: (target[0] - 1) * WH
          },
          time,
          self.options.Easing, function() {
            scrollEnd();
          });
        }


      }

      if (!hashChange) {
        if (self.options.AscensorFloorName !== null) {
          //update url hash
          window.location.hash = "/" + floorName[floor - 1];
        }
      }

      //remove linkActive class on every link
      $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive");

      //add LinkActive class to equivalent Link
      $("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive");

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
          type:"ascensorDown",
          floor: floorActive
        })
        break;

        //keyUp
      case 38:
	  case 87:
        $(node).trigger({
          type:"ascensorUp",
          floor: floorActive
        })
        break;

        //keyLeft
      case 37:
	  case 65:
        $(node).trigger({
          type:"ascensorLeft",
          floor: floorActive
        })
        break;

        //keyright
      case 39:
	  case 68:
        $(node).trigger({
          type:"ascensorRight",
          floor: floorActive
        })
        break;
      }
    }

    //if key navigation is true
    if (self.options.KeyNavigation) {

      //if browser is mozilla
      if ($.browser.mozilla) {

        //use keypress
        $(document).keypress(checkKey);

        //for all brother
      } else {

        //use keydown
        $(document).keydown(checkKey);
      }
    }

    function scrollStart(){
      $(node).trigger({
        type:"ascensorStart",
        floor: floorActive
      })
    }


    function scrollEnd(){
      $(node).trigger({
        type:"ascensorEnd",
        floor: floorActive
      })
    }


    function down() {
      if (self.options.Direction == "y") {
        $(node).trigger({
          type:"ascensorNext",
          floor: floorActive
        })
      } else if (self.options.Direction == "chocolate") {
        chocolateDirection(1, 0)
      }
    }

    function up() {
      if (self.options.Direction == "y") {
        $(node).trigger({
          type:"ascensorPrev",
          floor: floorActive
        })
      } else if (self.options.Direction == "chocolate") {
        chocolateDirection(-1, 0)
      }
    }

    function left() {
      if (self.options.Direction == "x") {
        $(node).trigger({
          type:"ascensorPrev",
          floor: floorActive
        })
      } else if (self.options.Direction == "chocolate") {
        chocolateDirection(0, 1)
      }
    }

    function right() {
      if (self.options.Direction == "x") {
        $(node).trigger({
          type:"ascensorNext",
          floor: floorActive
        })
      } else if (self.options.Direction == "chocolate") {
        chocolateDirection(0, -1)
      }
    }

    function prev() {
      floorActive = floorActive - 1;
      if (floorActive < 1) {
        if (self.options.Loop) {
          floorActive = floorCounter;
        } else {
          floorActive = 1;
        }
      }
      targetScroll(floorActive, self.options.Time);
    }

    function next() {
      floorActive = floorActive + 1;
      if (floorActive > floorCounter) {
        if (self.options.Loop) {
          floorActive = floorCounter;
        } else {
          floorActive = 1;
        }
      }
      targetScroll(floorActive, self.options.Time);
    }

    function chocolateDirection(addCoordY, addCoordX) {
      var floorReference = floorXY[floorActive - 1].split("|");
      $.each(floorXY, function(index) {
        if (floorXY[index] === (parseInt(floorReference[0], 10) + addCoordY) + "|" + (parseInt(floorReference[1], 10) + addCoordX)) {
          targetScroll(index + 1, self.options.Time);
        }
      });
    }

    $(node).on("ascensorLeft", function() {
      right();
    })

    $(node).on("ascensorRight", function() {
      left();
    })

    $(node).on("ascensorUp", function() {
      up();
    })

    $(node).on("ascensorDown", function() {
      down();
    })

    $(node).on("ascensorNext", function() {
      next();
    })

    $(node).on("ascensorPrev", function() {
      prev();
    })

    //on ascensor prev link click
    $("." + self.options.AscensorName + "LinkPrev").on("click", function() {
      prev()
    });

    //on ascensor next click
    $("." + self.options.AscensorName + "LinkNext").on("click", function() {
      next()
    });
	
	// on ancensor left click
	$("." + self.options.AscensorName + "LinkLeft").on("click", function() {
      left()
    });
	
	// on ancensor right click
	$("." + self.options.AscensorName + "LinkRight").on("click", function() {
      right()
    });
	
	// on ancensor up click
	$("." + self.options.AscensorName + "LinkUp").on("click", function() {
      down()
    });
	
	// on ancensor down click
	$("." + self.options.AscensorName + "LinkDown").on("click", function() {
      up()
    });
    $("." + self.options.AscensorName + "Link").on("click", function() {

      //look for the second class and split the number
      var floorReference = parseInt(($(this).attr("class").split(" ")[1].split(self.options.AscensorName + "Link"))[1], 10);

      //target the floor number
      targetScroll(floorReference, self.options.Time);

    });

    //scroll to active floor at start
    targetScroll(floorActive, 1, true);

    //when hash change, start hashchange function
    $(window).on("hashchange", function() {
      hashChange();
    });
    
    //start hashChange function at document loading
    hashChange(true);
      

    //end plugin action
  };


  /***********************************************************************
		12. WRAPPER AROUND PLUGIN
	***********************************************************************/
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };

}(jQuery, window));