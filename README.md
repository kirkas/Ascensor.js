# Ascensor.js [![Build Status](https://travis-ci.org/kirkas/Ascensor.js.png?branch=master)](https://travis-ci.org/kirkas/Ascensor.js) [![authors](https://sourcegraph.com/api/repos/github.com/kirkas/Ascensor.js/badges/authors.png)](https://sourcegraph.com/github.com/kirkas/Ascensor.js) [![Total views](https://sourcegraph.com/api/repos/github.com/kirkas/Ascensor.js/counters/views.png)](https://sourcegraph.com/github.com/kirkas/Ascensor.js) [![devDependency Status](https://david-dm.org/kirkas/Ascensor.js/dev-status.png)](https://david-dm.org/kirkas/Ascensor.js#info=devDependencies) [![Gittip](http://img.shields.io/gittip/logankoester.png)](https://www.gittip.com/kirkas/)


Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system ([homepage](http://kirkas.ch/ascensor))


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

### Triggers
You can navigate by using jquery trigger system

```js
var ascensor = $('#ascensor').ascensor();

// Go to previous floor
ascensor.trigger("prev");

// Go to next floor
ascensor.trigger("next");

// refresh floor position, usefull when you dynamically append element
ascensor.trigger("refresh");

// Get current floor (integer)
ascensor.data("current-floor");

// Go to floor index or floor name
ascensor.trigger("scrollToStage", 4);
ascensor.trigger("scrollToStage", "content2")

// Go up, down, left or right
ascensor.trigger("scrollToDirection" ,"up");
ascensor.trigger("scrollToDirection" ,"down");
ascensor.trigger("scrollToDirection" ,"left");
ascensor.trigger("scrollToDirection" ,"right");

// Ascensor also trigger a scrollStart & ScrollEnd event
ascensor.on("scrollStart", function(event, floor){
  console.log(floor.from)  // Return the origin floor
  console.log(floor.to)    // Return the targeted floor
});

ascensor.on("scrollEnd", function(event, floor){
  console.log(floor.from)  // Return the origin floor
  console.log(floor.to)    // Return the targeted floor
});
```

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


**windowsOn**<br/>
Type: `integer`<br/>
Default: `0`<br/>
descriptions: Choose the floor to start on<br/>
example: `windowsOn: 3`<br/>

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


**touchSwipeIntegration**<br/>
Type: `boolean`<br/>
Default: `false`<br/>
descriptions: Specify if you want jquery swipe implentation<br/>
example: `touchSwipeIntegration: true`<br/>


####Examples

https://github.com/kirkas/Ascensor.js/tree/master/examples


####Website using ascensor

[waterevive](http://www.waterevive.com)<br/>
[shanaemairs](http://shanaemairs.com)<br/>
[reverseburo](http://reverseburo.com)<br/>
[robclowes](http://www.robclowes.com)<br/>
[iadindustry](http://iadindustry.se)<br/>
[newworldwhisky](http://newworldwhisky.com.au)<br/>
[lucasexbrayat](http://www.lucasexbrayat.com/#/accueil)<br/>
[scan.dk](http://scan.dk/dk/)<br/>

####Contribution

You want help? great!
For my workflow, I use [grunt.js](http://gruntjs.com/) (require node & npm installed)

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. In terminal, type "npm install" to install dependencies
4. Add your change/fix
5. Check the code using "grunt jshint" (in terminal)
6. Make sure all "examples" behavior is correct 
7. minify/beautify the code using "grunt build" (in terminal)
8. Commit your change (only if "grunt build" return no error)
9. Push to the branch (git push origin my-new-feature)
10. Create new Pull Request
