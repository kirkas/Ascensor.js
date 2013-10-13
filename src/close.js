};

$.fn[ pluginName ] = function ( options ) {
  return this.each(function() {
    if ( !$.data( this, "plugin_" + pluginName ) ) {
      $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
    }
  });
};

})( jQuery, window, document );