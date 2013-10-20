;(function ( $, window, document, undefined ) {  
  var pluginName = 'ascensor';
  
  /*
    Parameters => 
      ascensorFloorName           => Choose name for each floor, default to false
      childType                   => Specify the child type if not a 'div' element
      windowsOn                   => Choose the floor to start on
      direction                   => specify if direction is x,y or chocolate
      loop                        => If ascensor should loop at the end
      ascensorMap                 => If you choose chocolate for direction, speficy position
      time                        => Specify speed of transition
      easing                      => Specify if direction is x,y or chocolate
      keyNavigation               => Choose if you want direction key support
      touchSwipeIntegration       => Choose if you want swipe event support (requires http://labs.rampinteractive.co.uk/touchSwipe/)
      queued                      => Choose if you want direction scroll queued
  */
  var defaults = {
    ascensorFloorName: null,
    childType: "div",
    windowsOn: 0,
    direction: "y",
    loop: true,
    ascensorMap: "",
    time: 300,
    easing: "linear",
    keyNavigation: true,
    touchSwipeIntegration: false,
    queued: false
  };

  /*
    Create plugin instance
  */
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