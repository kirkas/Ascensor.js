describe("Triggers", function() {
  
  var defaultTime = 300;
  var $fixture;
  var ascensor;	
  var scrollEndSpy;
  var scrollStartSpy;
  
  beforeEach(function() {
    loadFixtures("ascensor.html");
    $fixture = $("#ascensorBuilding");
    ascensor = $fixture.ascensor();
  });
  
  afterEach(function() {
    $fixture = "";
    ascensor = "";
    scrollEndSpy = "";
    sscrollStartSpy = "";
  });
  
  describe("Plugins triggers", function(){
    it("scrollStart", function(){
      runs(function() { 
        scrollStartSpy = spyOnEvent(ascensor, "scrollStart");
        ascensor.trigger("next");
        expect(scrollStartSpy).toHaveBeenTriggered();
      }); 
    });
    
    it("scrollEnd", function(){
      runs(function() { 
        scrollEndSpy = spyOnEvent(ascensor, "scrollEnd"); 
        ascensor.trigger("next");
      }); 
      waits(defaultTime);
      runs(function(){
        expect(scrollEndSpy).toHaveBeenTriggered();
      })	
    });
  });
    
  describe("Users triggers", function(){
    it("scrollToDirection", function(){
      ascensor.on("scrollStart", function(event, floor){
        expect(floor.from).toBe(0);
        expect(floor.to).toBe(1);
      });
      
      ascensor.trigger("scrollToDirection", "down");
    });
    it("scrollToStage", function(){
      ascensor.on("scrollStart", function(event, floor){
        expect(floor.from).toBe(0);
        expect(floor.to).toBe(2);
      });
      
      ascensor.trigger("scrollToStage", 2);
    });
    it("next", function(){
      ascensor.on("scrollStart", function(event, floor){
        expect(floor.from).toBe(0);
        expect(floor.to).toBe(1);
      });
      
      ascensor.trigger("next");
    });
    it("prev", function(){
      ascensor.on("scrollStart", function(event, floor){
        expect(floor.from).toBe(0);
        expect(floor.to).toBe(2);
      });
      
      ascensor.trigger("prev");
    });
  });
  
  describe("Refresh on dom change", function(){
    it("append element", function(){
      refreshSpy = spyOnEvent(ascensor, "refresh");
      ascensor.append("<div></div>");
      expect(refreshSpy).toHaveBeenTriggered();
    });
    
    // it("remove element", function(){
    //   refreshSpy = spyOnEvent(ascensor, "refresh");
    //   ascensor.find("div:first-child").remove();
    //   expect(refreshSpy).toHaveBeenTriggered();
    // });
    
  });
  
});