/*********************************************************************************************************

	JQUERY.ASCENSOR.JS
		VERSION: 1.5.2
		DATE: 21/10/2012

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

	check on : 	- Chrome v22 
				- Safari v6.0.1
				- firefox 15.0.1
				- opera v12.02 
				- IE 8
				- IE9

				- Chrome mobile (IOS)
				- Safari mobile (IOS)

	Please, sand request/bug to contact@kirkas.ch

**********************************************************************************************************/


;(function ($, window, undefined) {


	/***********************************************************************
		1. PLUGIN DEFAULTS OPTION
	********************************************************************** */
	var pluginName = 'ascensor',
		defaults = {
			AscensorName: "ascensor",				//	First, choose the ascensor name
			AscensorFloorName: "",					//	Choose name for each floor
			ChildType: "div",						//	Specify the child type if there are no 'div'
			
			WindowsOn: 1,							//	Choose the floor to start on
			Direction: "y",							//	specify if direction is x,y or chocolate
			AscensorMap: "",						//	If you choose chocolate for direction, speficy position
			
			Time: "1000",							//	Specify speed of transition
			Easing: "linear",						//	Specify easing option
			
			KeyNavigation: true,					//	choose if you want direction key support
			
			Queued:false,							//	choose if you want direction scroll queued
			QueuedDirection:"x"						//	choose if you want direction scroll queued "x" or "y" (default : "x")
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
			floorName = self.options.AscensorFloorName.split(" | "),
			direction = self.options.Direction,
			
			//hash 
			hash;
			
		
		/***********************************************************************
			4. START PLUGIN ACTION
		***********************************************************************/
		
		//define position,height & width
		$(node)
			.css("position", "absolute")
			.width(WW)
			.height(WH);
			
		//define height & width
		$(nodeChildren)
			.width(WW)
			.height(WH)
			
			//for each floor
			.each(function () {
				
				//count floor
				floorCounter++;
				
				//give class and spcific id
				$(this)
					.attr("id", self.options.AscensorName + "Floor" + floorCounter)
					.addClass(self.options.AscensorName + "Floor");
			});
			
		// if direction is x or chocolate
		if(direction==="x" || direction==="chocolate"){
		
			//children position = absolute
			$(nodeChildren).css("position", "absolute");
		}
		
		
		
		
		/***********************************************************************
			5. HASH FUNCTION
		***********************************************************************/
		function hashChange() {
		
			//if the url have an "hash"
			if ( window.location.hash ) {
			
				//cut the "#/" part
				hash = window.location.hash.split("/").pop();
				
				//for each floorName given
				$(floorName).each(function (index) {
				
					//compare with the hash, if equal
					if (hash === floorName[index]) {
					
						//the floor become the index of equivalent floorName
						floorActive = index + 1;
						
						//remove and add class "link active" to the current link
						$("." + self.options.AscensorName + "Link")
							.removeClass(self.options.AscensorName + "LinkActive")
							.eq(floorActive - 1)
							.addClass(self.options.AscensorName + "LinkActive");
							
						//Scroll to the target floor
						targetScroll(floorActive, self.options.Time);
						
					}
					
				});
				
			}
			
		}
		
		//when hash change, start hashchange function
		$(window).on("hashchange", function () {
			hashChange();
		});
		
		//start hashChange function at document loading
		hashChange();
		
		
		/***********************************************************************
			6. RESIZE FONCTION
		***********************************************************************/
		function elementResize() {
			
			//update WW & WH variables
			WW = $(window).width();
			WH = $(window).height();
			
			//node and node children get have window widht & height
			$(nodeChildren)
				.width(WW)
				.height(WH);
				
			$(node)
				.width(WW)
				.height(WH);
				
			//if direction is y
			if (direction === "y") {
			
				//stop animation and update node scrollTop
				$(node)
					.stop()
					.scrollTop((floorActive - 1) * WH);
			}
			
			//if direction is x
			if (direction === "x") {
			
				//stop animation and update scrollLeft
				$(node)
					.stop()
					.scrollLeft((floorActive - 1) * WW);
				
				//deplace each children depending on index and left margin
				$(nodeChildren).each(function (index) {
					$(this).css("left", index * WW);
				});
			}
			
			//if direction is chocolate
			if (direction === "chocolate") {
			
				// get current floor axis axis info
				var target = floorXY[floorActive - 1].split("|");
				
				//for each children
				$(nodeChildren).each(function (index) {
					
					//get equivalent axis info
					var CoordName = floorXY[index].split("|");
					
					//deplace each children in x/y, depending on the index position
					$(this).css({
						"left": (CoordName[1] - 1) * WW,
						"top": (CoordName[0] - 1) * WH
					}); 
					
				});
				
				//stop animation and update scrollLeft & scrollTop
				$(node)
					.stop()
					.scrollLeft((target[1] - 1) * WW)
					.scrollTop((target[0] - 1) * WH);
			}
		}
		
		//bind to resize
		$(window)
			.resize(function(){elementResize();})
			.load(function(){elementResize();})
			.resize();
			
		//if browser is mobile
		if (window.DeviceOrientationEvent) {

			//add orientation check
			$(window).bind('orientationchange', function(){elementResize();});
		}
		
				
		/***********************************************************************
			7. SCROLLTO FONCTION
		***********************************************************************/
		function targetScroll(floor, time) {
			
			//if direction is y
			if (direction === "y") {
			
				//stop animation and animate the "scrollTop" to the targeted floor
				$(node)
					.stop()
					.animate(
						{scrollTop: (floor - 1) * WH},
						time,
						self.options.Easing
					);
			}
			
			//if direction is x
			if (direction === "x") {
			
				//stop animation and animate the "scrollLeft" to the targeted floor
				$(node)
					.stop()
					.animate(
						{scrollLeft: (floor - 1) * WW},
						time,
						self.options.Easing
					);
			}
			
		
			//if direction is chocolate
			if (direction === "chocolate") {
			
				//get target axis
				var target = floorXY[floor - 1].split("|");
				
				//if queued options is true
				if(self.options.Queued){
				
					//queued direction is "x"
					if(self.options.QueuedDirection==="x"){
					
						//if target is on the same horizontal level
						if($(node).scrollLeft()===(target[1] - 1) * WW){
						
							//stop animation and animate the "scrollTop" to the targeted floor
							$(node)
								.stop()
								.animate(
									{scrollTop: (target[0] - 1) * WH},
									time,
									self.options.Easing
								);
								
						//if target is not on the same level
						}else{
						
							//stop animation, first  animate the "scrollLeft" to the targeted floor
							$(node)
								.stop()
								.animate(
									{scrollLeft: (target[1] - 1) * WW},
									time,
									self.options.Easing,
									
									//and then animate the "scrollTop" to the targeted floor
									function(){
										$(node)
											.stop()
											.animate(
												{scrollTop: (target[0] - 1) * WH},
												time,
												self.options.Easing
											);
									}
								);
						}
						
					//if queued direction is set on y
					}else if(self.options.QueuedDirection==="y"){
					
						//if target is on the same vertical level
						if($(node).scrollTop()===(target[0] - 1) * WH){
						
							//stop animation and animate the "scrollLeft" to the targeted floor
							$(node)
								.stop()
								.animate(
									{scrollLeft: (target[1] - 1) * WW},
									time,
									self.options.Easing
								);
						
						//if target is not on the same vertical level
						}else{
						
							//stop animation, first  animate the "scrollTop" to the targeted floor
							$(node)
								.stop()
								.animate(
									{scrollTop: (target[0] - 1) * WH},
									time,
									self.options.Easing,
									
									//and then animate the "scrollLeft" to the targeted floor
									function(){
										$(node)
											.stop()
											.animate(
												{scrollLeft: (target[1] - 1) * WW},
												time,
												self.options.Easing
											);
									}
							);
						}
										
					}
				
				//if queued option is false
				}else{
				
					//stop animation,  animate the "scrollLeft" & "scrollTop" to the targeted floor
					$(node)
						.stop()
						.animate(
							{
								scrollLeft: (target[1] - 1) * WW,
								scrollTop: (target[0] - 1) * WH
							},
							time,
							self.options.Easing
						);
				}
				
				
			}
			
			//if floor name string has been defined
			if (self.options.AscensorFloorName !== null) {
			
				//update url hash
				window.location.hash = "/" + floorName[floor - 1];
			}
			
			//remove linkActive class on every link
			$("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive");
			
			//add LinkActive class to equivalent Link
			$("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive");
			
			//update floorActive variable
			floorActive = floor;
		}
		
		//scroll to active floor at start
		targetScroll(floorActive, 1);
		
		
		/***********************************************************************
			8. KEYPRESS FUNCTION
		***********************************************************************/
		function navigationPress(addCoordY, addCoordX) {
			
			//if direction is y
			if (direction === "y") {
			
				//if keydown
				if (addCoordY === 1 && addCoordX === 0) {
					
					//if smaller or equal to floor number
					if (floorActive + 1 < floorCounter || floorActive + 1 === floorCounter) {
					
						//go to next floor
						targetScroll(floorActive + 1, self.options.Time);
					}
				}
				
				//if keyup
				if (addCoordY === -1 && addCoordX === 0) {
				
					//if bigger than one or equal one
					if (floorActive - 1 > 1 || floorActive - 1 === 1) {
					
						//scroll to previous floor
						targetScroll(floorActive - 1, self.options.Time);
					}
				}
			}
			
			//if direction is x
			if (direction === "x") {
			
				//if  keyleft
				if (addCoordY === 0 && addCoordX === -1) {
				
					//if bigger than one or equal one
					if (floorActive - 1 > 1 || floorActive - 1 === 1) {
					
						//go to next floor
						targetScroll(floorActive - 1, self.options.Time);
					}
				}
				
				//if keyright
				if (addCoordY === 0 && addCoordX === 1) {
				
					//if smaller or equal to floor number
					if (floorActive + 1 < floorCounter || floorActive + 1 === floorCounter) {
					
						//go to next floor
						targetScroll(floorActive + 1 , self.options.Time);
					}
				}
			}
			
			//if direction is chocolate
			if (direction === "chocolate") {
			
				//get floor reference
				var floorReference = floorXY[floorActive - 1].split("|");
				
				//for each floor
				$.each(floorXY, function (index) {
					
					//if there is a floor equivalent to the target
					if (floorXY[index] === (parseInt(floorReference[0], 10) + addCoordY) + "|" + (parseInt(floorReference[1], 10) + addCoordX)) {
					
						//go the this floor
						targetScroll(index + 1, self.options.Time);
					}
				});
			}
		}
		
		//check key function
		function checkKey(e) {
			switch (e.keyCode) {
			case 40:
				//keyDown
				navigationPress(1, 0);
				break;
			case 38:
				
				//keyUp
				navigationPress(-1, 0);
				break;
			case 37:
			
				//keyLeft
				navigationPress(0, - 1);
				break;
			case 39:
			
				//keyRight
				navigationPress(0, 1);
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
		
		
		/***********************************************************************
			9. LINK FONCTION DEFINITION
		***********************************************************************/
		
		//on ascensor link click
		$("." + self.options.AscensorName + "Link").on("click", function () {
		
			//look for the second class and split the number
			var floorReference = $(this).attr("class");
				floorReference = floorReference.split(" ");
				floorReference = floorReference[1];
				floorReference = floorReference.split(self.options.AscensorName + "Link");
				floorReference = parseInt(floorReference[1], 10);
				
			//target the floor number
			targetScroll(floorReference, self.options.Time);
		});
		
		//on ascensor prev link click
		$("." + self.options.AscensorName + "LinkPrev").on("click", function () {
			
			//soustract one to current floor
			floorActive = floorActive-1;
			
			//if smaller than 1
			if (floorActive < 1) {
			
				//get last floor(remove if you don't want a loop) and add: floorActive=1;
				floorActive = floorCounter;
			}
			
			//target floor number
			targetScroll(floorActive, self.options.Time);
		});
		
		
		//on ascensor next click
		$("." + self.options.AscensorName + "LinkNext").on("click", function () {
		
			//add one to current floor
			floorActive=floorActive+1;
		
			//if bigger than floor total
			if (floorActive > floorCounter) {
			
				//floor = first one (remove if you don't want a loop) and add: floorActive=floorCounter;
				floorActive = 1;
			}
			
			//target floor number
			targetScroll(floorActive, self.options.Time);
		});
		
	//end plugin action
	};
	
	
	/***********************************************************************
		12. WRAPPER AROUND PLUGIN
	***********************************************************************/
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	};

}(jQuery, window));