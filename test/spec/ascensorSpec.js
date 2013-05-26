describe("Ascensor.js test suite", function() {

	var parameter;
	var fixture;

	beforeEach(function() {
		fixture = $('<div id="ascensorBuilding"><div>Content 1</div><div>Content 2</div><div>Content 3</div></div>');
	});

	afterEach(function(){
		fixture.children("div").each(function(index, elements){
			expect($(elements).hasClass("ascensorFloor")).toBe(true);
			expect($(elements).attr("id")=="ascensorFloor"+(index)).toBe(true);
			expect(elements).toHaveCss({width: $(window).width()+"px"})
			expect(elements).toHaveCss({height: $(window).height()+"px"})
		})

		parameter="";
	})

	it("Ascensor normal", function() {
		parameter = {direction:"y"};
		fixture.ascensor(parameter);
	});


	it("Ascensor horizontal", function() {
		parameter = {direction:"x"};
		fixture.ascensor(parameter);
		fixture.children("div").each(function(index, elements){
			expect(elements).toHaveCss({position: "absolute"});
			expect(elements).toHaveCss({left: index*$(window).width()+"px"});
		});
	});

	it("Ascensor chocolat", function() {
		var R1 = 1 + Math.floor(Math.random() * 30);
		var R2 = 1 + Math.floor(Math.random() * 30);
		var R3 = 1 + Math.floor(Math.random() * 30);
		var R4 = 1 + Math.floor(Math.random() * 30);
		var R5 = 1 + Math.floor(Math.random() * 30);
		var R6 = 1 + Math.floor(Math.random() * 30);

		parameter = {direction:"chocolate", ascensorMap: [[R1,R2],[R3,R4],[R5,R6]]};
		fixture.ascensor(parameter);
		fixture.children("div").each(function(index, elements){
			expect(elements).toHaveCss({position: "absolute"});
			expect(elements).toHaveCss({left: parameter.ascensorMap[index][1]*$(window).width()+"px"});
			expect(elements).toHaveCss({top: parameter.ascensorMap[index][0]*$(window).height()+"px"});
		});
	});


});