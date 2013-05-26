# Ascensor.js

Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system ([homepage](http://kirkas.ch/ascensor))

## Getting Started
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

<script src="jquery.js"></script>
<script src="jquery.ascensor.js"></script>
<script>
	$('#ascensor').ascensor();
</script>
```
## Documentation

### Options


#### ascensorName
- Type: 'string'
- Default: 'ascensor'
- descriptions: The ascensor name (use for class &amp; selector)
- example: ```ascensorName:'myAscensor'```

#### ascensorFloorName
- Type: 'string'
- Default: 'null'
- descriptions: Choose and name for each floor
- example: ```ascensorFloorName: ['content1','content2','content3']```

#### childType
- Type: 'string'
- Default: 'div'
- descriptions: Specify the child tag if no div ('section' or 'article')
- example: ```childType:'article'```

#### windowsOn
- Type: 'integer'
- Default: '1'
- descriptions: Choose the floor to start on
- example: ```windowsOn: 3```

#### direction
- Type: 'string'
- Default: 'y'
- descriptions: specify the direction ('x', 'y' or 'chocolate')
- example: ```direction: 'chocolate'```

#### ascensorMap
- Type: 'string'
- Default: 'null'
- descriptions: If you choose chocolate for direction, speficy position for x/y (ex: AscensorMap:[[2,1],[2,2],[3,2]])
- example: ```ascensorMap:[[2,1],[2,2],[3,2]]```

#### time
- Type: 'string'
- Default: '1000'
- descriptions: Specify speed of transition
- example: ```time: 3000```

#### easing
- Type: 'string'
- Default: 'linear'
- descriptions: Specify easing option (don't forget to add the easing plugin)
- example: ```easing: 'easeInElastic'```

#### overflow
- Type: 'string'
- Default: 'scroll'
- descriptions: Choose your main container overflow default behavior
- example: ```overflow: 'hidden'```

#### keyNavigation
- Type: 'boolean'
- Default: 'true'
- descriptions: choose if you want direction key support
- example: ```keyNavigation: false```

#### queued
- Type: 'boolean'
- Default: 'false'
- descriptions: choose if you want direction scroll queued
- example: ```queued: true```

#### queuedDirection
- Type: 'string'
- Default: 'x'
- descriptions: choose if you want direction scroll queued 'x' or 'y'
- example: ```queuedDirection: 'y'```

#### loop
- Type: 'boolean'
- Default: 'true'
- descriptions: specify if you want an loop
- example: ```loop: false```


### CSS

To create next button, use class 'ascensorName'+LinkNext

example: ```<button class='myAscensorLinkNext'>Next floor</button>```

To create prev button, use class 'ascensorName'+LinkPrev

example: ```<button class='myAscensorLinkPrev'>Previous floor</button>```

To create direct button to one of the floor, use class 'ascensorName'+Link and 'ascensorName'+LinkPrev+index

example: ```<button class='myAscensorLink myAscensorLink3'>Go the the 4 floor (JS count from 0)</button>```

Ascensor assign each floor has the class 'ascensorName'+Floor

example: ```class='myAscensorFloor'```

Each floor has for id 'ascensorName'+Floor+Floor-Number

example: ```id='myAscensorFloor1'```

the link related to the current page has the class 'ascensorName'+Link and 'ascensorName'+LinkActive

example: ```class='myAscensorLinkActive'```




## Examples
https://github.com/kirkas/Ascensor.js/tree/master/examples

## Website using ascensor

- [waterevive](http://www.waterevive.com)
- [shanaemairs](http://shanaemairs.com)
- [reverseburo](http://reverseburo.com)
- [robclowes](http://www.robclowes.com)
- [iadindustry](http://iadindustry.se)
- [newworldwhisky](http://newworldwhisky.com.au)

## Contribution

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