var canvas;
var gl;
var myShaderProgram;

function init() {
    canvas = document.getElementById("gl-canvas"); // set up the canvas
    gl = WebGLUtils.setupWebGL(canvas); // set up the WebGL context

    if ( !gl ) {
        alert( "WebGL is not available." );
    }
    gl.viewport( 0, 0, 512, 512 ); // set up the viewport
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 ); // assign a background color
    gl.clear( gl.COLOR_BUFFER_BIT );

    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram ); // set up the shader program
    drawShapes();
}

function newShape(){
  var size = Math.ceil(Math.random()*20);
  console.log(size);
}

// make a few set shapes, use random number to pick which one to use and then p
function drawShapes() {
    var point0 = vec2( 0.0, 0.0 ); // set up the points
    var point1 = vec2( 1.0, 0.0 );
    var point2 = vec2( 0.0, 1.0 );

    var pointA = vec2( 0.0, 0.0 );
    var pointB = vec2( -1.0, 0.0 );
    var pointC = vec2( -1.0, -1.0 );
    var pointD = vec2( 0.0, -1.0 );


    var arrayOfPointsForShapes =
        [point0, point1, point2, pointA, pointB, pointC, pointD]; // put points in an array

    var bufferId = gl.createBuffer(); // create the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // bind the buffer

    // buffer the data on the GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPointsForShapes), gl.STATIC_DRAW  );

    // set myPosition in vertex-shader to iterate over the triangle points
    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );

    var myUniformColor = gl.getUniformLocation( myShaderProgram, "myUniformColor");
    var myScale = gl.getUniformLocation( myShaderProgram, "myScale");

    gl.uniform2f( myScale, .5, .5 );
    gl.uniform4f( myUniformColor, 1.0,1.0,0.,1.0);
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    gl.uniform2f( myScale, 0.3, 0.3)
    gl.uniform4f( myUniformColor, 1.0, 0.0, 1.0, 1.0);
    gl.drawArrays( gl.TRIANGLE_FAN, 3, 4 );

    window.newShape();

}
