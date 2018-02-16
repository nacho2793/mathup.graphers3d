import Geometry3D from 'grapher3d/geometry3d';

const render = function(params){
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

export default render;
