// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {  
  var pluginName = 'ascensor';
  
  var defaults = {
    ascensorFloorName: null,            // Choose name for each floor
    childType: "div",                   // Specify the child type if there are no 'div'
    windowsOn: 0,                       // Choose the floor to start on
    direction: "y",                     // specify if direction is x,y or chocolate
    loop: true,                         // specify if direction is x,y or chocolate
    ascensorMap: "",                    // If you choose chocolate for direction, speficy position
    time: "1000",                       // Specify speed of transition
    easing: "linear",                   // Specify easing option
    keyNavigation: true,                // choose if you want direction key support
    touchSwipeIntegration: false,       // choose if you want swipe event support (requires http://labs.rampinteractive.co.uk/touchSwipe/)
    queued: false,                      // choose if you want direction scroll queued
    queuedDirection: "x"               // choose if you want direction scroll queued "x" or "y" (default : "x")
  };
  
  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }
  
  Plugin.prototype.init = function() {
    var 
      self = this,
      node = $(this.element),
      nodeChildren = node.children(self.options.childType),
      
      //floor counter settings
      floorActive = self.options.windowsOn,
      floorCounter = -1,
      
      //height/width settings
      WW,
      WH,
      
      //plugins settings
      direction = self.options.direction,
      $document = $(document),
      $window = $(window),
      
      //hash 
      hash;