var gameChar;
var gameChar_world_x;

var scrollPos;
var floorPos_y;

var game_score;
var lives;
var live_pills;
var flagpole;

//Environment
var landscape;
var crystals;
var platforms = [];
var trees = [];

function preload()
{
    landscape = loadImage('Assets/landscape.png');
    live_pills = loadImage('Assets/Lives_capsule.png');
}

function setup()
{
    createCanvas(1024, 576);
    
    // Number of initial lives
    lives = 4;
    
    floorPos_y = height * 3/4;
    
    // Create platforms
    createPlatforms();
    
    // Render Background
    renderScene();
    
    // Start the game
    startGame();
}

function draw()
{
	
//--------------------------------DRAW THE SCENERY-------------------------------//    

    // Draw background image
    image(landscape, 0, 0, width, height);
    
    push();
    translate(scrollPos, 0);
    
    // Draw the platforms
    drawPlatforms();

    // Draw trees
    drawTrees();
    
    // Draw crystals
    for (var i = 0; i < platforms.length; i++)
    {
        // Draw crystals on specific platforms
        if(i % 3 == 0 || i % 5 == 0)
        {
            crystals.draw(platforms[i].x + platforms[i].length/3, platforms[i].y);
        }
    }
    
    // Draw collectable items
    for (var i = 0; i < collectables.length; i++)
    {
        if (!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    // Draw the flagpole
    renderFlagpole();

    pop();

//----------------------------------DRAW THE INFO---------------------------------//    
    // Draw the info on the screen
    renderInfo();
    
    //  Game over screen
    if (lives < 1)
    {
        gameOver();
        return;
    }

    //  Winning screen
    if (flagpole.isReached)
    {
        winning();
        return;
    }
    
//---------------------------- HANDLE THE GAME CHARACTER -----------------------------//
    
    // Draw and handle the game character
    gameChar.draw();
    gameChar.move();
    
    //  Check if game character fell in the pit to start new game
    if (gameChar.y - 100 > height && lives >= 0)
    {
        startGame();
    }
    
    if (flagpole.isReached != true)
    {
        checkFlagpole();
    }
    
	// Update real position of gameChar for collision detection
	gameChar_world_x = gameChar.x - scrollPos;
}

//----------------------------KEY CONTROL FUNCTIONS------------------------------//

function keyPressed()
{
    
//------------------------NEXT LEVEL LOGIC FOR THE HALL OF FAME-------------------//  
    
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }
    
//--------------------------CHARACTER FACING DRAWING CODE-------------------------//   
    
    if (keyCode == 37 && gameChar.y <= floorPos_y)
    {
        gameChar.isLeft = true;
    }
    
    else if (keyCode == 39 && gameChar.y <= floorPos_y)
    {
        gameChar.isRight = true;
    }
    
    if (keyCode == 32 && (gameChar.y == floorPos_y || gameChar.onPlatform))
    {
        gameChar.y -= 130;
    }
}

function keyReleased()
{
    if (keyCode == 37)
    {
        gameChar.isLeft = false;
    }
    
    else if (keyCode == 39)
    {
        gameChar.isRight = false;
    }
}

//------------------------------THE GAME CHARACTER OBJECT----------------------------//

gameChar = {
    x: 200,
    y: floorPos_y,
    isLeft: false,
    isRight: false,
    isFalling: false,
    isPlummeting: false,
    onPlatform: false,
    
    //-----------Control the game character functions-------------------//
    
    move: function()
    {
        // Logic to make the game character rise and fall
    
        //if player jumps or is on the floor check whether they are on the platfrom
        if (this.y <= floorPos_y)
        {
            this.onPlatform = false;
            
            //check contact for each platform
            for (var i = 0; i < platforms.length; i++)
            {
                if(checkContact(gameChar_world_x, this.y, platforms[i].x, platforms[i].y, platforms[i].length))
                {
                    this.onPlatform = true;
                    break;
                }   
            }
            
            //check whether the player is on the last platform - the one with the portal
            if (this.y - flagpole.y_pos < 5 && this.y - flagpole.y_pos > 0 && gameChar_world_x >= flagpole.x_platform)
            {
                this.onPlatform = true;
            }
            
            if (this.onPlatform)
            {
                this.isFalling = false;
            }
            else
            {
                this.isFalling = true;
                this.y += 3;
            }
        }
        //if the player is not on platform and lower than the floor => they plummet
        else if(this.y > floorPos_y && this.onPlatform == false)
        {
            this.isPlummeting = true;
            this.y += 15;
        }
        else
        {
            this.isFalling = false;
        };
        
        // Logic to make the game character move or the background scroll
        if(this.isLeft)
        {
            if(this.x > width * 0.2)
            {
                this.x -= 5;
            }
            else
            {
                scrollPos += 5;
            }
        }

        if(this.isRight)
        {
            if(this.x < width * 0.8)
            {
                this.x += 5;
            }
            else
            {
                scrollPos -= 5; // negative for moving against the background
            }
        }
    },
    
    draw: function()
    {
        noStroke();
        
        //Control the drawing of the game character
        if (this.isLeft && this.isFalling)
        {
            this.jumpLeftDraw();
        }
        else if(this.isRight && this.isFalling)
        {
            this.jumpRightDraw();
        }
        else if(this.isLeft)
        {
            this.walkLeftDraw();
        }
        else if(this.isRight)
        {
            this.walkRightDraw();
        }
        else if(this.isFalling || this.isPlummeting)
        {
            this.frontJumpDraw();
        }
        else
        {
            this.frontDraw();
        }
    },
    
    // ---------------- Separate drawing functions ----------------------//
    jumpLeftDraw: function(){
        noStroke();
        
        //fire from the rockets
        fill(0, 206, 209);
        beginShape();
        vertex(this.x+18, this.y-7);
        vertex(this.x+26, this.y+10);
        vertex(this.x+18, this.y+6);
        vertex(this.x+10, this.y+10);
        vertex(this.x+18, this.y-7);
        endShape();
        
        //rocket
        fill(192, 192, 192)//silver
        triangle(this.x+15, this.y-34,
                 this.x+22, this.y-6,
                 this.x+13, this.y-6)
        
        //backpack
        fill(0, 206, 209)//DarkTorquioise
        rect(this.x-2,
             this.y-48,
             23, 28, 6);
        
        //head
        fill(211, 211, 211); //lightGray
        rect(this.x-17, 
                this.y-95, 
                34, 49, 15);
        
        //ears
        fill(0, 206, 209);//DarkTorquioise
        ellipse(this.x+8,
             this.y-73,
             13, 17)
        
        //eye shield
        fill(72, 61, 139); //darkSlateBlue
        rect(this.x-20,
             this.y-88,
             19, 36, 10); 
        
        //highlight
        fill(255);
        ellipse(this.x-13,
                this.y-77,
                4, 10)
        ellipse(this.x-13,
                this.y-68,
                3, 4)
        
        //right arm
        fill(230);
        ellipse(this.x-8,
                this.y-33,
                20, 12); 
        
        //right foot
        fill(119, 136, 153); //lightSlateGray
        ellipse(this.x-11,
            this.y-7,
            17, 13);
        
        //body
        fill(211, 211, 211); //lightGray
        rect(this.x-13, 
                this.y-47, 
                24, 38, 12);
        
        //front bod
        fill(119, 136, 153, 150)//lightSlateGray
        rect(this.x-13, 
             this.y-40, 
             6, 16, 5);
        
        //backpack straps
        fill(112, 128, 144) //SlateGray
        rect(this.x-1,
             this.y-41,
             9, 15, 10);
        
        //left arm
        fill(230);
        ellipse(this.x+2,
                this.y-32,
                16, 12);

        //left foot
        fill(119, 136, 153); //lightSlateGray
        ellipse(this.x+4,
            this.y-7,
            14, 15);
    },
    
    jumpRightDraw: function (){
        
        //fire from the rockets
        fill(0, 206, 209);
        beginShape();
        vertex(this.x-18, this.y-7);
        vertex(this.x-26, this.y+10);
        vertex(this.x-18, this.y+6);
        vertex(this.x-10, this.y+10);
        vertex(this.x-18, this.y-7);
        endShape();
        
        //rocket
        fill(192, 192, 192)//silver
        triangle(this.x-15, this.y-34,
                 this.x-22, this.y-6,
                 this.x-13, this.y-6);
        
        //backpack
        fill(0, 206, 209)//DarkTorquioise
        rect(this.x-21,
             this.y-48,
             23, 28, 6);
        
        //head
        fill(211, 211, 211); //lightGray
        rect(this.x-17, 
                this.y-95, 
                34, 49, 15);
        
        //ears
        fill(0, 206, 209);//DarkTorquioise
        ellipse(this.x-8,
             this.y-73,
             13, 17)
        
        //eye shield
        fill(72, 61, 139); //darkSlateBlue
        rect(this.x+1,
             this.y-88,
             19, 36, 10); 
        
        //highlight
        fill(255);
        ellipse(this.x+13,
                this.y-77,
                4, 10)
        ellipse(this.x+13,
                this.y-68,
                3, 4)
        
        //left arm
        fill(230);
        ellipse(this.x+8,
                this.y-33,
                20, 12); 
        
        //left foot
        fill(119, 136, 153); //lightSlateGray
        ellipse(this.x+11,
            this.y-7,
            17, 13);
        
        //body
        fill(211, 211, 211); //lightGray
        rect(this.x-13, 
                this.y-47, 
                24, 38, 12);
        
        //front bod
        fill(119, 136, 153, 150)//lightSlateGray
        rect(this.x+5, 
             this.y-40, 
             6, 16, 5);
        
        //backpack straps
        fill(112, 128, 144) //SlateGray
        rect(this.x-8,
             this.y-41,
             9, 13, 10);
        
        //right arm
        fill(230);
        ellipse(this.x,
                this.y-32,
                16, 12);

        //right foot
        fill(119, 136, 153); //lightSlateGray
        ellipse(this.x-4,
            this.y-7,
            14, 15); 
    },
    
    walkLeftDraw: function (){
        
        //rocket
        fill(192, 192, 192)//silver
        triangle(this.x+15, this.y-34,
                 this.x+22, this.y-6,
                 this.x+13, this.y-6)
        
        //backpack
        fill(0, 206, 209)//DarkTorquioise
        rect(this.x-2,
             this.y-48,
             23, 28, 6);
        
        //head
        fill(211, 211, 211); //lightGray
        rect(this.x-17, 
                this.y-95, 
                34, 49, 15);
        
        //ears
        fill(0, 206, 209);//DarkTorquioise
        ellipse(this.x+8,
             this.y-73,
             13, 17)
        
        //eye shield
        fill(72, 61, 139); //darkSlateBlue
        rect(this.x-20,
             this.y-88,
             19, 36, 10); 
        
        //highlight
        fill(255);
        ellipse(this.x-13,
                this.y-77,
                4, 10)
        ellipse(this.x-13,
                this.y-68,
                3, 4)
        
        //left arm
        fill(230);
        ellipse(this.x-8,
                this.y-33,
                18, 14); 
        
        //left foot
        fill(119, 136, 153); //lightSlateGray
        arc(this.x-11,
            this.y-7,
            15, 14,
            (4/5)*PI, 
            2*PI+(1/5)*PI, 
            CHORD);
        
        //body
        fill(211, 211, 211); //lightGray
        rect(this.x-13, 
                this.y-47, 
                24, 38, 12);
        
        //front bod
        fill(119, 136, 153, 150)//lightSlateGray
        rect(this.x-13, 
             this.y-40, 
             6, 16, 5);
        
        //backpack straps
        fill(112, 128, 144) //SlateGray
        rect(this.x-1,
             this.y-41,
             9, 15, 10);
        
        //right arm
        fill(230);
        ellipse(this.x+2,
                this.y-32,
                10, 14);

        //right foot
        fill(119, 136, 153); //lightSlateGray
        arc(this.x+4,
            this.y-7,
            14, 16,
            (4/5)*PI, 
            2*PI+(1/5)*PI, 
            CHORD);
    },
    
    walkRightDraw: function(){
       
        //rocket
        fill(192, 192, 192)//silver
        triangle(this.x-15, this.y-34,
                 this.x-22, this.y-6,
                 this.x-13, this.y-6)
        
        //backpack
        fill(0, 206, 209)//DarkTorquioise
        rect(this.x-21,
             this.y-48,
             23, 28, 6);
        
        //head
        fill(211, 211, 211); //lightGray
        rect(this.x-17, 
                this.y-95, 
                34, 49, 15);
        
        //ears
        fill(0, 206, 209);//DarkTorquioise
        ellipse(this.x-8,
             this.y-73,
             13, 17)
        
        //eye shield
        fill(72, 61, 139); //darkSlateBlue
        rect(this.x+1,
             this.y-88,
             19, 36, 10); 
        
        //highlight
        fill(255);
        ellipse(this.x+13,
                this.y-77,
                4, 10)
        ellipse(this.x+13,
                this.y-68,
                3, 4)
        
        //left arm
        fill(230);
        ellipse(this.x+6,
                this.y-33,
                18, 14); 
        
        //left foot
        fill(119, 136, 153); //lightSlateGray
        arc(this.x+11,
            this.y-7,
            15, 14,
            (4/5)*PI, 
            2*PI+(1/5)*PI, 
            CHORD);
        
        //body
        fill(211, 211, 211); //lightGray
        rect(this.x-13, 
                this.y-47, 
                24, 38, 12);
        
        //front bod
        fill(119, 136, 153, 150)//lightSlateGray
        rect(this.x+5, 
             this.y-40, 
             6, 16, 5);
        
        //backpack straps
        fill(112, 128, 144) //SlateGray
        rect(this.x-8,
             this.y-41,
             9, 15, 10);
        
        //right arm
        fill(230);
        ellipse(this.x-2,
                this.y-32,
                10, 14);

        //right foot
        fill(119, 136, 153); //lightSlateGray
        arc(this.x-4,
            this.y-7,
            14, 16,
            (4/5)*PI, 
            2*PI+(1/5)*PI, 
            CHORD);
    },
    
    frontJumpDraw: function(){
        
        //rocket
        fill(192, 192, 192)//silver
        triangle(this.x-15, this.y-34,
                 this.x-23, this.y-6,
                 this.x-13, this.y-6)
        
        triangle(this.x+15, this.y-34,
                 this.x+23, this.y-6,
                 this.x+13, this.y-6)
        
        //fire from the rockets - left one
        fill(0, 206, 209);
        beginShape();
        vertex(this.x-20, this.y-7);
        vertex(this.x-28, this.y+10);
        vertex(this.x-20, this.y+6);
        vertex(this.x-12, this.y+10);
        vertex(this.x-20, this.y-7);
        endShape();
        
        //fire from the rockets - right one
        fill(0, 206, 209);
        beginShape();
        vertex(this.x+20, this.y-7);
        vertex(this.x+28, this.y+10);
        vertex(this.x+20, this.y+6);
        vertex(this.x+12, this.y+10);
        vertex(this.x+20, this.y-7);
        endShape();
        
        //backpack
        fill(0, 206, 209)//DarkTorquioise
        rect(this.x-21,
             this.y-48,
             42, 28, 6);
        
        //ears
        fill(0, 206, 209);//DarkTorquioise
        arc(this.x-23,
             this.y-73,
             15, 17, PI/2, (3/2)*PI, CHORD)
        
        arc(this.x+23,
             this.y-73,
             15, 17, (3/2)*PI, PI/2, CHORD)
        
        //head
        fill(211, 211, 211); //lightGray
        rect(this.x-24, 
                this.y-95, 
                48, 49, 17);
        
        //eye shield
        fill(72, 61, 139); //darkSlateBlue
        rect(this.x-19,
             this.y-88,
             38, 36, 13); 
        
        //highlight
        fill(255);
        ellipse(this.x-9,
                this.y-75,
                4, 10)
        ellipse(this.x-9,
                this.y-66,
                3, 4)
        
        //backpack straps
        fill(112, 128, 144) //SlateGray
        rect(this.x-19,
             this.y-46,
             38, 18, 10)
        
        //body
        fill(211, 211, 211); //lightGray
        rect(this.x-16, 
                this.y-47, 
                32, 38, 12); 
        
        //front bod
        fill(119, 136, 153, 150)//lightSlateGray
        rect(this.x-12, 
             this.y-40, 
             24, 16, 5)
        
        //left foot
        fill(119, 136, 153); //lightSlateGray
        ellipse(this.x-10,
            this.y-7,
            14, 16);

        //right foot
        ellipse(this.x+10,
            this.y-7,
            14, 16); 
        
        //left arm
        fill(220);
        ellipse(this.x-23,
                this.y-33,
                18, 14);

        //right arm
        ellipse(this.x+23,
                this.y-33,
                18, 14);
    },
    
    frontDraw: function(){
        
        //rocket
        fill(192, 192, 192)//silver
        triangle(this.x-15, this.y-34,
                 this.x-23, this.y-6,
                 this.x-13, this.y-6)
        
        triangle(this.x+15, this.y-34,
                 this.x+23, this.y-6,
                 this.x+13, this.y-6)
        
        //backpack
        fill(0, 206, 209);//DarkTorquioise
        rect(this.x-21,
             this.y-48,
             42, 28, 6);
        
        //ears
        fill(0, 206, 209);//DarkTorquioise
        arc(this.x-23,
             this.y-73,
             15, 17, PI/2, (3/2)*PI, CHORD)
        
        arc(this.x+23,
             this.y-73,
             15, 17, (3/2)*PI, PI/2, CHORD)
        
        //head
        fill(211, 211, 211); //lightGray
        rect(this.x-24, 
                this.y-95, 
                48, 49, 17);
        
        //eye shield
        fill(72, 61, 139); //darkSlateBlue
        rect(this.x-19,
             this.y-88,
             38, 36, 13); 
        
        //highlight
        fill(255);
        ellipse(this.x-9,
                this.y-75,
                4, 10)
        ellipse(this.x-9,
                this.y-66,
                3, 4)
        
        //backpack straps
        fill(112, 128, 144) //SlateGray
        rect(this.x-19,
             this.y-46,
             38, 18, 10)
        
        //body
        fill(211, 211, 211); //lightGray
        rect(this.x-16, 
                this.y-47, 
                32, 38, 12); 
        
        //front bod
        fill(119, 136, 153, 150)//lightSlateGray
        rect(this.x-12, 
             this.y-40, 
             24, 16, 5)
        
       //left foot
        fill(119, 136, 153); //lightSlateGray
        arc(this.x-10,
            this.y-7,
            14, 16,
            (4/5)*PI, 
            2*PI+(1/5)*PI, 
            CHORD);

        //right foot
        arc(this.x+10,
            this.y-7,
            14, 16,
            (4/5)*PI, 
            2*PI+(1/5)*PI, 
            CHORD); 
        
        //left arm
        fill(220);
        ellipse(this.x-20,
                this.y-33,
                10, 14);

        //right arm
        ellipse(this.x+20,
                this.y-33,
                10, 14); 
    }
}

//---------------------------BACKGROUND RENDER FUNCTIONS-------------------------//

// Function to draw trees objects.
function drawTrees()
{
    var x_pos;
    var y_pos;
    
    // Draw trees.
    for (var i = 2; i < trees.length; i++)
    {
        x_pos = trees[i].x_pos;
        y_pos = trees[i].y_pos;
        
        // Don't draw trees on various platforms
        if (i % 3 == 0 || i % 4 == 0)
        {
            continue;
        }
        
        // Alternate between two different trees
        if (i % 2)
        {
            // Trunk and branches
            fill(0, 0, 90); //NavyBlue
            triangle(x_pos-25,
                     y_pos,
                     x_pos,
                     y_pos-125,
                     x_pos+25,
                     y_pos);
            stroke(0, 0, 90);
            strokeWeight(3);
            line(x_pos,
                 y_pos-112,
                 x_pos-35,
                 y_pos-140);
            line(x_pos,
                 y_pos-110,
                 x_pos+35,
                 y_pos-135);
            line(x_pos,
                 y_pos-119,
                 x_pos-17,
                 y_pos-160);

            // Treetop
            noStroke();

            fill(255, 20, 147); //DeepPink
            ellipse(x_pos+42, y_pos-182, 36, 36)

            fill(255, 20, 147); //DeepPink
            rect(x_pos-55, y_pos-180, 35, 35, 7);

            fill(255, 90, 180); //HotPink
            rect(x_pos-65, y_pos-160, 45, 45, 7);
            rect(x_pos+32, y_pos-167, 55, 50, 7);

            fill(255, 170, 193); //LightPink
            rect(x_pos-32, y_pos-208, 58, 80, 7);
            rect(x_pos+50, y_pos-185, 42, 38, 7);

            fill(255, 90, 180); //HotPink
            rect(x_pos+45, y_pos-188, 24, 24, 7);

            fill(219, 112, 147) //PaleVioletRed
            rect(x_pos+18, y_pos-180, 35, 35, 7);
        }
        else
        {
            //Trunk
            fill(196, 161, 196);
            strokeJoin(ROUND);
            beginShape();
            vertex(x_pos, y_pos);
            bezierVertex(x_pos-40, y_pos-11,
                         x_pos-32, y_pos-55,
                         x_pos, y_pos-120);
            endShape();
            
            beginShape();
            vertex(x_pos, y_pos);
            bezierVertex(x_pos+40, y_pos-11,
                         x_pos+32, y_pos-55,
                         x_pos, y_pos-120);
            endShape();
            
            //Bottom line
            push();
            noStroke();
            fill(50, 40, 100);
            rect(x_pos-22, y_pos-8, 44, 8, 3);
            stroke(32, 31, 69);
            strokeWeight(3);
            strokeCap(ROUND);
            line(x_pos-22, y_pos-8, x_pos+22, y_pos-8);
            pop();
            
            //Treetop
            noStroke();
            fill(218, 112, 214);
            ellipse(x_pos-5, y_pos-184, 50, 54);
            
            fill(106, 90, 205);
            ellipse(x_pos+26, y_pos-175, 62, 54);
            
            fill(75, 0, 130);
            ellipse(x_pos-24, y_pos-174, 51, 44);
            
            fill(218, 112, 214);
            ellipse(x_pos+18, y_pos-160, 43, 43);
            
            fill(128, 0, 128);
            ellipse(x_pos-18, y_pos-129, 54, 63);
            
            fill(128, 0, 128);
            ellipse(x_pos+41, y_pos-145, 43, 38);
            
            fill(106, 90, 205);
            ellipse(x_pos+24, y_pos-124, 62, 54);
            
            //White points
            fill(230, 230, 250);
            ellipse(x_pos+32, y_pos-124, 6, 6);
            ellipse(x_pos+61, y_pos-147, 7, 7);
            ellipse(x_pos+53, y_pos-162, 7, 7);
            ellipse(x_pos+26, y_pos-159, 6, 6);
            ellipse(x_pos+7, y_pos-147, 5, 5);
            ellipse(x_pos-6, y_pos-159, 6, 6);
            ellipse(x_pos-46, y_pos-185, 7, 7);
            ellipse(x_pos-33, y_pos-104, 8, 8);
            ellipse(x_pos-36, y_pos-155, 7, 7);
            ellipse(x_pos-41, y_pos-147, 2, 2);
            ellipse(x_pos+48, y_pos-185, 5, 5);
            ellipse(x_pos+34, y_pos-200, 5, 5);
            ellipse(x_pos+2, y_pos-178, 6, 6);
            ellipse(x_pos-22, y_pos-125, 3, 3);
            ellipse(x_pos+22, y_pos-173, 4, 4);
            ellipse(x_pos-19, y_pos-180, 3, 3);
            ellipse(x_pos-10, y_pos-205, 4, 4);
        }
    }
}

//-----------------------COLLECTABLE RENDER AND CHECK FUNCTIONS---------------------//

// Function to draw collectable objects

function drawCollectable(t_collectable)
{
    
    if (t_collectable.worth == 2) //Draw pink one
    {
        stroke(245, 150, 217);
        strokeWeight(0.6);
        
        strokeJoin(BEVEL);
        noStroke();
        
        //top left triangle
        fill(235, 85, 170);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale), 
                 t_collectable.x_pos-(24 * t_collectable.scale), //low left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //low right point
                 t_collectable.y_pos-(20 * t_collectable.scale));
        
        //bottom left triangle
        fill(210, 89, 163);
        triangle(t_collectable.x_pos-(24 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale)) //bottom point
        
        //middle top triangle
        fill(249, 121, 215);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //low left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //low right point
                 t_collectable.y_pos-(20 * t_collectable.scale))
        
        //middle bottom triangle
        fill(220, 100, 183);
        triangle(t_collectable.x_pos-(8 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale))//bottom point
        
        //top right triangle
        fill(255, 160, 240);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //bottom left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(24 * t_collectable.scale), //bottom right point
                 t_collectable.y_pos-(20 * t_collectable.scale));
        
        //bottom right triangle
        fill(245, 132, 217);
        triangle(t_collectable.x_pos+(8 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(24 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale)) //bottom point
        
        // Add the sparkles 
        stroke(255);
        strokeWeight(3);
        point(t_collectable.x_pos-11, 
              t_collectable.y_pos-30);
        point(t_collectable.x_pos+14, 
              t_collectable.y_pos-10);

        
    }
    else if (t_collectable.worth == 1) //Draw blue one
    {
        stroke(173, 183, 201);
        strokeWeight(0.6);
        
        strokeJoin(BEVEL);
        noStroke();
        
        //top left triangle
        fill(120, 190, 230);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale), 
                 t_collectable.x_pos-(24 * t_collectable.scale), //low left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //low right point
                 t_collectable.y_pos-(20 * t_collectable.scale));
        
        //bottom left triangle
        fill(110, 175, 210);
        triangle(t_collectable.x_pos-(24 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale)) //bottom point
        
        //middle top triangle
        fill(135, 206, 250);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //low left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //low right point
                 t_collectable.y_pos-(20 * t_collectable.scale))
        
        //middle bottom triangle
        fill(120, 195, 235);
        triangle(t_collectable.x_pos-(8 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale))//bottom point
        
        //top right triangle
        fill(180, 200, 230);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //bottom left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(24 * t_collectable.scale), //bottom right point
                 t_collectable.y_pos-(20 * t_collectable.scale));
        
        //bottom right triangle
        fill(145, 183, 215);
        triangle(t_collectable.x_pos+(8 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(24 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale)) //bottom point
       
        // Add sparkles
        stroke(255);
        strokeWeight(3);
        point(t_collectable.x_pos-13, 
              t_collectable.y_pos-35);
        point(t_collectable.x_pos+14, 
              t_collectable.y_pos-11);

    }
    else if (t_collectable.worth == 3) //Draw green one
    {
        stroke(175, 238, 238);
        strokeWeight(0.6);
        
        strokeJoin(BEVEL);
        noStroke();
        
        //top left triangle
        fill(32, 178, 170);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale), 
                 t_collectable.x_pos-(24 * t_collectable.scale), //low left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //low right point
                 t_collectable.y_pos-(20 * t_collectable.scale));
        
        //bottom left triangle
        fill(0, 139, 139);
        triangle(t_collectable.x_pos-(24 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale)) //bottom point
        
        //middle top triangle
        fill(30, 210, 190);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale),
                 t_collectable.x_pos-(8 * t_collectable.scale), //low left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //low right point
                 t_collectable.y_pos-(20 * t_collectable.scale))
        
        //middle bottom triangle
        fill(15, 165, 159);
        triangle(t_collectable.x_pos-(8 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale))//bottom point
        
        //top right triangle
        fill(88, 234, 228);
        triangle(t_collectable.x_pos, //top point
                 t_collectable.y_pos-(45 * t_collectable.scale),
                 t_collectable.x_pos+(8 * t_collectable.scale), //bottom left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(24 * t_collectable.scale), //bottom right point
                 t_collectable.y_pos-(20 * t_collectable.scale));
        
        //bottom right triangle
        fill(50, 193, 188);
        triangle(t_collectable.x_pos+(8 * t_collectable.scale), //top left point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos+(24 * t_collectable.scale), //top right point
                 t_collectable.y_pos-(20 * t_collectable.scale),
                 t_collectable.x_pos,
                 t_collectable.y_pos+(5 * t_collectable.scale)) //bottom point
        
        // Add sparkles
        stroke(255);
        strokeWeight(3);

            point(t_collectable.x_pos+(14 * t_collectable.scale), 
                  t_collectable.y_pos-(30 * t_collectable.scale));
            point(t_collectable.x_pos-(14 * t_collectable.scale), 
                  t_collectable.y_pos-(10* t_collectable.scale));
    }
}

// Function to check character has collected an item
function checkCollectable(t_collectable)
{
    // Collectable is found when character is in range
    if (dist(gameChar_world_x,
             gameChar.y,
             t_collectable.x_pos,
             t_collectable.y_pos) <= 50 * t_collectable.scale)
    {
        t_collectable.isFound = true;
        game_score += t_collectable.worth;
    }
}

//------------------------FLAGPOLE RENDERING AND CHECKING FUNCTIONS------------------//

// Function to render the portal - the flagpole
function renderFlagpole()
{
    push();
    
    // Draw the bottom
    noStroke();
    fill(200, 200, 220);
    rect(flagpole.x_pos-23, flagpole.y_pos-8, 49, 8);
    stroke(100, 20, 200);
    line(flagpole.x_pos-23, flagpole.y_pos-8, flagpole.x_pos+25, flagpole.y_pos-8)
    
    // Draw the 'antenna'
    strokeWeight(2);
    //Front
    stroke(220);
    line(flagpole.x_pos+20, flagpole.y_pos-140, flagpole.x_pos+32, flagpole.y_pos-160);
    line(flagpole.x_pos-22, flagpole.y_pos-34, flagpole.x_pos-30, flagpole.y_pos-20);
    
    // Shadows
    stroke(50, 50);
    line(flagpole.x_pos+21, flagpole.y_pos-139, flagpole.x_pos+33, flagpole.y_pos-159);
    line(flagpole.x_pos-21, flagpole.y_pos-33, flagpole.x_pos-29, flagpole.y_pos-19)
    
    noStroke();
    //Front
    fill(220);
    ellipse(flagpole.x_pos+32, flagpole.y_pos-160, 12);
    ellipse(flagpole.x_pos-30, flagpole.y_pos-20, 8);
    
    // Shadows
    fill(50, 50);
    ellipse(flagpole.x_pos+33, flagpole.y_pos-159, 11);
    ellipse(flagpole.x_pos-29, flagpole.y_pos-19, 8);
    
    // Draw the portal
    noStroke();
    //back shadow
    fill(180, 20, 190);
    ellipse(flagpole.x_pos+3, flagpole.y_pos-85, 64, 152)
    
    //front
    fill(255, 30, 255);
    ellipse(flagpole.x_pos, flagpole.y_pos-85, 60, 150);
    
    //inner shadow
    fill(170, 50, 200, 189);
    ellipse(flagpole.x_pos, flagpole.y_pos-85, 45, 135);
    
    //inner shadow 2
    fill(120, 50, 200, 180);
    ellipse(flagpole.x_pos+1, flagpole.y_pos-85, 40, 131);
    
    //the void
    fill(20, 200);
    ellipse(flagpole.x_pos+3, flagpole.y_pos-84, 38, 130);
    
    //the light
    fill(120, 150, 230, 20);
    ellipse(flagpole.x_pos+8, flagpole.y_pos-84, 27, 115);
    
    //The platform for the portal
    noStroke();
    //Bottom
    fill(38, 0, 80);
    quad(flagpole.x_platform+8, flagpole.y_pos+25,
         flagpole.x_platform+190, flagpole.y_pos+25,
         flagpole.x_platform+220, height,
         flagpole.x_platform-30, height);
    
    //Middle
    fill(160, 10, 130);
    rect(flagpole.x_platform+2, flagpole.y_pos+6, 200-4, 20, 12);
        
    //Top
    fill(200, 100, 180);
    rect(flagpole.x_platform, flagpole.y_pos, 200, 15, 5);
    
    // Draw the portal when reached
    if (flagpole.isReached == true)
    {
        // Draw the portal when reached
        //Front - spheres
        fill(255, 60, 255);
        ellipse(flagpole.x_pos+32, flagpole.y_pos-160, 18);
        ellipse(flagpole.x_pos-30, flagpole.y_pos-20, 12);
        
        //back shadow
        fill(180, 20, 190);
        ellipse(flagpole.x_pos+3, flagpole.y_pos-85, 64, 152)

        //front wall
        fill(255, 30, 255);
        ellipse(flagpole.x_pos, flagpole.y_pos-85, 60, 150);
        
        // Get seconds as they pass
        var timer = second();
        
        // Make the portal glow every two seconds
        if (timer % 2)
        {
            //front wall flashing
            fill(255);
            ellipse(flagpole.x_pos, flagpole.y_pos-85, 60, 150);
        }
        
        //inner shadow
        fill(170, 50, 200, 189);
        ellipse(flagpole.x_pos, flagpole.y_pos-85, 45, 135);

        //inner shadow 2
        fill(120, 50, 200, 180);
        ellipse(flagpole.x_pos+1, flagpole.y_pos-85, 40, 131);

        //the void
        fill(20, 200);
        ellipse(flagpole.x_pos+3, flagpole.y_pos-84, 38, 130);

        //the light
        fill(120, 150, 230, 20);
        ellipse(flagpole.x_pos+8, flagpole.y_pos-84, 27, 115);
    }
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if (d<28)
    {
        flagpole.isReached = true;
    }
}

//---------------------- RENDER THE SCENERY OBJECTS FUNCTION ------------------------//
function renderScene()
{

    // Push the positions of the tree objects into the trees array
    for (var i = 0; i < platforms.length; i++)
    {
        trees.push({x_pos: platforms[i].x + platforms[i].length/2,
                y_pos: platforms[i].y});
    }
    
    //Object for crystals on the ground
    crystals = {
                positions: [],
                draw: function(xpos, ypos)
                        {
                            
                            fill(230, 80, 190);
                            stroke(150, 30, 150);
                            strokeWeight(0.5);
                            
                            //right crystal
                            beginShape();
                            vertex(xpos+4, ypos); //bottom middle point
                            vertex(xpos+9, ypos); //bottom right point
                            vertex(xpos+12, ypos-4); //top right point
                            vertex(xpos+10, ypos-8) //top point
                            vertex(xpos+6, ypos-8) //top left point
                            vertex(xpos+1, ypos); //bottom left point
                            vertex(xpos+4, ypos); //bottom middle point
                            endShape();
                            line(xpos+10, ypos-8, xpos+5, ypos-1);
                            
                            //middle crystal
                            fill(250, 80, 190);
                            stroke(180, 30, 150);
                            beginShape(TRIANGLE_FAN);
                            vertex(xpos-2, ypos-17); //middle point
                            vertex(xpos-3, ypos-25); //top point
                            vertex(xpos+8, ypos-11); //right point
                            vertex(xpos, ypos); //bottom point
                            vertex(xpos-9, ypos-12); //left point
                            vertex(xpos-3, ypos-25); //top point
                            endShape();
                            
                            //left crystal
                            fill(230, 80, 190);
                            stroke(150, 30, 150);
                            beginShape();
                            vertex(xpos-11, ypos-9); //top point
                            vertex(xpos-5, ypos-7); //right point
                            vertex(xpos-2, ypos-2); //bottom right point
                            vertex(xpos-5, ypos); //bottom middle point
                            vertex(xpos-8, ypos); //bottom left point
                            vertex(xpos-13, ypos-5); //left point
                            vertex(xpos-11, ypos-9); //top point
                            endShape();
                            line(xpos-11, ypos-9, xpos-5, ypos-1);
                            line(xpos-13, ypos-5, xpos-8, ypos-4);
                            line(xpos-5, ypos-7, xpos-8, ypos-4);
                            
                            //front crystal
                            fill(250, 80, 190);
                            stroke(180, 30, 150);
                            triangle(xpos-5, ypos, xpos+4, ypos, xpos-1, ypos-7);
                            fill(220, 80, 190);
                            triangle(xpos+4, ypos, xpos-1, ypos-7, xpos+6, ypos-3);
                        }
                }
    
    collectables = [{
        
        //worth 1 = blue; worth 2 = pink; worth 3 = green
        
                        //between second and third platform
                        x_pos: (platforms[2].x + platforms[1].x + platforms[1].length)/2, //middle point
                        y_pos: platforms[3].y - 60, //bottom point
                        scale: 1.1,
                        worth: 1,
                    },
                    
                    {
                        x_pos: platforms[3].x - 15, //middle point
                        y_pos: platforms[3].y - 120, //bottom point
                        scale: 0.8,
                        worth: 3,
                    },
                    
                    {
                        x_pos: platforms[5].x + platforms[5].length/2, //middle point
                        y_pos: platforms[5].y - 20, //bottom point
                        scale: 1.3,
                        worth: 1,
                    },
                    
                    {
                        x_pos: (platforms[7].x + platforms[6].x + platforms[6].length)/2, //middle point
                        y_pos: platforms[7].y - 130, //bottom point
                        scale: 0.9,
                        worth: 2,
                    },
                    
                    {
                        x_pos: (platforms[11].x + platforms[10].x + platforms[10].length)/2, //middle point
                        y_pos: platforms[10].y - 125, //bottom point
                        scale: 0.7,
                        worth: 3,
                    },
                    
                    {
                        x_pos: (platforms[14].x + platforms[14].length+9), //middle point
                        y_pos: platforms[14].y - 10, //bottom point
                        scale: 0.9,
                        worth: 2,
                    },
            
                    {
                        x_pos: (platforms[19].x + platforms[18].x + platforms[18].length)/2-10, //middle point
                        y_pos: platforms[19].y - 80, //bottom point
                        scale: 1,
                        worth: 1,
                    },
                    
                    {
                        x_pos: (platforms[19].x + platforms[18].x + platforms[18].length)/2+10, //middle point
                        y_pos: platforms[19].y - 130, //bottom point
                        scale: 0.8,
                        worth: 3,
                    },
                   ];  
    
    flagpole = {
        x_pos: 4700,
        x_platform: 4600,
        y_pos: floorPos_y-40,
        isReached: false
    }
}

// ----------------------------- PLATFORM FUNCTIONS ---------------------------------//

//Constructor for  the platforms
function Platform(xPos, yPos, length)
{
    this.x = xPos;
    this.y = yPos;
    this.length = length;
}

//Function for creating the platforms
function createPlatforms()
{
    //Push the first platform
    platforms.push(new Platform(120,
                                floorPos_y,
                                160));
    
    for (var i = 0; i < 19; i++)
    {
        
        //Push the rest of the platforms
        platforms.push(new Platform(250 + 220*i + round(random(50, 130)),
                                    floorPos_y - round(random(10, 70)),
                                    round(random(110, 190))));
    }
}

function drawPlatforms()
{
    for (var i = 0; i < platforms.length; i++)
    {
        noStroke();
        //Middle
        fill(160, 10, 130);
        rect(platforms[i].x+2, platforms[i].y+4, platforms[i].length-6, 20, 7);
        
        //Top
        fill(200, 100, 180);
        rect(platforms[i].x, platforms[i].y, platforms[i].length, 15, 7);
        
        //Bottom
        fill(38, 0, 80);
        beginShape();
        vertex(platforms[i].x+9, platforms[i].y+24); //top left point
        vertex(platforms[i].x+14, platforms[i].y+43);
        vertex(platforms[i].x+25, platforms[i].y+48);
        vertex(platforms[i].x+30, platforms[i].y+67);
        vertex(platforms[i].x+43, platforms[i].y+74);
        vertex(platforms[i].x+52, platforms[i].y+80);
        vertex(platforms[i].x+61, platforms[i].y+71);
        vertex(platforms[i].x+70, platforms[i].y+65);
        vertex(platforms[i].x+78, platforms[i].y+54);
        vertex(platforms[i].x+85, platforms[i].y+58);
        vertex(platforms[i].x+platforms[i].length-53, platforms[i].y+42);
        vertex(platforms[i].x+platforms[i].length-45, platforms[i].y+65);
        vertex(platforms[i].x+platforms[i].length-36, platforms[i].y+54);
        vertex(platforms[i].x+platforms[i].length-28, platforms[i].y+60);
        vertex(platforms[i].x+platforms[i].length-20, platforms[i].y+54);
        vertex(platforms[i].x+platforms[i].length-10, platforms[i].y+24);
        endShape();
    }
}

// Check whether the game character is on the platform
function checkContact(gc_x, gc_y, platform_x, platform_y, platform_length)
{
        if (gc_x > platform_x-10 && gc_x < platform_x+platform_length+10)
        {
            var d = platform_y - gc_y;
            if (d >= 0 && d < 3)
            {
                return true;
            }
        }
        return false;
}

//------------------------------GAME INITALISATION FUNCTION--------------------//

function startGame()
{	
    gameChar.x = 200;
	gameChar.y = floorPos_y;
    
    // Reset the game score
    game_score = 0;
    
    // Variable to control the background scrolling
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game world. Needed for collision detection
	gameChar_world_x = gameChar.x - scrollPos;

	// Boolean variables to control the movement of the game character
	gameChar.isLeft = false;
	gameChar.isRight = false;
	gameChar.isFalling = false;
	gameChar.isPlummeting = false;
    
    // Reset the collectables so that none are found
    for (var i = 0; i < collectables.length; i++)
    {
        collectables[i].isFound = false;
    }
    
    //Subtract one life each time game starts
    lives--;
}

// ------------------------- FUNCTION TO DRAW THE INFO ON THE SCREEN ------------------/
function renderInfo()
{
    fill(147, 112, 219, 80);
    rect(72, 51, 163, 133, 15);
    
    // Draw the score to the screen
    fill(255);
    text('Score: ' + game_score, 90, 80);
    textSize(18);
    
    //  Draw number of lives
    text("Lives remaining: ", 90, 110);
    
    for (var i = 0; i <= lives-1; i++)
    {
        image(live_pills, 90 + 100 * i/4, 115, 40, 60);
    }
}

////------------------- GAME OVER AND WINNING SCREEN FUNCTIONS -----------------------//
function winning()
{
    push();
    fill(238, 130, 238, 50);
    rect(0, 0, width, height);
    textSize(25);
    strokeWeight(2);
    stroke(62, 21, 90);
    fill(100, 70, 155, 210);
    rect(width/2-225, height/2-135, 520, 73);
    noStroke();
    fill(255);
    text("Level complete. Press space to continue.", width/2-190, height/2-90);
    pop();
};

function gameOver()
{
    push();
    fill(238, 130, 238, 50);
    rect(0, 0, width, height);
    textSize(25);
    strokeWeight(2);
    stroke(62, 21, 90);
    fill(100, 70, 155, 210);
    rect(width/2-225, height/2-135, 480, 73);
    noStroke();
    fill(255);
    text("Game over. Press space to continue.", width/2-190, height/2-90);
    pop();
};
