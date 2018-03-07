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
