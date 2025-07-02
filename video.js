let videofeed;
let posenet;
let poses = [];
let started = false;
var audio = document.getElementById("audioElement");

function setup() {
  const canvas = createCanvas(400, 450);
  canvas.parent("video");

  videofeed = createCapture(VIDEO);
  videofeed.size(width, height);
  posenet = ml5.poseNet(videofeed);
  posenet.on("pose", function (results) {
    poses = results;
  });

  videofeed.hide();
  noLoop();
}

function draw() {
  if (started) {
    image(videofeed, 0, 0, width, height);
    calEyes();
  }
}

function start() {
  select("#startstop").html("Stop Monitoring");
  document.getElementById("startstop").onclick = stop;
  started = true;
  loop();
}

function stop() {
  select("#startstop").html("Start Monitoring");
  document.getElementById("startstop").onclick = start;
  removeblur();
  started = false;
  noLoop();
}

var rightEye, leftEye;
var defaultRightEyePosition = [];
var defaultLeftEyePosition = [];

function calEyes() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    rightEye = pose.keypoints[2].position;
    leftEye = pose.keypoints[1].position;

    if (defaultRightEyePosition.length < 1) {
      defaultRightEyePosition.push(rightEye.y);
    }
    if (defaultLeftEyePosition.length < 1) {
      defaultLeftEyePosition.push(leftEye.y);
    }

    if (Math.abs(rightEye.y - defaultRightEyePosition[0]) > 20) {
      blur();
    } else {
      removeblur();
    }
  }
}

function blur() {
  document.body.style.filter = "blur(5px)";
  document.body.style.transition = "1s";
  var audio = document.getElementById("audioElement");
  if (audio.paused) audio.play();
}

function removeblur() {
  document.body.style.filter = "blur(0px)";
  var audio = document.getElementById("audioElement");
  if (!audio.paused) audio.pause();
}
