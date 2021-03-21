// This js file is the code for the first person camera scene that the user can access by going into the camera house 

// We have used ml5.js libaray in the code to achieve our result

let video;

//for getting the points around the face 
let poseNet;
let poses = [];

//for noise circles 
let cNoise = [];
let points =[];
let numCircles =5;

//variables for colours
let start;
let end;

//variable for randomising the other people's colour who are in view
let othersR; 

//for opening and closing popup 
let infoClicked=false;

function AuraCamera(){
    this.setup = function(){
        
        video = createCapture(VIDEO);
        video.size(width, height);
    
        // Create a new poseNet method with a single detection
        poseNet = ml5.poseNet(video, this.modelReady);
        // This sets up an event that fills the global variable "poses"
        // with an array every time new poses are detected
        poseNet.on('pose', function(results) {
            poses = results;
        });
        // Hide the video element, and just show the canvas
        video.hide();

        ellipseMode(CENTER);
        colorMode(RGB, 100);
       
        //yellow, green, pink, blue
        start=[color(150, 111, 12, 20), color(29, 84, 69, 20), color(41, 23, 59, 20), color(22, 30, 79, 20)];
        
        end=[color(84, 72, 37, 20), color(92, 237, 59, 20), color(227, 61, 180, 20), color(23, 179, 227, 20)];
        
        othersR =[floor(random(0, start.length)), floor(random(0, start.length)), floor(random(0, start.length)), floor(random(0, start.length))];

        //creates 5 noiseCircles and 5 empty arrays in points so that when editing the points it can access the idividual arrays in points for each circle
        for(let i=0; i<numCircles; i++)
        {
            cNoise.push(new this.CircularNoise(0.5));
            points.push([]);
        }
        
    }
    this.modelReady = function() {
        select('#status').html('Model Loaded');
    }
    
    this.draw = function(){
        //draws the video
        image(video, 0, 0, width, height);

        //gets the points for each circle (so that they are continually updating)
        for(let i=0; i<numCircles; i++)
        {
            //gets the whole cirlce of points
            for(let angle=0; angle<360; angle +=1.0){
                let radian = radians(angle);
                //makes sure the size of the circle is always greater than 240 (220-100)*2 and then adds a noise value which is mapped 
                let radious = 220 + map(cNoise[i].getNoise(radian, frameCount * 0.007), 0, 1, -100, 100);
                //changing the coordients each time to the new ones 
                //the cos is *1.2 to increase the width of the cirlce and the sin is *2.5 to create a taller height and made negative so that the circle is fliped so we dont need to rotate the circle in the end
                points[i][angle]=([(radious * cos(radian) * 1.2), -(radious * sin(radian) * 2.5)]);
            }
        }
        //runs the drawing
        
        var index = auraColourNames.indexOf(player.aura);
        this.AuraBackground(start[index], end[index]);
        
        
        //change display of html elements 
        document.getElementById("about-click").style.display="none";
        document.getElementById("cameraButton").style.display = "grid";
        document.getElementById("globeButton").style.display = "grid";
        document.getElementById("questionButton").style.display ="grid";
        
        
        //add event listens to elements so can, save image or go back to world or show popup 
        document.getElementById("cameraButton").addEventListener("click", this.saveImg);
        document.getElementById("globeButton").addEventListener("click", this.backToWorld);
        document.getElementById("questionButton").addEventListener("click", this.infoShow);
        
        //if the info button has been clicked
        if(infoClicked==true)
        {
            fill(25,50,100);
            stroke(0,0,100);
            strokeWeight(4);
            rect(200,180,400,180,20);

            //show the close button only when popup shown 
            document.getElementById("close").style.display="block";
            document.getElementById("close").addEventListener("click", this.infoClose);
            textSize(24);
            noStroke();
            fill(0,0,100);
            text('More Info', 340,220);
            textSize(16);
            text('Why not get a friend and see what both',230,260);
            text('of your auras look like?',290,280);
            text('You can also take a photo of yourself',235,310);
            text('by clicking the camera button below.',240,330);
        }

    }
    
    // A function to draw around the face and then aura shape
    this.AuraBackground = function(startColour, endColour){
        // Loop through all the poses detected
        for(var j=0; j<numCircles; j++){
             for (let i = 0; i < poses.length; i++) {
                 //maps a colour between the two start and end for each circle 
                 var mapColour = map(j, 0, numCircles-1, 0, 1);
                 if(i == 0 ){
                     var personColour = lerpColor(startColour, endColour, mapColour);
                     fill(personColour);
                 }
                 else{
                     var r = othersR[i];
                     var startOther = start[r];
                     var endOther = end[r];
                     var otherColour = lerpColor(startOther,endOther,mapColour);
                     fill(otherColour)
                }
                
                // For each pose detected, loop through all the keypoints
                let pose = poses[i].pose;
                //original points
                let nose = pose.keypoints[0];
                let leftEye = pose.keypoints[1];
                let rightEye = pose.keypoints[2];
                let leftEar = pose.keypoints[3];
                let rightEar = pose.keypoints[4];
                let leftSholder = pose.keypoints[5];
                let rightSholder = pose.keypoints[6];

                //using the points that the ml5.js works out we create are own points
                let faceWidth = leftEar.position.x- rightEar.position.x;

                let foreheadPointX = nose.position.x;
                let foreheadPointY = nose.position.y - faceWidth*(4/5);

                let foreheadPointX1 = rightEye.position.x;
                let foreheadPointY1 = rightEye.position.y - faceWidth/2;

                let foreheadPointX2 = leftEye.position.x;
                let foreheadPointY2 = leftEye.position.y - faceWidth/2;

                let foreheadPointX3 = rightEar.position.x +10;
                let foreheadPointY3 = rightEar.position.y - faceWidth*(2/5);

                let foreheadPointX4 = leftEar.position.x -10;
                let foreheadPointY4 = leftEar.position.y - faceWidth*(2/5);

                let distBXaX1 = foreheadPointX - foreheadPointX1; 
                let distBYaY1 = foreheadPointY1 - foreheadPointY;

                let foreheadPointX5 = foreheadPointX -distBXaX1/2;
                let foreheadPointY5 = foreheadPointY + distBYaY1/2;

                let distBXaX2 = foreheadPointX2 - foreheadPointX; 
                let distBYaY2 = foreheadPointY - foreheadPointY2;

                let foreheadPointX6 = foreheadPointX + distBXaX2/2;
                let foreheadPointY6 = foreheadPointY - distBYaY2/2;

                let distBX1aX3 = foreheadPointX1 - foreheadPointX3; 
                let distBY1aY3 = foreheadPointY3 - foreheadPointY1;

                let foreheadPointX7 = foreheadPointX1 - distBX1aX3/2;
                let foreheadPointY7 = foreheadPointY1 + distBY1aY3/2;

                let distBX2aX4 = foreheadPointX4 - foreheadPointX2; 
                let distBY2aY4 = foreheadPointY4 - foreheadPointY2;

                let foreheadPointX8 = foreheadPointX2 + distBX2aX4/2;
                let foreheadPointY8 = foreheadPointY2 + distBY2aY4/2;

                let distBX3aRE = foreheadPointX3 - rightEar.position.x; 
                let distBY3aRE = rightEar.position.y - foreheadPointY3;

                let foreheadPointX9 = rightEar.position.x + distBX3aRE/2;
                let foreheadPointY9 = rightEar.position.y - distBY3aRE/2;

                let distBX4aLE = leftEar.position.x - foreheadPointX4; 
                let distBY4aLE = leftEar.position.y - foreheadPointY4;

                let foreheadPointX10 = leftEar.position.x - distBX4aLE/2;
                let foreheadPointY10 = rightEar.position.y - distBY4aLE/2;

                let foreheadPointX11 = rightEye.position.x;
                let foreheadPointY11 = rightEye.position.y + faceWidth*(4/5);

                let foreheadPointX12 = leftEye.position.x;
                let foreheadPointY12 = leftEye.position.y + faceWidth*(4/5);

                let foreheadPointX13 = foreheadPointX4;
                let foreheadPointY13 = foreheadPointY4 + faceWidth*(4/5);

                let foreheadPointX14 = foreheadPointX3;
                let foreheadPointY14 = foreheadPointY3 + faceWidth*(4/5);

                noStroke();
                beginShape();

                //connects all the points around the face from left to right 
                vertex(leftSholder.position.x, height);

                bezierVertex( 
                    leftSholder.position.x, leftSholder.position.y, 
                    foreheadPointX12,foreheadPointY12,
                    foreheadPointX13, foreheadPointY13
                );

                bezierVertex(
                    foreheadPointX13, foreheadPointY13,
                    leftEar.position.x, leftEar.position.y,
                    foreheadPointX10, foreheadPointY10
                );

                bezierVertex(
                    foreheadPointX4, foreheadPointY4, 
                    foreheadPointX8, foreheadPointY8,
                    foreheadPointX8, foreheadPointY8
                );

                bezierVertex(
                    foreheadPointX2, foreheadPointY2,
                    foreheadPointX6, foreheadPointY6,
                    foreheadPointX6, foreheadPointY6    
                );

                bezierVertex(
                    foreheadPointX, foreheadPointY, 
                    foreheadPointX5, foreheadPointY5,
                    foreheadPointX5, foreheadPointY5
                );

                bezierVertex(
                    foreheadPointX1, foreheadPointY1,
                    foreheadPointX7, foreheadPointY7,
                    foreheadPointX7, foreheadPointY7
                );

                bezierVertex(
                    foreheadPointX3, foreheadPointY3,
                    foreheadPointX9, foreheadPointY9,
                    foreheadPointX9, foreheadPointY9
                );

                bezierVertex(
                    rightEar.position.x, rightEar.position.y,
                    foreheadPointX14, foreheadPointY14,
                    foreheadPointX14, foreheadPointY14
                );

                bezierVertex(
                    foreheadPointX11, foreheadPointY11,
                    rightSholder.position.x, rightSholder.position.y,
                    rightSholder.position.x, height
                );

                //have to go from 180 to 0 to get the semicircle effect and backwards so that the rightshoulder meets with the first point and goes round to the left and closes
                for(var angle =180; angle>0; angle-=1.0)
                {
                    vertex(points[j][angle][0]+nose.position.x, points[j][angle][1]+height+20);
                }
                endShape(CLOSE);
            }
        }
    }
    
    //gets the noise to add to each point 
    this.CircularNoise = function(scale){
        this.offsetX = random(100000);
        this.offsetY = random(100000);
        this.offsetZ = random(100000);
        //the bigger the scale the less smooth the shape
        this.scale = scale;

        //using the frameCount it means the points move 
        this.getNoise= function(radian, time){
            var r = radian % TWO_PI;
            //makes sure that the r doesnt go bellow 0
            if(r < 0.0){
                r += TWO_PI;
            }
            //returns a noise value which is worked out from the x and y and time 
            return noise(this.offsetX + cos(r) * this.scale, 
                         this.offsetY + sin(r) * this.scale, 
                         this.offsetZ + time);  
        }
    }
    
    //goes back to gameplay scene 
    this.backToWorld = function(){
        mng.showScene(Gameplay);
    }

    this.saveImg = function(){
        save('myAura.jpg');
    }

    this.infoShow = function(){
        infoClicked = true;
    }
    
    this.infoClose = function(){
        infoClicked = false;
        document.getElementById("close").style.display="none";
    }
}



