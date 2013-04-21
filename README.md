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

#### AscensorName
- Type: 'string'
- Default: 'ascensor'
- descriptions: The ascensor name (use for class & selector)

#### AscensorFloorName
- Type: 'string'
- Default: null
- descriptions: Choose and name for each floor (ex: 'content1 | content2 | content3')

#### ChildType
- Type: 'string'
- Default: 'div'
- descriptions: Specify the child tag if no div ('section' or 'article')

#### WindowsOn
- Type: integer
- Default: 1
- descriptions: Choose the floor to start on

#### Direction
- Type: 'string'
- Default: 'y'
- descriptions: specify the direction ('x', 'y' or 'chocolate')

#### AscensorMap
- Type: 'string'
- Default: ''
- descriptions: If you choose chocolate for direction, speficy position for x/y (ex: '2|1 & 2|2 & 3|2')

#### Time
- Type: 'string'
- Default: '1000'
- descriptions: Specify speed of transition

#### Easing
- Type: 'string'
- Default: 'linear'
- descriptions: Specify easing option

#### KeyNavigation
- Type: boolean
- Default: true
- descriptions: choose if you want direction key support

#### Queued
- Type: boolean
- Default: false
- descriptions: choose if you want direction scroll queued

#### QueuedDirection
- Type: 'string'
- Default: 'x'
- descriptions: choose if you want direction scroll queued "x" or "y"

#### Loop
- Type: boolean
- Default: true
- descriptions: specify if you want an loop


## Examples
https://github.com/kirkas/Ascensor.js/tree/master/examples

## Website using ascensor
- [waterevive](http://www.waterevive.com)
- [shanaemairs.com](http://shanaemairs.com/)
- [reverseburo](http://reverseburo.com/)
- [robclowes](http://www.robclowes.com/)
- [iadindustry](http://iadindustry.se/)
- [newworldwhisky](http://newworldwhisky.com.au/)

## Contribution

You want help? great!
For my workflow, I use [grunt.js](http://gruntjs.com/) (require node & npm installed)

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. In terminal, type "npm install" to install dependencies
4. Add your change/fix
5. Check the code using "grunt jshint" (in terminal)
6. minify/beautify the code using "grunt build" (in terminal)
7. Commit your change (only if "grunt build" return no error)
8. Push to the branch (git push origin my-new-feature)
9. Create new Pull Request

