(function($) {
	$.fn.ascensor = function(params){
	var params = $.extend({
		ChildType:"div",
		WindowsOn:1,
		Direction:'y',
		AscensorMap:'',
		AscensorName:'ascensor',
		AscensorFloorName:'',
		Time:1000,
	},params);	

var node=this;
var pageNumber=0;
var windowHeight=$(window).height();
var windowWidth=$(window).width();
var StageOn=params.WindowsOn;

node.width(windowWidth);
node.height(windowHeight);
node.css('position','absolute');

//URL MANAGEMENT
if(params.AscensorFloorName.split==''){}else{
	var url=window.location.href;
	var lastPart = url.split("/").pop();
	var floorName = params.AscensorFloorName.split(' | ');
	$.each(floorName,function(index){
		if(floorName[index]===lastPart){
			StageOn=index+1;
		}
	});
}

//NAMING FUNCTION
node.children(params.ChildType).each(function(){
	pageNumber++;
	$(this)
		.attr('id',params.AscensorName+'Floor'+pageNumber)
		.attr('class',params.AscensorName+'Floor')
		.height(windowHeight)
		.width(windowWidth);
});

//RESIZE FUNCTION FUNCTION
$(window).resize(function(){	
	resizeFloor();
})

function resizeFloor(){
	windowHeight=$(window).height();
	windowWidth=$(window).width();
	
	$(node).children(params.ChildType).each(function(){
		$(this)
			.height(windowHeight)
			.width(windowWidth);
	});
	
	$(node).width(windowWidth);
	$(node).height(windowHeight);
	
	if(params.Direction=='x'){
		$(node).children().css('position','absolute');
		$(node).children().each(function(index){$(this).css('left',index*windowWidth);})
	}

	if(params.Direction=='chocolate'){
		var AscensorMap = params.AscensorMap.split(' & ');
		$(node).children(params.ChildType).each(function(index){
			var CoordName = AscensorMap[index].split('|');
			$(this)
				.css('position','absolute')
				.css('left',(CoordName[1]-1)*windowWidth)
				.css('top',(CoordName[0]-1)*windowHeight);
		});
	}
	
	targetScroll(StageOn,1);
}

//SCROLLTO FUNCTION
function targetScroll(floor, time){
	if(params.Direction=='y'){$(node).stop().animate({scrollTop:(floor-1)*windowHeight},time);}
	if(params.Direction=='x'){$(node).stop().animate({scrollLeft:(floor-1)*windowWidth},time);}
	if(params.Direction=='chocolate'){
		var AscensorMap=params.AscensorMap.split(' & ');
		var target = AscensorMap[floor-1].split('|');
		$(node).stop().animate({
			scrollLeft:(target[1]-1)*windowWidth,
			scrollTop:(target[0]-1)*windowHeight
		},time);
	}

	StageOn=floor;
	if(params.AscensorFloorName==''){}else{
		var floorName=params.AscensorFloorName.split(' | ');
			floorName=floorName[StageOn-1];
		window.location.href='#/'+floorName;
	}
	$('.'+params.AscensorName+'Link').removeClass(params.AscensorName+'LinkActive')
	$('.'+params.AscensorName+'Link'+floor).addClass(params.AscensorName+'LinkActive')
}

//LINK FUNCTION
$('.'+params.AscensorName+'Link').click(function(){
	var floorReference=$(this).attr('class');
		floorReference=floorReference.split(' ');
		floorReference=floorReference[1];
		floorReference = floorReference.split(params.AscensorName+'Link');
		floorReference = parseInt(floorReference[1]);
		targetScroll(floorReference,params.Time);
})

//PREV FUNCTION
$('.'+params.AscensorName+'LinkPrev').click(function(){
	var prev=StageOn-1;
	if(prev<1){
		prev=pageNumber;
	}
	targetScroll(prev,params.Time);
})

//NEXT FUNCTION
$('.'+params.AscensorName+'LinkNext').click(function(){
	var next=StageOn+1;
	if(next>pageNumber){
		next=1;
	}
	targetScroll(next,params.Time);
})

//ROTATION ON DEVICE
var previousOrientation = 0;
var checkOrientation = function(){
    if(window.orientation !== previousOrientation){
       previousOrientation = window.orientation;
       resizeFloor();
    }
};
window.addEventListener("resize", checkOrientation, false);
window.addEventListener("orientationchange", checkOrientation, false);
setInterval(checkOrientation, 1);

//KEY EVENT
function checkKey(e){
     switch (e.keyCode) {
     	//up
        case 40:
        	console.log('down')
	    	navigationPress(1,0);
	    	return false;
	    	break;
	    case 38:
	    	console.log('up')
	    	navigationPress(-1,0);
	   	    return false;
	   	    break;
	   	case 37:
	   	console.log('gauche')
	   		navigationPress(0,-1);
	   	    return false;
	   	    break;
	    case 39:
	    	console.log('droite')
	        navigationPress(0,1);
	        return false;
	      	break; 
        }      
}

if ($.browser.mozilla) {$(document).keypress (checkKey);
}else{$(document).keydown (checkKey);}

//KEY FUNCTION
function navigationPress (addCoordY, addCoordX){
	if(params.Direction=='y'){
		if(addCoordY==1 && addCoordX==0){
			var next=StageOn+1;
			if(next>pageNumber){}else{targetScroll(next,params.Time);}
		}

		if(addCoordY==-1 && addCoordX==0){
			var prev=StageOn-1;
			if(prev<1){}else{targetScroll(prev,params.Time);}
		}
	}
	
	if(params.Direction=='x'){
		if(addCoordY==0 && addCoordX==-1){
			var prev=StageOn-1;
			if(prev<1){}else{targetScroll(prev,params.Time);}
		}

		if(addCoordY==0 && addCoordX==1){
			var next=StageOn+1;
			if(next>pageNumber){}else{targetScroll(next,params.Time);}
		}
	}
	
	if(params.Direction=='chocolate'){
		var floorReference = params.AscensorMap.split(' & ');
		floorReference = floorReference[StageOn-1].split('|');
		var nextPotentialFloor=(parseInt(floorReference[0])+addCoordY)+'|'+(parseInt(floorReference[1])+addCoordX);
		var potentialMatch = params.AscensorMap.split(' & ');
		$.each(potentialMatch,function(index){
			if(potentialMatch[index]===nextPotentialFloor){targetScroll(index+1,params.Time);}
		});
	}
}

//START PLUGIN
targetScroll(StageOn,1);
resizeFloor();

};
})(jQuery);
