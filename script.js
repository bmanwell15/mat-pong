// Created by Ben Manwell and Jonathan Lora

var bluePaddle = document.getElementById("paddle"), greenPaddle = document.getElementById("paddle2"), phantomPaddle = document.getElementById("phantomPaddle"); // gets the paddles
var ball = document.getElementById("ball"); // gets the ball
var rotation = Math.PI/2 + (Math.random() * 0.8) - 0.4; // IN RADIANS! MUST BE IN RADIANS
var speed = 6; // sets the speed of the ball
var bounceReset = 0, wallBounceReset = 0;

var runner;

var wDown, sDown, uArrowDown, dArrowDown;
var greenPoints = 0, bluePoints = 0; // variables for scores

{ // initialize for touch function
  ball.style.left = (window.innerWidth - 60)/2 + "px"
  ball.style.top = (window.innerHeight - 60)/2 + "px"
  greenPaddle.style.width = "12px"
  greenPaddle.style.height = window.innerHeight/3 + "px"
  greenPaddle.style.left = window.innerWidth - (window.innerWidth*0.05) + "px"
  greenPaddle.style.top = (window.innerHeight - (window.innerHeight/3))/2 + "px"
  
  bluePaddle.style.width = "12px"
  bluePaddle.style.height = window.innerHeight/3 + "px"
  bluePaddle.style.left = window.innerWidth*0.05 + "px"
  bluePaddle.style.top = (window.innerHeight - (window.innerHeight/3))/2 + "px"
  
  phantomPaddle.style.width = greenPaddle.style.width
  phantomPaddle.style.height = greenPaddle.style.height
  phantomPaddle.style.top = greenPaddle.style.top
  phantomPaddle.style.left = greenPaddle.style.left
  
  document.getElementById("score2").style.opacity = 0;
  document.getElementById("score1").style.opacity = 0;
  
  document.getElementById("instructions").style.opacity = 1;
  document.getElementById("instructions").style.opacity = 1;
  document.getElementById("instructions2").style.opacity = 1;
  document.getElementById("instructions2").style.opacity = 1;
  
  document.querySelector("body").style.backgroundSize = window.innerWidth + "px " + window.innerHeight + "px"
}

$("#restartBtn").mouseenter(function() {
  $("#restartBtn").animate({"backgroundColor" : "rgba(255,255,255,0.4)"})
});

$("#restartBtn").mouseleave(function() {
  $("#restartBtn").animate({"backgroundColor" : "rgba(255,255,255,0)"})
});

// plays whenever the user presses a key
addEventListener("keydown", function(event) {
  var key = event.keyCode;

  if (event.key == 'w') { // if the w key is pressed
    wDown = true;
  }

  if (event.key == 's') { // if the s key is pressed
    sDown = true;
  }
  
  if (event.key === "ArrowDown") { // if the down arrow key is pressed
    dArrowDown = true
  }
  
  if (event.key === "ArrowUp") { // if the up arrow key is pressed
    uArrowDown = true
  }
});

// plays when the user stops pressing a key
addEventListener("keyup", function(event) {
  var key = event.keyCode;
  if (runner == undefined) {
    runner = setInterval(tick, 17)
    $fade("instructions")
    $fade("instructions2")
    $fade("score1")
    $fade("score2")
  }

  if (event.key == 'w') { // if the w key is pressed
    wDown = false;
  }

  if (event.key == 's') { // if the s key is pressed
    sDown = false;
  }
  
  if (event.key === "ArrowDown") { // if the down arrow key is pressed
    dArrowDown = false
  }
  
  if (event.key === "ArrowUp") { // if the up arrow key is pressed
    uArrowDown = false
  }
});


function tick() {
  ball.style.transform = "rotate(" + rotation + "rad)" // rotates the ball to the value of "rotation"
  $moveForward(ball, speed) // moves the ball
  bounceReset++;wallBounceReset++
  
  if (speed < 20) {speed += 1/(50*speed)} // slightly increases the speed in a RATIONAL way
  
  { // if (key pressed) then {move paddle}
    if (dArrowDown) {greenPaddle.style.top = $removeLabel(greenPaddle.style.top) + 6 + "px"}
    if (uArrowDown) {greenPaddle.style.top = $removeLabel(greenPaddle.style.top) - 6 + "px"}
    if (sDown) {bluePaddle.style.top = $removeLabel(bluePaddle.style.top) + 6 + "px"}
    if (wDown) {bluePaddle.style.top = $removeLabel(bluePaddle.style.top) - 6 + "px"}
  }
  
  phantomPaddle.style.top = greenPaddle.style.top
  phantomPaddle.style.left = $removeLabel(greenPaddle.style.left) - 50 + "px"
  
  if ($touching(ball,phantomPaddle) && bounceReset > 50) { // if the ball touches the green paddle
    rotation *= -1
    randomizeRotation(0.7)
    bounceReset = 0
  }
  
  if ($touching(ball,bluePaddle) && bounceReset > 50) { // if the ball touches the blue paddle
    rotation *= -1
    randomizeRotation(0.7)
    bounceReset = 0
  }
  
  if ($removeLabel(ball.style.top) <= speed && wallBounceReset > 30) { // if the ball is touching the top of the screen
    rotation = (Math.PI)-rotation;
    randomizeRotation(0.3)
    wallBounceReset = 0
  }
  
  if ($removeLabel(ball.style.top) >= window.innerHeight - 50 && wallBounceReset > 30) { // if the ball is touhing the bottom of the screen
    rotation = (Math.PI)-rotation;
    randomizeRotation(0.3)
    wallBounceReset = 0
  }
  
  if ($removeLabel(ball.style.left) <= speed) { // if the ball touches the left side, reset the game
    resetGame("green")
  } else if ($removeLabel(ball.style.left) > window.innerWidth) { // if the ball touches the right side, reset the game
    resetGame("blue")
  }
}


function randomizeRotation(v) {rotation += (Math.random()*v) - (v/2)} // slightly changes the rotation of the ball


function resetGame(winner) { // when someone scores a point
  clearInterval(runner)
  
  if (winner == "green") { // if the winner is green, give a point and update green's keyboard
    greenPoints++
    $fade("score2", 500)
    $("body").animate({backgroundColor : "rgb(10,30,0)"}, 1000)
    $delay("updateScores(2)", 500)
  } else if (winner == "blue") { // if the winner is blue, give a point and update blue's keyboard
    bluePoints++
    $fade("score1", 500)
    $("body").animate({backgroundColor : "rgb(0,30,35)"}, 1000)
    $delay("updateScores(1)", 500)
  }
  
  ball.style.left = (window.innerWidth - 60)/2 + "px" // updates the ball's position
  ball.style.top = (window.innerHeight - 60)/2 + "px" // updates the ball's position
  bluePaddle.style.top = (window.innerHeight - (window.innerHeight/3))/2 + "px" // updates the blue paddle's position
  greenPaddle.style.top = (window.innerHeight - (window.innerHeight/3))/2 + "px" // updates the green paddle's position
  rotation = Math.PI/2 + (Math.random() * 0.8) - 0.4 // reset the ball's rotation to a random value
  speed = 6 // reset speed
  if (Math.max(greenPoints,bluePoints) < 5) {$delay("reset2()", 2500)} // if the greatest score is less than 5
}
function reset2() {runner = setInterval(tick, 17)}


function updateScores(a) { // updates the scores
  document.getElementById("score2").innerHTML = greenPoints;
  document.getElementById("score1").innerHTML = bluePoints;
  $fade("score"+a, 500)
  
  if (Math.max(greenPoints,bluePoints) < 5) { // if one of the scores is 5, end the game
    $("body").animate({backgroundColor : "rgb(0,0,0)"}, 1000)
  } else {
    win()
  }
  
}


function win() { // display the winning screen and buttons
  ball.style.display = "none"
  document.getElementById("winner").style.display = "block"
  document.getElementById("restartBtn").style.display = "block"
  
  if (Math.max(greenPoints,bluePoints) == greenPoints) {
    $("#winner").animate({opacity: 1, left: "65vw"}, "slow")
    $("#restartBtn").animate({opacity: 1, left: "15vw"}, "slow")
  } else {
    $("#winner").animate({opacity: 1, left: "15vw"}, "slow")
    $("#restartBtn").animate({opacity: 1, left: "65vw"}, "slow")
  }
}

