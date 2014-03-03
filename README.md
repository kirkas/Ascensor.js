# Ascensor.js [![Build Status](https://travis-ci.org/kirkas/Ascensor.js.png?branch=master)](https://travis-ci.org/kirkas/Ascensor.js) [![devDependency Status](https://david-dm.org/kirkas/Ascensor.js/dev-status.png)](https://david-dm.org/kirkas/Ascensor.js#info=devDependencies) 

Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system ([homepage](http://kirkas.ch/ascensor))



<!-- Section - Getting started -->
### Getting Started
Download the [production version][min] or the [development version][max].
[max]: https://raw.github.com/kirkas/Ascensor.js/master/dist/jquery.ascensor.js
[min]: https://raw.github.com/kirkas/Ascensor.js/master/dist/jquery.ascensor.min.js

In your web page:
```html
<div id="ascensor">
  <div>Content 1</div>
  <div>Content 2</div>
  <div>Content 3</div>
  <div>Content 4</div>
  <div>Content 5</div>
  <div>Content 6</div>  
  <div>Content 7</div>
</div>

<script src="jquery['>=1.7'].js"></script>
<script src="jquery.ascensor.js"></script>
<script>
  $('#ascensor').ascensor();
</script>
```



<!-- Section - Public method -->
### Public Methods
Note that to access public method, you need to access the instance store in the data attribute under the plugin name. This a behavior inherited from the [jQuery boilerplate](http://jqueryboilerplate.com/).
```js
var ascensor = $('#ascensor').ascensor();           // Init ascensor
var ascensorInstance = ascensor.data('ascensor');   // Access instance

ascensorInstance.prev();                            // Go to previous floor
ascensorInstance.next();                            // Go to next floor

ascensorInstance.scrollToFloor(4);                  // Go to floor Index
ascensorInstance.scrollToFloor('content2');         // Go to floor Name

ascensorInstance.scrollToDirection('up');           // Go up
ascensorInstance.scrollToDirection('down');         // Go down
ascensorInstance.scrollToDirection('left');         // Go left
ascensorInstance.scrollToDirection('right');        // Go right

ascensorInstance.refresh();                         // Refresh floor position
ascensorInstance.destroy();                         // Remove plugin
```



<!-- Section - Events -->
### Events
Ascensor emit two event, on `scrollStart` &amp; `scrollEnd`, they both return an array with the original floor and the targeted floor.

```js
var ascensor = $('#ascensor').ascensor();           // Init ascensor

ascensor.on("scrollStart", function(e, floor){
  console.log(floor.from)                           // Return the origin floor
  console.log(floor.to)                             // Return the targeted floor
});

ascensor.on("scrollEnd", function(e, floor){
  console.log(floor.from)                           // Return the origin floor
  console.log(floor.to)                             // Return the targeted floor
});
```



<!-- Section - Data attribute -->
### NEW! - Data attribute
Sometime you need a floor to behave differently in term of direction, you can now easily force this by adding a custom data-attribute on the dom element.

Here the available attribute:

`data-ascensor-next`<br/>
`data-ascensor-prev`<br/>
`data-ascensor-up`<br/>
`data-ascensor-down`<br/>
`data-ascensor-left`<br/>
`data-ascensor-right`<br/>

example:
```html
<div id="ascensor"> 
  <div data-ascensor-left="3" >Content 1</div>   <!-- This will force the left key to scroll to the last floor -->
  <div>Content 2</div>
  <div>Content 3</div>
  <div data-ascensor-right="0" >Content 4</div>  <!-- This will force the right key to scroll to the first floor -->
</div>
```


<!-- Section - News  -->
### NEW! - Swipe event
Ascensor now use hiw own swipe event system. Just set 
`swipeNavigation` to `true`, `false` or `"mobile-only"` (default).



<!-- Section - Options  -->
### Options

**ascensorFloorName**<br/>
Type: `array ` of `string`<br/>
Default: `null`<br/>
descriptions: Choose and name for each floor, this name will be added in the url as #name<br/>
example: `ascensorFloorName: ['content1','content2','content3']`<br/>


**childType**<br/>
Type: `string`<br/>
Default: `div`<br/>
descriptions: Specify the child tag if no div ('section' or 'article')<br/>
example: `childType:'article'`<br/>

**width**<br/>
Type: `integer` or `string`<br/>
Default: `"100%"`<br/>
descriptions: the width of your floor (% or pixel)<br/>
example: `width: "80%"`<br/>

**height**<br/>
Type: `integer` or `string`<br/>
Default: `"100%"`<br/>
descriptions: the height of your floor (% or pixel)<br/>
example: `height: "300px"`<br/>

**ready**<br/>
Type: `function`<br/>
Default: `false`<br/>
descriptions: function to execute when ascensor is ready<br/>
example: `ready: function(){ alert("ready") }`<br/>

**direction**<br/>
Type: `string` or `object`<br/>
Default: `'y'`<br/>
descriptions: specify the direction ``'x'``, ``'y'`` or and array of x/y position for each floor ``[[2,1],[2,2],[3,2]]``<br/>
example: `direction: [[2,1],[2,2],[3,2]]`<br/>

**time**<br/>
Type: `integer`<br/>
Default: `300`<br/>
descriptions: Specify speed of transition<br/>
example: `time: 500`<br/>

**easing**<br/>
Type: `string`<br/>
Default: `linear`<br/>
descriptions: Specify easing option (don't forget to add the easing plugin)<br/>
example: `easing: 'easeInElastic'`<br/>

**swipeNavigation**<br/>
Type: `boolean` or `string`<br/>
Default: `mobile-only`<br/>
descriptions: Specify if you want swipe navigation, you can set true, false or "mobile-only" (default)<br/>
example: `swipeNavigation: true`<br/>

**keyNavigation**<br/>
Type: `boolean`<br/>
Default: `true`<br/>
descriptions: choose if you want direction key support<br/>
example: `keyNavigation: false`<br/>

**queued**<br/>
Type: `boolean` or `string`<br/>
Default: `false`<br/>
descriptions: can be false, 'x' or 'y' (queued axis)<br/>
example: `queued: 'x'`<br/>

**jump**<br/>
Type: `boolean`<br/>
Default: `false`<br/>
descriptions: Specify is you want ascensor to jump between floor, even if a gap is present between them<br/>
example: `jump: true`<br/>

**loop**<br/>
Type: `boolean`<br/>
Default: `true`<br/>
descriptions: Specify if you want ascensor to loop once reach the end of an axis, There is six differents behavior for ascensor.<br/>
`true`: will reach the further floor on same axis once reach the end, on all axis<br/>
`"loop-x"`: will reach the further floor on same axis once reach the end, only on X axis<br/>
`"loop-y"`: will reach the further floor on same axis once reach the end, only on Y axis<br/>
`"increment"`: will reach next same-axis floor level when reach end end, on all axis<br/>
`"increment-x"`: will reach opposite floor on y axis, but jump to next level on X axis<br/>
`"increment-y"`: will reach opposite floor on y axis, but jump to next level on Y axis<br/>
example: `loop: increment-x`<br/>



<!-- Section - Examples  -->
### Demo &amp; Examples
Note that all example are situated in the examples folder of the repository <br/>
[Simple](http://htmlpreview.github.io/?https://raw.github.com/kirkas/Ascensor.js/master/examples/example_simple.html)<br/>
[Horizontal](http://htmlpreview.github.io/?https://raw.github.com/kirkas/Ascensor.js/master/examples/example_horizontal.html)<br/>
[Chocolat](http://htmlpreview.github.io/?https://raw.github.com/kirkas/Ascensor.js/master/examples/example_chocolat.html)<br/>
[Url](http://htmlpreview.github.io/?https://raw.github.com/kirkas/Ascensor.js/master/examples/example_url.html)<br/>
[Swipe](http://htmlpreview.github.io/?https://raw.github.com/kirkas/Ascensor.js/master/examples/example_swipe.html)<br/>
[Loop](http://htmlpreview.github.io/?https://raw.github.com/kirkas/Ascensor.js/master/examples/example_chocolat_loop.html)<br/>
[Increment](http://htmlpreview.github.io/?https://raw.github.com/kirkas/Ascensor.js/master/examples/example_chocolat_loop_increment.html)<br/>



<!-- Section - Use  -->
#### Website using ascensor

[waterevive](http://www.waterevive.com)<br/>
[shanaemairs](http://shanaemairs.com)<br/>
[reverseburo](http://reverseburo.com)<br/>
[robclowes](http://www.robclowes.com)<br/>
[iadindustry](http://iadindustry.se)<br/>
[newworldwhisky](http://newworldwhisky.com.au)<br/>
[lucasexbrayat](http://www.lucasexbrayat.com/#/accueil)<br/>
[scan.dk](http://scan.dk/dk/)<br/>
[alpineconstruction.dk](http://alpineconstruction.ca/)<br/>



<!-- Section - Contribution  -->
####Contribution

You want help? great!
For my workflow, I use [grunt.js](http://gruntjs.com/) (require node & npm installed)

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Add your change/fix
4. Build project using "grunt build" (in terminal)
5. Commit your change (only if "grunt build" return no error)
6. Push to the branch (git push origin my-new-feature) & request pull request!