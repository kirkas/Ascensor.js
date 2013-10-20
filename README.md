# Ascensor.js

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

// Go to the 5th floor (JS calcul from 0)
ascensor.trigger("scrollToStage", 4);

// Go up, down, left or right
ascensor.trigger("scrollToDirection" ,"up");
ascensor.trigger("scrollToDirection" ,"down");
ascensor.trigger("scrollToDirection" ,"left");
ascensor.trigger("scrollToDirection" ,"right");

// Ascensor also trigger a scrollStart & ScrollEnd event
ascensor.on("scrollStart", function(event, floor){
  console.log(floor.from) 		// Return the origin floor
  console.log(floor.to) 			// Return the targeted floor
});

ascensor.on("scrollEnd", function(event, floor){
  console.log(floor.from) 		// Return the origin floor
  console.log(floor.to) 			// Return the targeted floor
});
```

###CSS navigation class
**Update**
Since i've added the trigger system, i've removed the css
navigation class system

### Options


**ascensorFloorName**
- Type: ```array ``` of ```string```
- Default: ```null```
- descriptions: Choose and name for each floor, this name will be added in the url as #name
- example: ```ascensorFloorName: ['content1','content2','content3']```

**childType**
- Type: ```string```
- Default: ```div```
- descriptions: Specify the child tag if no div ('section' or 'article')
- example: ```childType:'article'```

**windowsOn**
- Type: ```integer```
- Default: ```0```
- descriptions: Choose the floor to start on
- example: ```windowsOn: 3```

**direction**
- Type: ```string``` or ```object```
- Default: ```y```
- descriptions: specify the direction ``'x'``, ``'y'`` or and array of x/y position for each floor ``[[2,1],[2,2],[3,2]]``
- example: ```direction: [[2,1],[2,2],[3,2]]```

**time**
- Type: ```integer```
- Default: ```300```
- descriptions: Specify speed of transition
- example: ```time: 500```

**easing**
- Type: ```string```
- Default: ```linear```
- descriptions: Specify easing option (don't forget to add the easing plugin)
- example: ```easing: 'easeInElastic'```

**keyNavigation**
- Type: ```boolean```
- Default: ```true```
- descriptions: choose if you want direction key support
- example: ```keyNavigation: false```

**queued**
- Type: ```boolean``` or ```string```
- Default: ```false```
- descriptions: can be false, 'x' or 'y' (queued axis)
- example: ```queued: 'x'```

**loop**
- Type: ```boolean```
- Default: ```true```
- descriptions: specify if you want an loop
- example: ```loop: false```

**touchSwipeIntegration**
- Type: ```boolean```
- Default: ```false```
- descriptions: Specify if you want jquery swipe implentation
- example: ```touchSwipeIntegration: true```


####Examples
https://github.com/kirkas/Ascensor.js/tree/master/examples

####Website using ascensor

- [waterevive](http://www.waterevive.com)
- [shanaemairs](http://shanaemairs.com)
- [reverseburo](http://reverseburo.com)
- [robclowes](http://www.robclowes.com)
- [iadindustry](http://iadindustry.se)
- [newworldwhisky](http://newworldwhisky.com.au)

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