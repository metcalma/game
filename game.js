var gl;
var myShaderProgram;
var rotating;
var thetaVal;
var thetaUniform;
var clipX;
var clipY;
var bufferId;
var coordinatesUniform;
var speed;
var direction;
var move;
var cx;
var cy;

function init() {

  rotating = 0;
    // set up the canvas
    var canvas = document.getElementById("gl-canvas");

    // get the WebGL context
    gl = WebGLUtils.setupWebGL(canvas);

    // set up the viewport
    gl.viewport( 0, 0, 512, 512 );

    // set up the color to refresh the screen
    gl.clearColor( 0.5, 0.0, 0.1, 1.0 );

    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(myShaderProgram);

    thetaVal = 0.1;
    thetaUniform = gl.getUniformLocation(myShaderProgram, "theta");
    gl.uniform1f(thetaUniform, thetaVal);

    coordinatesUniform = gl.getUniformLocation(myShaderProgram, "coordinates");

    clipX = 0.0;
    clipY = 0.0;
    direction = 1;
    speed = 0.005;

    gl.uniform2f(coordinatesUniform, 0.0, 0.0);

    drawShape();


    render();
}

/*
m - mat3
v - vec2
*/

function transformVec2(m, v){
	var vt = mat3(v[0], 0, 0,
				  v[1], 0, 0,
				  1, 0, 0);

	var result = mult(m,vt);
	return vec2(result[0][0], result[1][0]);
}

/*
shapeVertices - vec2 array
transMatrix - mat3
*/
function transformVec2Array(shapeVertices, transMatrix){
	var temp = [];
	for(var i=0; i<shapeVertices.length; i++){
		temp.push(transformVec2(transMatrix,shapeVertices[i]));
	}
	return temp;
}

/*
Arg: vec2 array
Return: vec2 array

Test: appears to work.
*/
function getEdgeNormals(shapeVertices){
	var numVertices = shapeVertices.length;
	var edgeNormals = [];

	for(var i=0; i<numVertices; i++){
		var p1 = shapeVertices[i];
		var p2 = shapeVertices[i+1 == numVertices ? 0:i+1];

		var edge = subtract(p1,p2);
		var normal = vec2(edge[1],-edge[0]);
		edgeNormals.push(normal);
	}
	return edgeNormals;
}

/*
Arg: vec2 array, vec2
 shapeVertices is an array of vertices,
 axis is an edge normal
Return: vec2

Notes: precision may be a problem.
*/
function projShapeToAxis(shapeVertices, axis){
	var min = dot(shapeVertices[0], axis);
	var max = min;

	for(var i=1; i<shapeVertices.length; i++){
		var p = dot(shapeVertices[i], axis);
		if(p < min) min = p;
		else if(p > max) max = p;
	}
	return vec2(min, max);
}

/*
Arg: vec2, vec2
Return: bool

Test: appears to work
*/
function projOverlap(proj1, proj2){
	//x-coord for proj1 is assumed to be equal or less than the x-coord for proj2
	if (proj1[0] > proj2[0]){
		var temp = proj1;
		proj1 = proj2;
		proj2 = temp;
	}
	if(proj1[0] <= proj2[0] && proj1[1] > proj2[0]){
		return true;
	}
	return false;
}

/*
Arg: vec2 array, vec2 array
 Takes arrays that contain the vertices of a shape.
Return: bool
 If shapes collide, return true. Else return false.
*/
function checkCollision(shape1, shape2){
	var axes1 = getEdgeNormals(shape1);
	var axes2 = getEdgeNormals(shape2);

	for(var i=0; i<axes1.length; i++){
		var axis = axes1[i];

		var p1 = projShapeToAxis(shape1, axis);
		var p2 = projShapeToAxis(shape2, axis);

		if(!projOverlap(p1,p2)) return false;
	}

	for(var i=0; i<axes2.length; i++){
		var axis = axes2[i];

		var p1 = projShapeToAxis(shape1, axis);
		var p2 = projShapeToAxis(shape2, axis);

		if(!projOverlap(p1,p2)) return false;
	}
	return true;
}

function increaseSpeed(event){
  speed = speed + .001;
}
function decreaseSpeed(event){
  speed = speed - .001;
}

function startRotate()
{
    if (rotating == 0)
    {
        rotating = 1;
        window.rotateShape();
      }
}

function stopRotate()
{
  console.log("notRotating");
    if (rotating == 1)
    {
        rotating = 0;
    }
}

//random number between 1-500
function randPos(){
  var rand = Math.floor(Math.random() * 475);
    console.log("coordinate:" + rand);
  return rand;

}

function randDirection(){
  direction = Math.floor(Math.random() * 8);
  console.log("drection " + direction);
}

function randNum(){
  num = Math.floor(Math.random() * 10);
  console.log("num " + value);
  return num;
}

function reset(event){
  cx = 250;
  cy = 250;
  moveShape();
}

function newPos(event){
  cx = window.randPos();
  cy = window.randPos();
  moveShape();
}


function drawSmallShapes() {
  var numShapes = winndow.randomNum();
  //picShape = window.randNum();
  var pickShape = 0;
//  if(var i <= numShapes, i++){
  //  if(pickShape == 0){
      var p0 = vec2(  0.01, 0.01 );
      var p1 = vec2(  0.03, 0.00 );
      var p2 = vec2(  0.01,-0.01 );
      var p3 = vec2(  0.00,-0.03 );
      var p4 = vec2( -0.01,-0.01 );
      var p5 = vec2( -0.03, 0.00 );
      var p6 = vec2( -0.01, 0.01 );
      var p7 = vec2( 0.00, 0.03 );
/*  }else if(pickShape == 1){
    var p0 = vec2(  0.01, 0.01 );
    var p1 = vec2(  0.03, 0.00 );
    var p2 = vec2(  0.01,-0.01 );
    var p3 = vec2(  0.00,-0.03 );
    var p4 = vec2( -0.01,-0.01 );
    var p5 = vec2( -0.03, 0.00 );
    var p6 = vec2( -0.01, 0.01 );
    var p7 = vec2( 0.00, 0.03 );
  }*/
//}

/*
var p0 = vec2(  0.01, 0.01 );
var p1 = vec2(  0.03, 0.00 );
var p2 = vec2(  0.01,-0.01 );
var p3 = vec2(  0.00,-0.03 );
var p4 = vec2( -0.01,-0.01 );
var p5 = vec2( -0.03, 0.00 );
var p6 = vec2( -0.01, 0.01 );
var p7 = vec2( 0.00, 0.03 );
*/
    // create array
    var arr = [p0, p1, p2, p3, p4, p5, p6, p7];

    var bufferId = gl.createBuffer(); // make buffer variable
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // associate variable with target
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arr), gl.STATIC_DRAW ); // send data to target

    var myPositionAttrib = gl.getAttribLocation( myShaderProgram,"myPosition" );
    gl.vertexAttribPointer( myPositionAttrib, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttrib );
}

function drawShape() {

    // set up points
    var p0 = vec2(  0.08, 0.08 );
    var p1 = vec2(  0.1, 0.0 );
    var p2 = vec2(  0.08, -0.08 );
    var p3 = vec2(  0.0, -0.1 );
    var p4 = vec2( -0.08,-0.08 );
    var p5 = vec2( -0.1, 0.0 );
    var p6 = vec2( -0.08, 0.08 );
    var p7 = vec2( 0.0, 0.1 );

    // create array
    var arr = [p0, p1, p2, p3, p4, p5, p6, p7];

    var bufferId = gl.createBuffer(); // make buffer variable
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // associate variable with target
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arr), gl.STATIC_DRAW ); // send data to target

    var myPositionAttrib = gl.getAttribLocation( myShaderProgram,"myPosition" );
    gl.vertexAttribPointer( myPositionAttrib, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttrib );


}

function moveShape(event){

    clipX = 2 * cx / 512.0 - 1.0;
    clipY = -(2 * cy / 512.0 - 1.0);

    gl.uniform2f(coordinatesUniform, clipX, clipY);
    window.randDirection();

}
/*
function moveShapeKeys(event){
    var theKeyCode = event.keyCode;
    if (theKeyCode == 65)
    {
        move = 1;
    }
    else if (theKeyCode == 68)
    {
        move = 2;
    }
    else if (theKeyCode == 83)
    {
        move = 3;
    }
    else if (theKeyCode == 87)
    {
        move = 4;
    }
    gl.uniform2f(coordinatesUniform, clipX, clipY);
}
*/

function rotateShape(){
  console.log("in rotate square");

  if(rotating == 0){
    window.render();
    console.log("leaving");
  }else{
    if(direction == 0){ //left

      clipX = clipX - speed;

    }else if(direction == 1){//right

      clipX = clipX + speed;

    }else if( direction == 2){ //down

      clipY = clipY - speed;

    }else if (direction == 3){///up

      clipY = clipY + speed;

    }else if (direction == 4){//north east
        clipY = clipY + speed;
        clipX = clipX + speed;

    }else if (direction == 5){//North west
        clipY = clipY + speed;
        clipX = clipX - speed;
    }else if (direction == 6){//South east

      clipY = clipY - speed;
      clipX = clipX + speed;

    }else if (direction == 7){//South west

      clipY = clipY - speed;
      clipX = clipX - speed;
    }


    gl.useProgram(myShaderProgram);

    thetaVal = thetaVal + (.01)*rotating;

    gl.uniform1f(thetaUniform, thetaVal);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);

    requestAnimFrame(rotateShape);
  }

}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(myShaderProgram);


    if(direction == 0){ //left

      clipX = clipX - speed;

    }else if(direction == 1){//right

      clipX = clipX + speed;

    }else if( direction == 2){ //down

      clipY = clipY - speed;

    }else if (direction == 3){///up

      clipY = clipY + speed;

    }else if (direction == 4){//north east
      clipY = clipY + speed;
      clipX = clipX + speed;

    }else if (direction == 5){//North west
      clipY = clipY + speed;
      clipX = clipX - speed;
  }else if (direction == 6){//South east

    clipY = clipY - speed;
    clipX = clipX + speed;

  }else if (direction == 7){//South west

    clipY = clipY - speed;
    clipX = clipX - speed;
  }

    gl.uniform2f(coordinatesUniform, clipX, clipY);
    gl.uniform1f(thetaUniform, thetaVal);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);

    requestAnimFrame(render);
}
