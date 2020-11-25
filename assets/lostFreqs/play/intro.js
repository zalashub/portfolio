// This js file is the main one which loads all the assets and draws the first scene 

// This file uses scenemanager.js
// p5.play.js has also been used to create animations in file


//Global scene manager
var mng;

//Images
var worldMap;
var introBackgroundPic;
var infoIcon;
var cameraIcon;

//Audio variables
var audioContext;
var isAudioInit;
var pinkSound;
var yellowSound;
var blueSound;
var greenSound;
var freq;
var playerSound;
var othersSound;

//Font
var introFont;

//Area variables
var cameraW;
var cameraH;
var worldW;
var worldH;
var worldLeftEdge;
var worldRightEdge;
var worldTopEdge;
var worldBottomEdge; 

function preload()
{
    introBackgroundPic = loadImage('assets/introBack.jpg');
    worldMap = loadImage('assets/background/worldNewLessSat.png');
    introFont = loadFont('fonts/ShareTechMono-Regular.ttf');
    
    //Icons
    //Source: <a target="_blank" href="https://icons8.com/icons/set/about">About icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
    //Source: <a target="_blank" href="https://icons8.com/icons/set/camera">Camera icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
    infoIcon = loadImage('assets/info.png');
    cameraIcon = loadImage('assets/cameraIcon.png');

    //Player animations
    pinkStill = loadImage('assets/player/walk-front/pink/front-01.png');
    pinkUp = loadAnimation('assets/player/walk-back/pink/back-01.png', 'assets/player/walk-back/pink/back-08.png');
    pinkDown = loadAnimation('assets/player/walk-front/pink/front-01.png', 'assets/player/walk-front/pink/front-08.png');
    pinkLeft = loadAnimation('assets/player/walk-left/pink/left-01.png', 'assets/player/walk-left/pink/left-08.png');
    pinkRight = loadAnimation('assets/player/walk-right/pink/right-01.png', 'assets/player/walk-right/pink/right-08.png');
    
    //Green aura
    greenStill = loadImage('assets/player/walk-front/green/front-01.png');
    greenUp = loadAnimation('assets/player/walk-back/green/back-01.png', 'assets/player/walk-back/green/back-08.png');
    greenDown = loadAnimation('assets/player/walk-front/green/front-01.png', 'assets/player/walk-front/green/front-08.png');
    greenLeft = loadAnimation('assets/player/walk-left/green/left-01.png', 'assets/player/walk-left/green/left-08.png');
    greenRight = loadAnimation('assets/player/walk-right/green/right-01.png', 'assets/player/walk-right/green/right-08.png');
    
    //Blue aura
    blueStill = loadImage('assets/player/walk-front/blue/front-01.png');
    blueUp = loadAnimation('assets/player/walk-back/blue/back-01.png', 'assets/player/walk-back/blue/back-08.png');
    blueDown = loadAnimation('assets/player/walk-front/blue/front-01.png', 'assets/player/walk-front/blue/front-08.png');
    blueLeft = loadAnimation('assets/player/walk-left/blue/left-01.png', 'assets/player/walk-left/blue/left-08.png');
    blueRight = loadAnimation('assets/player/walk-right/blue/right-01.png', 'assets/player/walk-right/blue/right-08.png');
    
    //Yellow aura
    yellowStill = loadImage('assets/player/walk-front/yellow/front-01.png');
    yellowUp = loadAnimation('assets/player/walk-back/yellow/back-01.png', 'assets/player/walk-back/yellow/back-08.png');
    yellowDown = loadAnimation('assets/player/walk-front/yellow/front-01.png', 'assets/player/walk-front/yellow/front-08.png');
    yellowLeft = loadAnimation('assets/player/walk-left/yellow/left-01.png', 'assets/player/walk-left/yellow/left-08.png');
    yellowRight = loadAnimation('assets/player/walk-right/yellow/right-01.png', 'assets/player/walk-right/yellow/right-08.png');
}

function setup() 
{
    createCanvas(800, 600);
    pixelDensity(1);
    
    textFont(introFont);
    
    //Create new scene manager 
    mng = new SceneManager();
    
    //Preload scenes
    mng.addScene(WelcomeScreen);
    mng.addScene(Gameplay);
    mng.addScene(AuraCamera);
    mng.addScene(About);
    
    mng.showNextScene();
    
    //Initialise the images
    mng.introBackgroundPic = introBackgroundPic;
    mng.worldMap = worldMap;
    mng.infoIcon = infoIcon;
    mng.cameraIcon = cameraIcon;
    
    //Audio code
    //create the audio context
    audioContext = new maximJs.maxiAudio();
    audioContext.play = audioPlay;
    isAudioInit = false;
    
    //create the aura noises
    pinkSound = new maximJs.maxiOsc();
    yellowSound = new maximJs.maxiOsc();
    blueSound = new maximJs.maxiOsc();
    greenSound = new maximJs.maxiOsc();
    
    //Variables for the area
    cameraW = width; //800
    cameraH = height; //600

    worldW = width * 3; //2400
    worldH = height * 3; //1800

    //sets the limits for the player to move with scroll pos
    worldLeftEdge = (-worldW/2 + cameraW/2); //-800
    worldRightEdge = (worldW/2 - cameraW/2); //800
    worldTopEdge = (-worldH/2 + cameraH/2);  //-1200
    worldBottomEdge = (worldH/2 - cameraH/2); //1200
    
}

function draw()
{
    mng.draw();
}

//Change between scenes
function keyPressed()
{
    //Dispatch via the SceneManager
    mng.handleEvent('keyPressed');
}

function keyReleased()
{
    mng.handleEvent('keyReleased');
}

//Scene one - welcome screen
function WelcomeScreen()
{
    this.setup = function(){};
    
    this.draw = function()
    {
        colorMode(HSB);
        image(mng.introBackgroundPic, 0, 0);
        push();
        translate(width/2, height/2);
        rectMode(CENTER);
        noStroke();
        //Shadow rect
//        fill(20, 20, 100, 150);
        fill(220, 40, 24, 0.80);
        rect(8, 8, 530, 470);
        //Main rect
        fill(231, 70, 60);
        rect(0, 0, 530, 470);
        fill(255);
        textSize(20);
        
        var welcomeText = "Welcome to Aura World - an alternative reality of what you are used to. Here everyone is assigned an aura at birth - a frequency at which their body constantly radiates. This produces a distinguishable colour and sound, eminating from their body at all times. Rather then speech, communication is based solely on interaction between people's auras. Some auras go well together and some don't. Explore and find out how well your aura matches others."
        rectMode(CORNER);
        textAlign(CENTER, TOP);
        text(welcomeText, -200, -200, 420, 500);
        
        textSize(17);
        var enterText = "Press SPACE to enter"
        text(enterText, -170, 160, 350, 500);
        pop();
    }
    
    this.keyPressed = function()
    {
        if(keyCode == 32)
        {
            //Switch to the playing screen
            mng.showNextScene();
        }
        
        if(isAudioInit == false && keyCode == 32)
        {
            //start the audio loop running
            audioContext.init();
            isAudioInit = true;
        }
    }
}
   
