import '!script-loader!grapher3d/javascript/nerdamer-master/nerdamer.core';
import '!script-loader!grapher3d/javascript/nerdamer-master/Algebra';
import '!script-loader!grapher3d/javascript/nerdamer-master/Calculus';
import '!script-loader!grapher3d/javascript/nerdamer-master/Solve';
import '!script-loader!grapher3d/javascript/nerdamer-master/Extra';
import '!script-loader!grapher3d/javascript/three';
import '!script-loader!grapher3d/javascript/controls/TrackballControls';

var Geometry3D = function(id, width, height, backColor){
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 75,width / height, 0.1, 1000 );
	//renderer.setSize( window.innerWidth, window.innerHeight);
	let numbers = [];

	const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	renderer.setSize( width, height);
	const container = document.getElementById( id );
	document.body.appendChild( container );

	renderer.setClearColor(backColor);
	container.appendChild( renderer.domElement );

	/*Controls*/
	const controls = new THREE.TrackballControls( camera, renderer.domElement );
	/*Lights*/
	var light = new THREE.AmbientLight( 0xffffff, 0.4 ); // soft white light
	  light.position.set(0,20,0)
	  scene.add( light );
	var light2 = new THREE.PointLight( 0xffffff, 0.5 ); // soft white light
	  light2.position.set(10,15,0)
	  scene.add( light2 );
	var loader = new THREE.FontLoader();
	camera.position.z = 5;
	function render() {
	  renderer.render(scene, camera);
	}
	function animate() {
	  requestAnimationFrame( animate );
	  controls.update();
	  render();
	}
	/*CREATE FUNCTIONS*/
	function sphere(radius, res, color){
	  if(color===undefined){
	    color=0xa0a000;
	  }
	    var geometry;
	    geometry = new THREE.SphereGeometry( radius, res, res );
	    var material = new THREE.MeshLambertMaterial( {color: color} );
	    material.side = THREE.DoubleSide;
	    var sphere = new THREE.Mesh( geometry, material );
	    if(render){
	      scene.add( sphere );
	    }
	    return sphere;
	}
	function box(width, height, depth, color=0xc3edf7, transparent=false){
	    var geometry = new THREE.BoxGeometry(width, height, depth);
	    if(transparent){
	        var material = new THREE.MeshLambertMaterial( {color: color,  transparent: transparent, opacity: 0.7} );
	    }else{
	        var material = new THREE.MeshLambertMaterial( {color: color} );
	    }
	    var cube = new THREE.Mesh( geometry, material );
	    scene.add( cube );
	    if(transparent){
	        var edges = new THREE.EdgesGeometry( geometry );
	        var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
	        scene.add( line );
	        return [cube, line];
	    }
	    return cube;
	}
	function plane(width, height, render, color){
	  var geometry = new THREE.PlaneGeometry( width, height, 1 );
	  var material = new THREE.MeshLambertMaterial( {color: color, side: THREE.DoubleSide} );
	  var plane = new THREE.Mesh( geometry, material );
	  if(render){
	    scene.add( plane );
	  }
	  return plane;
	}
	function extrudeRegular(sides, radius, height, color, transparent, cover, render){
	  if(height===undefined){
	    height=2;
	  }
	  if(cover===undefined){
	    cover=true;
	  }
	  if(color===undefined){
	    color = 0xc3edf7;
	  }
	  if(transparent===undefined){
	    transparent=false;
	  }
	  if(radius===undefined){
	    radius=2;
	  }
	    var geometry = new THREE.CylinderGeometry( radius, radius, height, sides, 1, !cover );
	    if(!transparent){
	      var material = new THREE.MeshBasicMaterial( {color: color} );
	    }else{
	      var material = new THREE.MeshBasicMaterial( {color: color, transparent: transparent, opacity: 0.7} );
	    }
	    material.side = THREE.DoubleSide;
	    var cylinder = new THREE.Mesh( geometry, material );
	    if(render){
	      scene.add( cylinder );
	    }
	    var edges = new THREE.EdgesGeometry( geometry );
	    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
	    if(render){
	      scene.add( line );
	    }
	    return [cylinder, line];
	}
	function function2d(equation, minX, maxX, res, color, under, closed, transparent, render){
	  if(under===undefined){
	    under=false;
	  }
	  if(closed === undefined){
	    closed = false
	  }
	  if(color === undefined){
	    color = 0xc3edf7;
	  }
	  if(transparent === undefined){
	    transparent = false;
	  }
	  if(res===undefined){
	    res = 0;
	  }
	  if(render===undefined){
	    render = true;
	  }
	  res = Math.floor(res);
	  var step = Math.pow(2,-res);
	  var points = [];
	  var extras = [];
	  var y;
	  for ( var i = minX; i <= maxX; i += step ) {
	    i=parseFloat(i.toFixed(4));
	    if(i===0){
	      i=0.0001;
	      y = implicit(equation, i);
	      i=0;
	    }else{
	      y = implicit(equation, i);
	    }
	    if(typeof y === 'object'){
	      for(var j=0; j<y.length;j++){
	        if(j===0){
	          points.push( new THREE.Vector2( i, y[0]));
	        }else{
	          if(typeof extras[j]==='object'){
	            extras[j].push( new THREE.Vector2( i, parseFloat(y[j])));
	          }else{
	            extras[j]= [new THREE.Vector2( i, parseFloat(y[j]))];
	          }
	        }
	      }
	    }else{
	      points.push( new THREE.Vector2( i, parseFloat(y)));
	    }
	  }
	  if(extras.length>1){
	      for(var i = 0; i<extras.length;i++){
	          if(typeof extras[i]=== 'object'){
	              for(var j = extras[i].length; j>=0; j--){
	                  var point = extras[i][j];
	                  if(point!==undefined){
	                      points.push(point);
	                  }
	              }
	          }
	      }
	  }
	  if(closed){
	      points.push(points[0]);
	  }
	  var geometry = new THREE.LatheGeometry( points, 50 );
	  var material = new THREE.MeshLambertMaterial({ color: color,  transparent: transparent, opacity: 0.7 });
	  material.side = THREE.DoubleSide;
	  var lathe = new THREE.Mesh( geometry, material );
	  if(render){
	    scene.add( lathe );
	  }
	  if(under){
	    y = implicit(equation, maxX);
	    var geometry = new THREE.CylinderGeometry( maxX, maxX, y, 32, 2, true );
	    var material = new THREE.MeshLambertMaterial( {color: 0x842c1d, transparent: true, opacity: 0.7} );
	    material.side = THREE.DoubleSide;
	    var cylinder = new THREE.Mesh( geometry, material );
	    if(render){
	      scene.add( cylinder );
	    }
	    cylinder.position.y+=y/2;
	    if(minX!==0){
	      y = implicit(equation, minX);
	      var geometry = new THREE.CylinderGeometry( minX, minX, y, 32, 2, true );
	      var material = new THREE.MeshLambertMaterial( {color: 0x842c1d, transparent: true, opacity: 0.7} );
	      material.side = THREE.DoubleSide;
	      var cylinder2 = new THREE.Mesh( geometry, material );
	      if(render){
	        scene.add( cylinder2 );
	      }
	      cylinder2.position.y+=y/2;
	      return [lathe, cylinder, cylinder2];
	    }
	    return [lathe, cylinder];
	  }
	  return lathe;
	}
	function function3d(equation, minX, maxX, minY, maxY, res, color, render){
	  if(res===undefined){
	    res = 0;
	  }
	  if(render===undefined){
	  	render=true;
	  }
	  res = Math.floor(res);
	  var step = Math.pow(2,-res);
	  var geometry = new THREE.Geometry();
	  var verts = [];
	  for(var i=minX;i<=maxX;i+=step){
	    for(var j=minY;j<=maxY;j+=step){
	      var k = nerdamer(equation,{x:i, y:j}).evaluate();
	      if((k.text().indexOf('i')<0)){
	        //console.log(k.text());
	        geometry.vertices.push(new THREE.Vector3( i, j, parseFloat(k.text())));
	        verts.push(i,j,parseFloat(k.text()));
	      }else{
	        geometry.vertices.push(new THREE.Vector3( i, j, 0));
	        verts.push(i,j,parseFloat(k.text()));

	      }
	    }
	  }
	  var linePoints = 1+(maxY-minY)/step;
	  for(var i=0; i<geometry.vertices.length-linePoints-1;i++){
	    if((i+1)%(linePoints)!==0){
	      geometry.faces.push( new THREE.Face3( i, i+1, i+linePoints) );
	      geometry.faces.push( new THREE.Face3(i+1, i+linePoints+1, i+linePoints) );
	    }
	  }
	  geometry.computeBoundingBox();
	  geometry.computeFaceNormals();
	  geometry.computeVertexNormals();
	  var material = new THREE.MeshLambertMaterial( {color: color} );
	  material.side = THREE.DoubleSide;
	  var polyMesh = new THREE.Mesh( geometry, material );
	  if(render){
	    scene.add( polyMesh );
	  }
	  //polyMesh.geometry.rotateX(Math.PI/2);
	  //polyMesh.geometry.rotateY(Math.PI/2);
	  return polyMesh;
	}
	/*!!!!NOT WORKING!!!*/
	function parametric3d(fx, fy, fz, min, max, res, color, render){
	  if(color===undefined){
	    color=0xa0a000;
	  }
	  if(res===undefined){
	    res = 0;
	  }
	  res = Math.floor(res);
	  var step = Math.pow(2,-res);
	    var geometry = new THREE.Geometry();
	    for(var i=min;i<=max;i+=step){
	      if(i===0){
	        i=0.00001;
	        geometry.vertices.push(new THREE.Vector3( implicit(fx, i),  implicit(fy, i), implicit(fz, i) ));
	        i=0;
	      }else{
	        geometry.vertices.push(new THREE.Vector3( implicit(fx, i),  implicit(fy, i), implicit(fz, i) ));
	      }
	    }
	    var material = new THREE.LineBasicMaterial( {
	        color: 0x000000,
	        linewidth: 200000
	    } );
	    var line = new THREE.Line(geometry, material);
	    if(render){
	      scene.add( line );
	    }
	    return line;
	}


	/*OTHER FUNCTIONS*/
	function move(geoms, movement){
	  if(movement.rotate){
	    if(geoms.length !== undefined){
	      for(var i=0;i<geoms.length;i++){
	        geoms[i].geometry.rotateX(movement.rotate[0]*Math.PI / 180);
	        geoms[i].geometry.rotateY(movement.rotate[1]*Math.PI / 180);
	        geoms[i].geometry.rotateZ(movement.rotate[2]*Math.PI / 180);
	      }
	    }else{
	      geoms.geometry.rotateX(movement.rotate[0]*Math.PI / 180);
	      geoms.geometry.rotateY(movement.rotate[1]*Math.PI / 180);
	      geoms.geometry.rotateZ(movement.rotate[2]*Math.PI / 180);
	    }
	  }
	  if(movement.translate){
	    if(geoms.length !== undefined){
	      for(var i=0;i<geoms.length;i++){
	        if(geoms[i].geometry.vertices){
	          for(var j=0;j<geoms[i].geometry.vertices.length;j++){
	            geoms[i].geometry.vertices[j].x+=movement.translate[0];
	            geoms[i].geometry.vertices[j].y+=movement.translate[1];
	            geoms[i].geometry.vertices[j].z+=movement.translate[2];
	          }
	        }else{
	          geoms[i].translateX(movement.translate[0]);
	          geoms[i].translateY(movement.translate[1]);
	          geoms[i].translateZ(movement.translate[2]);
	        }

	      }
	    }else{
	      if(geoms.geometry.vertices){
	        for(var j=0;j<geoms.geometry.vertices.length;j++){
	          geoms.geometry.vertices[j].x+=movement.translate[0];
	          geoms.geometry.vertices[j].y+=movement.translate[1];
	          geoms.geometry.vertices[j].z+=movement.translate[2];
	        }
	      }else{
	        geoms.translateX(movement.translate[0]);
	        geoms.translateY(movement.translate[1]);
	        geoms.translateZ(movement.translate[2]);
	      }
	    }
	  }
	}
	function createAxis(x,y,z, spacing=1, text=false, thickness=1){
	  x*=2;
	  y*=2;
	  z*=2;
	  var geometry;
	  var font;
	  //Materials
	  var red = new THREE.MeshBasicMaterial({color:0xff0000});
	  var blue = new THREE.MeshBasicMaterial({color:0x0000ff});
	  var green = new THREE.MeshBasicMaterial({color:0x00ff00});
	  //X
	  geometry = new THREE.ConeGeometry(0.05*thickness, 0.2*thickness, 20);
	  var xArrow = new THREE.Mesh(geometry, red);
	  geometry = new THREE.CylinderGeometry(0.01*thickness, 0.01*thickness, x);
	  var xAxis = new THREE.Mesh(geometry, red);
	  xArrow.position.x += x/2;
	  xAxis.rotation.z=Math.PI/2;
	  xArrow.rotation.z=-Math.PI/2
	  scene.add(xArrow);
	  scene.add(xAxis);
	  if(x>1){
	    for(var i=spacing;i<x/2;i+=spacing){
	      geometry = new THREE.CylinderGeometry(0.05*thickness, 0.05*thickness, 0.02*thickness);
	      var divisionX = new THREE.Mesh(geometry, red);
	      divisionX.rotation.z = Math.PI/2;
	      divisionX.position.x = (i)
	      scene.add(divisionX);
	    }
	    for(var i=0;i<x/2;i+=spacing){
	      geometry = new THREE.CylinderGeometry(0.05*thickness, 0.05*thickness, 0.02*thickness);
	      var divisionX = new THREE.Mesh(geometry, red);
	      divisionX.rotation.z = Math.PI/2;
	      divisionX.position.x = -(i+spacing)
	      scene.add(divisionX);
	    }
	  }
	  //Y
	  geometry = new THREE.ConeGeometry(0.05*thickness, 0.2*thickness, 20);
	  var yArrow = new THREE.Mesh(geometry, blue);
	  geometry = new THREE.CylinderGeometry(0.01*thickness, 0.01*thickness, y);
	  var yAxis = new THREE.Mesh(geometry, blue);
	  yArrow.position.y += y/2;
	  scene.add(yArrow);
	  scene.add(yAxis);
	  if(y>1){
	    for(var i=spacing;i<y/2;i+=spacing){
	      geometry = new THREE.CylinderGeometry(0.05*thickness, 0.05*thickness, 0.02*thickness);
	      var divisionY = new THREE.Mesh(geometry, blue);
	      divisionY.position.y = i
	      scene.add(divisionY);
	    }
	    for(var i=0;i<y/2;i+=spacing){
	      geometry = new THREE.CylinderGeometry(0.05*thickness, 0.05*thickness, 0.02*thickness);
	      var divisionY = new THREE.Mesh(geometry, blue);
	      divisionY.position.y = -(i+spacing)
	      scene.add(divisionY);
	    }
	  }
	  //Z
	  geometry = new THREE.ConeGeometry(0.05*thickness, 0.2*thickness, 20);
	  var zArrow = new THREE.Mesh(geometry, green);
	  geometry = new THREE.CylinderGeometry(0.01*thickness, 0.01*thickness, z);
	  var zAxis = new THREE.Mesh(geometry, green);
	  zArrow.position.z += z/2;
	  zArrow.rotation.x += Math.PI/2;
	  zAxis.rotation.x += -Math.PI/2;
	  scene.add(zArrow);
	  scene.add(zAxis);
	  if(z>1){
	    for(var i=spacing;i<z/2;i+=spacing){
	      geometry = new THREE.CylinderGeometry(0.05*thickness, 0.05*thickness, 0.02*thickness);
	      var divisionZ = new THREE.Mesh(geometry, green);
	      divisionZ.position.z = i
	      divisionZ.rotation.x = Math.PI/2
	      scene.add(divisionZ);
	    }
	    for(var i=0;i<z/2;i+=spacing){
	      geometry = new THREE.CylinderGeometry(0.05*thickness, 0.05*thickness, 0.02*thickness);
	      var divisionZ = new THREE.Mesh(geometry, green);
	      divisionZ.position.z = -(i+spacing)
	      divisionZ.rotation.x = Math.PI/2
	      scene.add(divisionZ);
	    }
	  }
	  if(text){
	    addNumbers(x,y,z, spacing);
	  }
	}
	function addNumbers(x, y, z, spacing){
    loader.load( './javascript/fonts/helvetiker_regular.typeface.json', function ( font ) {
      var geometry;
      var red = new THREE.MeshBasicMaterial({color:0x000000});
      var blue = new THREE.MeshBasicMaterial({color:0x000000});
      var green = new THREE.MeshBasicMaterial({color:0x000000});
      numbers = [];
      if(x>1){
        for(var i=spacing;i<x/2;i+=spacing){
          geometry = new THREE.TextGeometry( i, {
              font: font,
              size: .3,
              height: 0.01
          } );
          var edges = new THREE.EdgesGeometry( geometry );
          var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
          scene.add( line );
          var divisionX = new THREE.Mesh(geometry, red);
          divisionX.position.x = (i)
          line.position.x = (i)
          divisionX.position.y = 0.05;
          line.position.y = 0.05;
          scene.add(divisionX);
          numbers.push(divisionX);
          numbers.push(line);
        }
        for(var i=0;i<x/2;i+=spacing){
          geometry = new THREE.TextGeometry( '-'+(i+2), {
              font: font,
              size: .3,
              height: 0.01
          } );
          var edges = new THREE.EdgesGeometry( geometry );
          var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
          scene.add( line );
          var divisionX = new THREE.Mesh(geometry, red);
          divisionX.position.x = -(i+spacing)
          divisionX.position.y = 0.05;
          line.position.x = -(i+spacing)
          line.position.y = 0.05;
          scene.add(divisionX);
          numbers.push(divisionX);
          numbers.push(line);
        }
      }
      if(y>1){
        for(var i=spacing;i<y/2;i+=spacing){
          geometry = new THREE.TextGeometry( i, {
              font: font,
              size: .3,
              height: 0.01
          } );
          var divisionX = new THREE.Mesh(geometry, blue);
          var edges = new THREE.EdgesGeometry( geometry );
          var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
          scene.add( line );
          divisionX.position.y = (i)
          divisionX.position.y += 0.05;
          line.position.y = (i)
          line.position.y += 0.05;
          scene.add(divisionX);
          numbers.push(divisionX);
          numbers.push(line);
        }
        for(var i=0;i<y/2;i+=spacing){
          geometry = new THREE.TextGeometry( '-'+(i+2), {
              font: font,
              size: .3,
              height: 0.01
          } );
          var divisionX = new THREE.Mesh(geometry, blue);
          var edges = new THREE.EdgesGeometry( geometry );
          var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
          scene.add( line );
          divisionX.position.y = -(i+spacing)
          divisionX.position.y += 0.05;
          line.position.y = -(i+spacing)
          line.position.y += 0.05;
          scene.add(divisionX);
          numbers.push(divisionX);
          numbers.push(line);
        }
      }
      if(z>1){
        for(var i=spacing;i<z/2;i+=spacing){
          geometry = new THREE.TextGeometry( i, {
              font: font,
              size: .3,
              height: 0.01
          } );
          var divisionX = new THREE.Mesh(geometry, green);
          var edges = new THREE.EdgesGeometry( geometry );
          var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
          scene.add( line );
          divisionX.position.z = (i)
          divisionX.position.y += 0.05;
          line.position.z = (i)
          line.position.y += 0.05;
          scene.add(divisionX);
          numbers.push(divisionX);
          numbers.push(line);
        }
        for(var i=0;i<z/2;i+=spacing){
          geometry = new THREE.TextGeometry( '-'+(i+2), {
              font: font,
              size: .3,
              height: 0.01
          } );
          var divisionX = new THREE.Mesh(geometry, green);
          var edges = new THREE.EdgesGeometry( geometry );
          var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
          scene.add( line );
          divisionX.position.z = -(i+spacing)
          divisionX.position.y += 0.05;
          line.position.z = -(i+spacing)
          line.position.y += 0.05;
          scene.add(divisionX);
          numbers.push(divisionX);
          numbers.push(line);
        }
      }
    } );
	}
	function implicit(equation, x){
    var result = nerdamer(equation,{x:x}).evaluate();
    result = result.text();
    if(result.indexOf('y')>=0){
      var solutions = nerdamer(result).solveFor('y');
      for(var i=0; i<solutions.length; i++){
        solutions[i] = solutions[i].evaluate();
        solutions[i] = solutions[i].text();
      }
      return solutions;
    }else{
      return result;
    }
	}
	function drawPlaneIntersection(pl1, pl2, pl3){
	  if(pl1!==undefined && pl2!==undefined && pl3===undefined){
	    var line = [];
	    var points = [];
	    var p1, p2, p3;
	    var q1= new THREE.Geometry(), q2= new THREE.Geometry(), q3= new THREE.Geometry(), q4= new THREE.Geometry();
	    var v1, v2, origin, ref;
	    var cross;
	    var helper = new THREE.Geometry();
	    var planeDist;
	    p1 = pl1.geometry.vertices[0];
	    p2 = pl1.geometry.vertices[1];
	    p3 = pl1.geometry.vertices[2];
	    origin = new THREE.Vector3(0,0,0);
	    v1 = new THREE.Vector3(p2.x-p1.x, p2.y-p1.y, p2.z-p1.z);
	    v2 = new THREE.Vector3(p3.x-p1.x, p3.y-p1.y, p3.z-p1.z);
	    cross = new THREE.Vector3(v1.y*v2.z-v1.z*v2.y, v1.z*v2.x-v1.x*v2.z, v1.x*v2.y-v1.y*v2.x).normalize();
	    cross.x = parseFloat(cross.x.toFixed(2));
	    cross.y = parseFloat(cross.y.toFixed(2));
	    cross.z = parseFloat(cross.z.toFixed(2));
	    ref = new THREE.Vector3(0,0,0);
	    ref.x = (pl1.geometry.vertices[0].x+pl1.geometry.vertices[3].x)/2;
	    ref.y = (pl1.geometry.vertices[0].y+pl1.geometry.vertices[3].y)/2;
	    ref.z = (pl1.geometry.vertices[0].z+pl1.geometry.vertices[3].z)/2;
	    helper.vertices.push(ref.clone());

	    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
	    var line = new THREE.Line(helper, lineMaterial);
	    scene.add(line);
	    line[0] = new THREE.Line3(pl2.geometry.vertices[0], pl2.geometry.vertices[1]);
	    line[1] = new THREE.Line3(pl2.geometry.vertices[0], pl2.geometry.vertices[2]);
	    line[2] = new THREE.Line3(pl2.geometry.vertices[1], pl2.geometry.vertices[3]);
	    line[3] = new THREE.Line3(pl2.geometry.vertices[2], pl2.geometry.vertices[3]);
	    var normal = new THREE.Line3(ref.clone(), new THREE.Vector3(helper.vertices[0].x-cross.x*100, helper.vertices[0].y-cross.y*100, helper.vertices[0].z-cross.z*100));
	    var planeRef = new THREE.Plane( cross );
	    planeDist = planeRef.intersectLine(normal);
	    planeDist = ref.distanceTo(planeDist);
	    planeRef = new THREE.Plane( cross, -planeDist );
	    for(var i=0;i<4;i++){
	      //line = new THREE.Line3(new THREE.Vector3(0,0,4), new THREE.Vector3(0,0,-4));
	      var intersect = planeRef.intersectLine(line[i]);
	      if(intersect){
	        points.push(intersect);
	      }
	    }

	    if(points.length>=2){
	      /*Plane2 Line*/
	      var dist = points[0].distanceTo(points[1]);
	      var geometry = new THREE.CylinderGeometry( 0.02, 0.02, dist, 16 );
	      var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
	      var cylinder = new THREE.Mesh( geometry, material );
	      scene.add( cylinder );
	      var vector = new THREE.Vector3(points[1].x-points[0].x,points[1].y-points[0].y,points[1].z-points[0].z);
	      var axis = new THREE.Vector3(0, 1, 0);
	      cylinder.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,dist/2, 0));
	      cylinder.position.x=points[0].x;
	      cylinder.position.y=points[0].y;
	      cylinder.position.z=points[0].z;
	      cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
	      return points;
	    }
	  }else if(pl1!==undefined && pl2!==undefined && pl3!==undefined){

	  }else{

	  }
	}
	function planeIntersection(pl1, pl2, pl3){
	  if(pl3){
	    try{
	      drawPlaneIntersection(pl2, pl1);
	    }catch(err) {}
	    try{
	      drawPlaneIntersection(pl1, pl2);
	    }catch(err) {}
	    try{
	      drawPlaneIntersection(pl2, pl3);
	    }catch(err) {}
	    try{
	      drawPlaneIntersection(pl3, pl2);
	    }catch(err) {}
	    try{
	      drawPlaneIntersection(pl1, pl3);
	    }catch(err) {}
	    try{
	      drawPlaneIntersection(pl3, pl1);
	    }catch(err) {}
	  }else{
	    try{
	      drawPlaneIntersection(pl1, pl2);
	    }catch(err) {}
	    try{
	      drawPlaneIntersection(pl2, pl1);
	    }catch(err) {}

	  }
	}
	function returnVerts(mesh){
	  if(mesh.geometry){
	    return mesh.geometry.vertices;
	  }else if(mesh.vertices){
	    return mesh.vertices
	  }else{
	    console.log('Not vertices found');
	  }
	}
	function drawDimensions(verts, offset, offsetY=0){
	  var dimLoader = new THREE.FontLoader();
	  for(var i=0;i<verts.length;i++){
	    if(verts[i].length===2){
	      var points = verts[i];
	      verts[i]= new THREE.Vector3((points[0].x+points[1].x)/2,(points[0].y+points[1].y)/2,(points[0].z+points[1].z)/2);
	    }
	  }
	  var dist;
	  dimLoader.load( './javascript/fonts/helvetiker_regular.typeface.json', function ( font ) {
	    /*PODER MOSTRAR LAS DIMENSIONES DEL TEXTO*/
	    if(verts.length==2){
	      for(var i=0; i<1;i++){
	        dist = distance(verts[i], verts[i+1]);
	        var textGeo = new THREE.TextGeometry( dist.toFixed(2), {
	          font: font,
	          size: 0.2,
	          height: 0.03
	        } );
	        var geometry = new THREE.CylinderGeometry( 0.015, 0.015, dist, 16 );
	        var geometry2 = new THREE.CylinderGeometry( 0.03, 0.03, 0.02, 16 );
	        var geometry3 = new THREE.CylinderGeometry( 0.04, 0.04, 0.01, 16 );
	        var material = new THREE.MeshBasicMaterial( {color: 0x5d5f60} );
	        var textMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
	        /*Mesh*/
	        var cylinder = new THREE.Mesh( geometry, material );
	        var top1     = new THREE.Mesh( geometry2, material );
	        var top2     = new THREE.Mesh( geometry3, material );
	        var textMesh = new THREE.Mesh( textGeo, textMaterial);

	        /*Scene*/
	        numbers.push(textMesh);
	        scene.add( textMesh );
	        scene.add( cylinder );
	        scene.add( top1 );
	        scene.add( top2 );
	        /*Move to p1 position*/
	        cylinder.position.x=verts[i].x;
	        cylinder.position.y=verts[i].y;
	        cylinder.position.z=verts[i].z;

	        textMesh.position.x=(verts[i].x+verts[i+1].x)/2;
	        textMesh.position.y=(verts[i].y+verts[i+1].y)/2;
	        textMesh.position.z=(verts[i].z+verts[i+1].z)/2;

	        top1.position.x=verts[i].x;
	        top1.position.y=verts[i].y;
	        top1.position.z=verts[i].z;

	        top2.position.x=verts[i].x;
	        top2.position.y=verts[i].y;
	        top2.position.z=verts[i].z;
	        /*Relative move*/
	        cylinder.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,dist/2, 0));
	        top2.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,dist, 0));
	        /*Offset move*/
	        var point = {x:verts[i+1].x, y:verts[i+1].z};
	        var center = {x:verts[i].x, y:verts[i].z};
	        var point2 = rotateLine(center, point, 90);
	        var uVec = unitVector(center, point2);
	        point = {x:verts[i+1].x, y:verts[i+1].y};
	        center = {x:verts[i].x, y:verts[i].y};
	        point2 = rotateLine(center, point, 90);
	        var uVec2 = unitVector(center, point2);
	        cylinder.position.x-=uVec.x*offset;
	        cylinder.position.y+=uVec2.y*offsetY;
	        cylinder.position.z-=uVec.y*offset;

	        top1.position.x-=uVec.x*offset;
	        top1.position.y+=uVec2.y*offsetY;
	        top1.position.z-=uVec.y*offset;

	        top2.position.x-=uVec.x*offset;
	        top2.position.y+=uVec2.y*offsetY;
	        top2.position.z-=uVec.y*offset;

	        textMesh.position.x-=uVec.x*offset+0.3;
	        textMesh.position.y+=uVec2.y*offsetY+0.1;
	        textMesh.position.z-=uVec.y*offset;
	        /*Rotation*/
	        var vector = new THREE.Vector3(verts[i+1].x-verts[i].x,verts[i+1].y-verts[i].y,verts[i+1].z-verts[i].z);
	        var axis = new THREE.Vector3(0, 1, 0);
	        cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
	        top1.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
	        top2.quaternion.setFromUnitVectors(axis, vector.clone().normalize());

	        material = new THREE.LineDashedMaterial( {
	          color: 0x5d5f60,
	          linewidth: 1,
	          scale: 30,
	          dashSize: 3,
	          gapSize: 1,
	        } );
	        geometry = new THREE.Geometry();
	        geometry.vertices.push(verts[0]);
	        geometry.vertices.push(top1.position);
	        var line = new THREE.Line(geometry, material);
	        geometry.computeLineDistances();
	        scene.add(line);
	        var vector = new THREE.Vector3(top1.position.x-verts[0].x, top1.position.y-verts[0].y, top1.position.z-verts[0].z);
	        var p2 = new THREE.Vector3(verts[1].x+vector.x, verts[1].y+vector.y, verts[1].z+vector.z);
	        geometry = new THREE.Geometry();
	        geometry.vertices.push(verts[1]);
	        geometry.vertices.push(p2);
	        var line2 = new THREE.Line(geometry, material);
	        geometry.computeLineDistances();
	        scene.add(line2);
	      }
	    }else{
	      if(verts.length<3){
	        console.log('You need 3 arguments, please introduce a reference.');
	      }else if(verts.length>3){
	        console.log('You only need 1 referene!');
	      }else{
	        dist = distance(verts[0], verts[1]);
	        var geometry = new THREE.CylinderGeometry( 0.015, 0.015, dist, 16 );
	        var geometry2 = new THREE.CylinderGeometry( 0.03, 0.03, 0.02, 16 );
	        var geometry3 = new THREE.CylinderGeometry( 0.04, 0.04, 0.01, 16 );
	        var material = new THREE.MeshBasicMaterial( {color: 0x5d5f60} );
	        var textMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
	        var textGeo = new THREE.TextGeometry( dist.toFixed(2), {
	          font: font,
	          size: 0.2,
	          height: 0.03
	        } );
	        var cylinder = new THREE.Mesh( geometry, material );
	        var top1 = new THREE.Mesh( geometry2, material );
	        var top2 = new THREE.Mesh( geometry3, material );
	        var textMesh = new THREE.Mesh( textGeo, textMaterial);
	        scene.add( cylinder );
	        scene.add( top1 );
	        scene.add( top2 );
	        scene.add( textMesh );
	        console.log(textMesh);
	        numbers.push(textMesh);
	        var vector = new THREE.Vector3(verts[1].x-verts[0].x,verts[1].y-verts[0].y,verts[1].z-verts[0].z);
	        var axis = new THREE.Vector3(0, 1, 0);
	        cylinder.position.x=verts[0].x;
	        cylinder.position.y=verts[0].y;
	        cylinder.position.z=verts[0].z;

	        top1.position.x=verts[0].x;
	        top1.position.y=verts[0].y;
	        top1.position.z=verts[0].z;

	        top2.position.x=verts[0].x;
	        top2.position.y=verts[0].y;
	        top2.position.z=verts[0].z;

	        textMesh.position.x=(verts[0].x+verts[1].x)/2;
	        textMesh.position.y=(verts[0].y+verts[1].y)/2;
	        textMesh.position.z=(verts[0].z+verts[1].z)/2;

	        cylinder.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,dist/2, 0));
	        top2.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,dist, 0));
	        var point2 = {x:verts[1].x, y:verts[1].z};
	        var center = {x:verts[2].x, y:verts[2].z};
	        var uVec = unitVector(center, point2);
	        point2 = {x:verts[1].x, y:verts[1].y};
	        center = {x:verts[2].x, y:verts[2].y};
	        var uVec2 = unitVector(center, point2);
	        cylinder.position.x+=uVec.x*offset;
	        cylinder.position.y+=uVec2.y*offset;
	        cylinder.position.z+=uVec.y*offset;
	        top1.position.x+=uVec.x*offset;
	        top1.position.y+=uVec2.y*offset;
	        top1.position.z+=uVec.y*offset;
	        top2.position.x+=uVec.x*offset;
	        top2.position.y+=uVec2.y*offset;
	        top2.position.z+=uVec.y*offset;
	        textMesh.position.x+=uVec.x*offset+0.3;
	        textMesh.position.y+=uVec2.y*offset;
	        textMesh.position.z+=uVec.y*offset+0.1;
	        cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
	        top1.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
	        top2.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
	        material = new THREE.LineDashedMaterial( {
	          color: 0x5d5f60,
	          linewidth: 1,
	          scale: 30,
	          dashSize: 3,
	          gapSize: 1,
	        } );
	        geometry = new THREE.Geometry();
	        geometry.vertices.push(verts[0]);
	        geometry.vertices.push(top1.position);
	        var line = new THREE.Line(geometry, material);
	        geometry.computeLineDistances();
	        scene.add(line);
	        var vector = new THREE.Vector3(top1.position.x-verts[0].x, top1.position.y-verts[0].y, top1.position.z-verts[0].z);
	        var p2 = new THREE.Vector3(verts[1].x+vector.x, verts[1].y+vector.y, verts[1].z+vector.z);
	        geometry = new THREE.Geometry();
	        geometry.vertices.push(verts[1]);
	        geometry.vertices.push(p2);
	        var line2 = new THREE.Line(geometry, material);
	        geometry.computeLineDistances();
	        scene.add(line2);
	      }
	    }

	  });
	}
	function distance(p1, p2){
	  return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2)+Math.pow(p2.z-p1.z,2))
	}
	function crossProduct(v1, v2){
	  return new THREE.Vector3(v1.y*v2.z-v1.z*v2.y, v1.z*v2.x-v1.x*v2.z, v1.x*v2.y-v1.y*v2.x);
	}
	function rotateLine(center, point, angle) {
	  var radians = toRadians(angle),
	      cos = Math.cos(radians),
	      sin = Math.sin(radians),
	      nx = (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
	      ny = (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y;
	  return {x: roundTo(nx, 3), y: roundTo(ny, 3)};
	}
	function roundTo(number, decimals) {
	  return parseFloat(number.toFixed(decimals));
	}
	function toRadians(degress){return (Math.PI / 180) * degress;}
	function unitVector(p1, p2, magnitude=1) {
	  var vector = {x:p2.x-p1.x, y:p2.y-p1.y};
	  var abs = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
	  vector.x = roundTo(vector.x/abs,4);
	  vector.y = roundTo(vector.y/abs,4);
	  if (magnitude>1){
	    vector.x *= magnitude;
	    vector.y *= magnitude;
	  }
	  return vector;
	}
	return{
		createSphere: sphere,
		createBox: box,
		createRegular: extrudeRegular,
		createPlane: plane,
		create2Dfunction: function2d,
		create3Dfunction: function3d,
		create3Dparametric: parametric3d,
		drawDimensions: drawDimensions,
		returnVerts: returnVerts,
		intersection: planeIntersection,
		move:move,
		animate: animate,
		render: render,
		controls: controls,
		axis: createAxis
	}
}

export default Geometry3D;
