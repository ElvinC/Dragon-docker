// randomizes the starting position and velocity
rx=(Math.random()-0.5) * 100;ry=(Math.random()-0.5) * 100;rz=(Math.random()-0.5) * 100;
rateRotationX=rx;
targetRotationX=rx/2*toRAD;
rateRotationY=ry;
targetRotationY=ry/2*toRAD;
rateRotationZ=rz;
targetRotationZ=rz/2*toRAD;
camera.position.x = (Math.random()-0.5) * 150;
camera.position.y = (Math.random()-0.5) * 100;
camera.position.x = (Math.random()-0.5) * 100;
camera.position.z = (Math.random()-0.5) * 70;
motionVector.x = (Math.random()-0.5)*0.1;
motionVector.y = (Math.random()-0.5)*0.1;
motionVector.z = (Math.random()-0.5)*0.1