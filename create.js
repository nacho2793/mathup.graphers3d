let JSON = {
  render: {
    element: 'canvas',
    width: 600,
    height: 600,
    axis: {
    	x:4,
    	y:4,
    	z:4,
    	separation: 1,
    	numbers: false
    },
    backColor: "white"
  },
  type: '3D',
  functions: {
    sphere: [
      {
        radius: 0.7,
        resolution: 20,
        color: "blue",
        position: [0,2,0]
      }
    ],
    box: [
      {
        width: 1,
        height: 1,
        depth: 1,
        position: [3,0,0],
        color: "purple"
      }
    ],
    equation2d: [
      {
        equation: 'x^2',
        initX: 0,
        finalX: 1,
        step: 2, 
        color: "red"
      }
    ],
    equation3d: [
      {
        equation: 'sin(2y)*cos(2x)+1',
        initX: -2,
        finalX: 2,
        initY: -2,
        finalY: 2,
        step: 3, 
        color: "red"
      }
    ],
    plane:{
    	geo: [
	      {
	        width: 4,
	        height: 4,
	        position:[0,0,0],
	        rotation: [0,90,0],
	        color: "orange"
	      },
	      {
	        width: 4,
	        height: 4,
	        position:[0,0,0],
	        rotation: [90,0,0],
	        color: "orange"
	      },
	      {
	        width: 4,
	        height: 4,
	        position:[0,0,0],
	        rotation: [0,0,90],
	        color: "orange"
	      }
	    ],
	    intersect: [
	    	[0, 1, 2]
	    ]
    }
  }
};

var render = function(params){
	var render = params.render;
	var DOM = new Geometry3D(render.element, render.width, render.height, render.backColor);
	if(render.axis){
		var axis = render.axis;
		DOM.axis(axis.x,axis.y,axis.z,axis.separation,axis.numbers);
	}
	var methods = params.functions;
	if(methods.sphere){
		for(var i = 0; i<methods.sphere.length; i++){
			var data = methods.sphere[i];
			var sphere = DOM.createSphere(data.radius, data.resolution, data.color);
			DOM.move(sphere, {translate:data.position});
		}
	}
	if(methods.box){
		for(var i = 0; i<methods.box.length; i++){
			var data = methods.box[i];
			var box = DOM.createBox(data.width, data.height, data.depth, data.color);
			DOM.move(box, {translate:data.position});
		}
	}
	if(methods.equation2d){
		for(var i = 0; i<methods.equation2d.length; i++){
			var data = methods.equation2d[i];
			var equation2d = DOM.create2Dfunction(data.equation, data.initX, data.finalX, data.step, data.color);
			DOM.move(equation2d, {translate:data.position});
		}
	}
	if(methods.equation3d){
		for(var i = 0; i<methods.equation3d.length; i++){
			var data = methods.equation3d[i];
			var equation3d = DOM.create3Dfunction(data.equation, data.initX, data.finalX, data.initY, data.finalY, data.step, data.color);
			DOM.move(equation3d, {rotate:[90, 0, 0]});
			DOM.move(equation3d, {translate:[0,data.finalY/2,0]});
			DOM.move(equation3d, {translate:data.position});
		}
	}
	if(methods.plane){
		var planes = [];
		var intersects = [];
		for(var i = 0; i<methods.plane.geo.length; i++){
			var data = methods.plane.geo[i];
			planes.push(DOM.createPlane(data.width, data.height, true, data.color));
			DOM.move(planes[i], {translate:data.position, rotate:data.rotation});
		}
		if(methods.plane.intersect){
			for(var i=0; i<methods.plane.intersect.length; i++){
				var nPlane = methods.plane.intersect[i];
				if(nPlane.length == 2){
					DOM.intersection(planes[nPlane[0]], planes[nPlane[1]]);
				}else if (nPlane.length == 3) {
					DOM.intersection(planes[nPlane[0]], planes[nPlane[1]], planes[nPlane[2]]);
				}
			}
		}
	}

	function animate() {
	  requestAnimationFrame( animate );           
	  DOM.controls.update(); 
	  DOM.render();
	}
	animate();
}

render(JSON);

/*
var geometry = new Geometry3D('canvas', 400, 400, 0xffffff);
var geo3d = new Geometry3D('other', 400, 400, 0xffffff);

geometry.axis(4,4,4, 1, false);
var sphere = geometry.createSphere(0.7, 20, 'purple');
var box = geometry.createBox(1,1,1, 'green');
var equation = geometry.create3Dfunction('sin(y)*cos(x)+1', -4, 4, -4, 4,2, 'orange');
var equation = geometry.create2Dfunction('3x^2-6x', 1, 2, 2, 'red');
geometry.move(box, {translate:[1.4,0,0]});
box_verts = geometry.returnVerts(box);
geometry.drawDimensions([box_verts[0], box_verts[1], box_verts[4]], 0.1, 0);

var sphere2 = geo3d.createSphere(0.7, 20, 'red');
var regular = geo3d.createRegular(6, 0.7, 1, 'blue', false, true, true);
var plane1 = geo3d.createPlane(4, 4, true);
var plane2 = geo3d.createPlane(4, 4, true);
var plane3 = geo3d.createPlane(4, 4, true);
geo3d.move(plane2, {rotate:[0, 45, 0], translate:[-1,0,0]});
geo3d.move(plane3, {rotate:[90, 0, 0], translate:[-1,0,0]});
geo3d.intersection(plane1, plane2, plane3);

geo3d.axis(10,10,10, 1,true, 1);
geo3d.move(regular, {translate:[-1.6, 0, 0]})

function animate() {
  requestAnimationFrame( animate );           
  geometry.controls.update(); 
  geometry.render();
}
function animate2() {
  requestAnimationFrame( animate2 );           
  geo3d.controls.update(); 
  geo3d.render();
}

animate();
animate2();
*/