// a bunch of helper functions for clicking and getting values.

function pitch_up() {
	$("#pitch-up-button").click();
}

function pitch_down() {
	$("#pitch-down-button").click();
}

function yaw_left() {
	$("#yaw-left-button").click();
}

function yaw_right() {
	$("#yaw-right-button").click();
}

function roll_left() {
	$("#roll-left-button").click();
}

function roll_right() {
	$("#roll-right-button").click();
}

function translate_left() {
	$("#translate-left-button").click();
}

function translate_right() {
	$("#translate-right-button").click();
}

function translate_up() {
	$("#translate-up-button").click();
}

function translate_down() {
	$("#translate-down-button").click();
}

function translate_forward() {
	$("#translate-forward-button").click();
}

function translate_backward() {
	$("#translate-backward-button").click();
}

function getPitchRate() {
	return parseFloat($("#pitch .rate").innerText);
}

function getYawRate() {
	return parseFloat($("#yaw .rate").innerText);
}

function getRollRate() {
	return parseFloat($("#roll .rate").innerText);
}

function getPitch() {
	return parseFloat($("#pitch .error").innerText);
}

function getYaw() {
	return parseFloat($("#yaw .error").innerText);
}

function getRoll() {
	return parseFloat($("#roll .error").innerText);;
}

// get position
function getPos() {
	var x = parseFloat($("#x-range > div").innerText);
	var y = parseFloat($("#y-range > div").innerText);
	var z = parseFloat($("#z-range > div").innerText);
	return new THREE.Vector3(x,y,z);
}

function getRate() {
	return parseFloat($("#rate > div.rate").innerText);
}

// The script itself:

var ERROR_TOL = 0.4;
// PID constants, try changing these. I term wasn't necessary
var rotP = 0.51;
// rotI = 0
var rotD = 0.8;

// Y and Z translation:
var transP = 0.14;
//var transI = 0
var transD = 0.9;

// X translation. Axis towards the station.
var transXP = 0.08; // proportional. Higher values: more thrust
//var transI = 0
var transXD = 1.5; // derivative. Higher values: resists motion/less overshoot

// angular velocity limit
var maxAngVel = 3;



// estimated velocity vector
var vel = new THREE.Vector3(0,0,0);
// last position
var lastPos = getPos();

// "Duty cycle" of the translation thrusters... idk.
var weirdDutyCycle = new THREE.Vector3(0,0,0);

var angleDt = 0.1;  // deltaTime in seconds
var velDt = 1; // delay between velocity update

var loopCounter = 0;
var velInterval = Math.round(velDt / angleDt);

// Start control loop
setInterval(controlLoop, angleDt * 1000);

function controlLoop() {

	loopCounter++;

	// PD loop
	var pitchRate = getPitchRate();
	var pitch = getPitch();

	var pitchSetpoint = Math.round((pitch * rotP - pitchRate * rotD) * 10) / 10;
	if (pitchRate < pitchSetpoint && pitchRate < maxAngVel) {
		pitch_down();
	}
	else if (pitchRate > pitchSetpoint && pitchRate > -maxAngVel) {
		pitch_up();
	}

	var yawRate = getYawRate();
	var yaw = getYaw();

	var yawSetpoint = Math.round((yaw * rotP - yawRate * rotD) * 10) / 10;

	if (yawRate < yawSetpoint && yawRate < maxAngVel) {
		yaw_right();
	}
	else if (yawRate > yawSetpoint && yawRate > -maxAngVel) {
		yaw_left();
	}

	var rollRate = getRollRate();
	var roll = getRoll();

	var rollSetpoint = Math.round((roll * rotP - rollRate * rotD) * 10) / 10;

	if (rollRate < rollSetpoint && rollRate < maxAngVel) {
		roll_right();
	}
	else if (rollRate > rollSetpoint && rollRate > -maxAngVel) {
		roll_left();
	}

	// translate only if angle is small
	if (Math.abs(pitch) + Math.abs(yaw) + Math.abs(roll) <= 3*ERROR_TOL) {
		translationCorrection();
	}
	else {
		// log rotation rate setpoints
		console.log({
			p: pitchSetpoint,
			y: yawSetpoint,
			r: rollSetpoint
		});
	}
}

function translationCorrection() {
	var newPos = getPos();

	if (loopCounter % velInterval === 0) {
		// update velocity estimate
		vel = newPos.clone().sub(lastPos).divideScalar(velDt);
		lastPos = newPos.clone();
	}
	
	// use displayed rate if only moving in x direction
	if (vel.x * vel.y === 0) {
		vel.x = getRate();
	}

	weirdDutyCycle.x = Math.min(1, Math.max(-1, newPos.x * transXP + vel.x * transXD));
	weirdDutyCycle.y = Math.min(1, Math.max(-1, newPos.y * transP + vel.y * transD));
	weirdDutyCycle.z = Math.min(1, Math.max(-1, newPos.z * transP + vel.z * transD));

	console.log(weirdDutyCycle);


	if (loopCounter % velInterval >= velInterval * Math.abs(weirdDutyCycle.x) || Math.abs(newPos.y) + Math.abs(newPos.z) > 45) {
		// "duty cycle" is off, do nothing
	}
	else if (weirdDutyCycle.x > 0) {
		translate_forward();
	}
	else if (weirdDutyCycle.x < -0.1) { // don't change if moving slowly forwards
		translate_backward();
	}


	if (loopCounter % velInterval >= velInterval * Math.abs(weirdDutyCycle.y)) {
		// "duty cycle" is off, do nothing
	}
	else if (weirdDutyCycle.y > 0) {
		translate_left();
	}
	else if (weirdDutyCycle.y < 0) {
		translate_right();
	}
	

	if (loopCounter % velInterval >= velInterval * Math.abs(weirdDutyCycle.z)) {
	// "duty cycle" is off, do nothing
	}
	else if (weirdDutyCycle.z > 0) {
		translate_down();
	}
	else if (weirdDutyCycle.z < 0) {
		translate_up();
	}
	
}
 dragon_dock_slow.js
// Version with slower control loop and velocity limits. More realistic!

// a bunch of helper functions for clicking and getting values.

function pitch_up() {
	$("#pitch-up-button").click();
}

function pitch_down() {
	$("#pitch-down-button").click()
}

function yaw_left() {
	$("#yaw-left-button").click()
}

function yaw_right() {
	$("#yaw-right-button").click()
}

function roll_left() {
	$("#roll-left-button").click()
}

function roll_right() {
	$("#roll-right-button").click()
}

function translate_left() {
	$("#translate-left-button").click();
}

function translate_right() {
	$("#translate-right-button").click();
}

function translate_up() {
	$("#translate-up-button").click();
}

function translate_down() {
	$("#translate-down-button").click();
}

function translate_forward() {
	$("#translate-forward-button").click();
}

function translate_backward() {
	$("#translate-backward-button").click();
}

function getPitchRate() {
	return parseFloat($("#pitch .rate").innerText);
}

function getYawRate() {
	return parseFloat($("#yaw .rate").innerText);
}

function getRollRate() {
	return parseFloat($("#roll .rate").innerText);
}

function getPitch() {
	return parseFloat($("#pitch .error").innerText);
}

function getYaw() {
	return parseFloat($("#yaw .error").innerText);
}

function getRoll() {
	return parseFloat($("#roll .error").innerText);;
}


// get position
function getPos() {
	var x = parseFloat($("#x-range > div").innerText)
	var y = parseFloat($("#y-range > div").innerText)
	var z = parseFloat($("#z-range > div").innerText)
	return new THREE.Vector3(x,y,z);
}


function getRate() {
	return parseFloat($("#rate > div.rate").innerText)
}


var ERROR_TOL = 0.1

// PID constants. I term wasn't necessary
var rotP = 0.3
// rotI = 0
var rotD = 0.35

var transP = 0.14
//var transI = 0
var transD = 0.9

var transXP = 0.08
//var transI = 0
var transXD = 1.5

// limits
var maxAngVel = 0.6;
var maxVel = 0.4;

// estimated velocity vector
var vel = new THREE.Vector3(0,0,0)

// last position
var lastPos = getPos();

// "Duty cycle" of the translation thrusters... idk.
var weirdDutyCycle = new THREE.Vector3(0,0,0)

var angleDt = 0.5// deltaTime in seconds
var velDt = 1 // delay between velocity update

var loopCounter = 0;
var velInterval = Math.round(velDt / angleDt);



setInterval(controlLoop, angleDt * 1000);

function controlLoop() {

	loopCounter++;

	// PD loop
	var pitchRate = getPitchRate();
	var pitch = getPitch();

	var pitchSetpoint = Math.round((pitch * rotP - pitchRate * rotD) * 10) / 10
	if (pitchRate < pitchSetpoint && pitchRate < maxAngVel) {
		pitch_down();
	}
	else if (pitchRate > pitchSetpoint && pitchRate > -maxAngVel) {
		pitch_up();
	}

	var yawRate = getYawRate();
	var yaw = getYaw();

	var yawSetpoint = Math.round((yaw * rotP - yawRate * rotD) * 10) / 10;

	if (yawRate < yawSetpoint && yawRate < maxAngVel) {
		yaw_right();
	}
	else if (yawRate > yawSetpoint && yawRate > -maxAngVel) {
		yaw_left();
	}

	var rollRate = getRollRate();
	var roll = getRoll();

	var rollSetpoint = Math.round((roll * rotP - rollRate * rotD) * 10) / 10;

	if (rollRate < rollSetpoint && rollRate < maxAngVel) {
		roll_right();
	}
	else if (rollRate > rollSetpoint && rollRate > -maxAngVel) {
		roll_left();
	}

	// translate only if angle is small
	if (Math.abs(pitch) + Math.abs(yaw) + Math.abs(roll) <= 3*ERROR_TOL) {
		translationCorrection();
	}
	else {
		// log rotation rate setpoints
		console.log({
			p: pitchSetpoint,
			y: yawSetpoint,
			r: rollSetpoint
		})
	}
}

function translationCorrection() {
	var newPos = getPos();

	if (loopCounter % velInterval === 0) {
		// update velocity estimate
		vel = newPos.clone().sub(lastPos).divideScalar(velDt)
		lastPos = newPos.clone();
	}
	
	// use displayed rate if only moving in x direction
	if (vel.x * vel.y === 0) {
		vel.x = getRate();
	}

	weirdDutyCycle.x = Math.min(1, Math.max(-1, newPos.x * transXP + vel.x * transXD));
	weirdDutyCycle.y = Math.min(1, Math.max(-1, newPos.y * transP + vel.y * transD));
	weirdDutyCycle.z = Math.min(1, Math.max(-1, newPos.z * transP + vel.z * transD));

	console.log(weirdDutyCycle)


	if (loopCounter % velInterval >= velInterval * Math.abs(weirdDutyCycle.x) || Math.abs(newPos.y) + Math.abs(newPos.z) > 45) {
		// "duty cycle" is off, do nothing
	}
	else if (vel.x > -maxVel && weirdDutyCycle.x > 0) {
		translate_forward();
	}
	else if (vel.x < maxVel && weirdDutyCycle.x < -0.07) { // don't change if moving slowly forwards
		translate_backward();
	}


	if (loopCounter % velInterval >= velInterval * Math.abs(weirdDutyCycle.y)) {
		// "duty cycle" is off, do nothing
	}
	else if (vel.y > -maxVel && weirdDutyCycle.y > 0) {
		translate_left();
	}
	else if (vel.y < maxVel && weirdDutyCycle.y < 0) {
		translate_right();
	}
	

	if (loopCounter % velInterval >= velInterval * Math.abs(weirdDutyCycle.z)) {
	// "duty cycle" is off, do nothing
	}
	else if (vel.z > -maxVel && weirdDutyCycle.z > 0) {
		translate_down();
	}
	else if (vel.z < maxVel && weirdDutyCycle.z < 0) {
		translate_up();
	}
	
}
