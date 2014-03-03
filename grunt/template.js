module.exports = function(grunt) {
  return {
    simple: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_simple.html',
      variables: {
        title: 'Simple',
        params: ''
      }
    },

    horizontal: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_horizontal.html',
      variables: {
        title: 'Horizontal',
        params: '{direction:"x"}'
      }
    },

    chocolat: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat.html',
      variables: {
        title: 'Chocolat',
        params: '{direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    urlcontrole: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_url.html',
      variables: {
        title: 'Chocolat',
        params: '{ascensorFloorName:["Home", "Implementation", "HTML" , "Jquery" , "CSS", "Smartphone", "End", "Yaaay"], direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    queued: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_queued.html',
      variables: {
        title: 'Chocolat',
        params: '{direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]], queued:"x"}'
      }
    },

    swipe: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_swipe.html',
      variables: {
        title: 'Chocolat',
        params: '{direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]], swipeNavigation:true}'
      }
    },

    loop: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_loop.html',
      variables: {
        title: 'Chocolat',
        params: '{loop: true, direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    loop_x: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_loop_x.html',
      variables: {
        title: 'Chocolat',
        params: '{loop: "loop-x", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    loop_y: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_loop_y.html',
      variables: {
        title: 'Chocolat',
        params: '{loop: "loop-y", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    increment: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_loop_increment.html',
      variables: {
        title: 'Chocolat',
        params: '{loop: "increment", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    increment_y: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_loop_increment-y.html',
      variables: {
        title: 'Chocolat',
        params: '{loop: "increment-y", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    increment_x: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_loop_increment-x.html',
      variables: {
        title: 'Chocolat',
        params: '{loop: "increment-x", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
      }
    },

    jump: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_chocolat_jump.html',
      variables: {
        title: 'Chocolat',
        params: '{jump: true, direction: [[0,0],[0,2],[0,4],[2,4],[4,4],[6,7],[1,9],[1,5]]}'
      }
    },

    custom_size: {
      src: 'examples/example_layout.ejs',
      dest: 'examples/example_custom_size.html',
      variables: {
        title: 'Custom size',
        params: '{height: "80%", width: "400px"}'
      }
    }
  };
};