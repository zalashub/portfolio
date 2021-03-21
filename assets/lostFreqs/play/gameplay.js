// This js file displays the game world 

var scrollPosX;
var scrollPosY;
var playerWorldPosX;
var playerWorldPosY;

//Character variables
var numOthers = 8;
var others = [];

var auraColours = [];
var auraColourNames = [];
var questionClicked = true;

function Gameplay() 
{
    colorMode(HSB); 
    
    this.setup = function()
    {
        colorMode(HSB);
        
        auraColours = [color(60, 100, 100), color(100, 100, 100), color(319, 58, 100), color(180, 100, 100)];
        auraColourNames = ['yellow', 'green', 'pink', 'blue'];
        
        //create the scene from background.js
        createScenery();
        
        //Create background objects from backgroundOLD.js - OLD
        //createBackgroundObjects();
        
        //Create the player object
        this.createPlayer();
        //Create the other character objects
        this.createOthers();
        
        //scrollPos starts in the middle of the screen
        scrollPosX = 0;
        scrollPosY = 0;
    }
    
    this.draw = function()
    {
        translate(width/2, height/2);
        background(55);
        
        //outside the push and pop, what's drawn stays in the same place and moves together with the 'camera' (if it doesn't use scollPos)
        //if it uses scrollPos it doesn't move with the camera
        
        // Update real position of the player for collision detection
        playerWorldPosX = player.xpos - scrollPosX;
        playerWorldPosY = player.ypos - scrollPosY;
        
        //if using scrollPos what's drawn always stays in the same position and moves together
        //what doesn't use scrollPos stays in it's position and doesn't move with the camera
        push();
        translate(scrollPosX, scrollPosY);
        
        //Draw the scene from the background.js
        drawScenery();
        
        //Draw the Other characters
        for(var i = 0; i < others.length; i++)
        {
            others[i].createAura();
            others[i].draw();
            others[i].move();
            others[i].checkInteraction();
        }
        
        //check interactions between Player and Others
        this.updateInteractionScene();
        //Create the Player's aura
        player.createAura();
        
        pop();
        
        //Move the player but only if there's no help pop up
        if(questionClicked==false)
        {
            player.move();
        }
        //Draw the player
        player.display();
    
        //changes the display of the html elements
        document.getElementById("about-click").style.display="none";
        document.getElementById("cameraButton").style.display= "none";
        document.getElementById("globeButton").style.display= "none";
        document.getElementById("questionButton").style.display= "grid";
        
        //when clicked actions this function
        document.getElementById("questionButton").addEventListener("click", this.questionShow);
        
        if(questionClicked==true)
        {
            fill(25,50,100);
            stroke(0,0,100);
            strokeWeight(4);
            rect(-200,-125,400,250,20);

            document.getElementById("close").style.display="block";
            document.getElementById("close").addEventListener("click", this.questionClose);
            textSize(24);
            noStroke();
            fill(0,0,100);
            text('How to Play', -75,-85);
            textSize(16);
            text('Use the arrow keys to move around the',-170,-45);
            text('board and explore your new world',-140,-25);
            textSize(24)
            text('What you can find',-110,25);
            textSize(16);
            text("Why not meet everyone? You can also enter", -175, 55);
            text("some of the houses. Take a look at", -150,75);
            text("what's waiting for you inside!", -140,95); 
        }
    }
    
    this.createPlayer = function()
    {
        var auraIndex = floor(random(0, auraColours.length));
        var playerAuraName = auraColourNames[auraIndex];
        var playerAuraColour = auraColours[auraIndex];
        
        player = new Player(0, 0, playerAuraName, playerAuraColour);
    }
    
    this.createOthers = function()
    {
        //create others with specified locations
        var othersTemp = 
        [
            {
                xpos: imageLeftEdge + 184,
                ypos: imageTopEdge + 240
            },
            {
                xpos: imageLeftEdge + 382,
                ypos: imageTopEdge + 538
            },
            {
                xpos: imageLeftEdge + 704,
                ypos: imageTopEdge + 505
            },
            {
                xpos: imageLeftEdge + 1084,
                ypos: imageTopEdge + 1696
            },
            {
                xpos: imageLeftEdge + 755,
                ypos: imageTopEdge + 1393
            },
            {
                xpos: imageLeftEdge + 1509,
                ypos: imageTopEdge + 855
            },
            {
                xpos: imageLeftEdge + 2056,
                ypos: imageTopEdge + 1182
            }
        ]
        
        for(let temp of othersTemp)
        {
            others.push( new Other(temp.xpos, temp.ypos) );
        }
        
        //assign each other a random aura
        for(var i = 0; i < others.length; i++)
        {   
            others[i].assignAura();
        }
    }

    this.keyPressed = function()
    {
        if(keyCode == 39)
        {
            player.right = true;
        }

        if(keyCode == 40)
        {
            player.down = true;
        }

        if(keyCode == 38)
        {
            player.up = true;
        }

        if(keyCode == 37)
        {
            player.left = true;
        }
        
    }

    this.keyReleased = function()
    {
        if(keyCode == 39)
        {
            player.right = false;
        }

        if(keyCode == 40)
        {
            player.down = false;
        }

        if(keyCode == 38)
        {
            player.up = false;
        }

        if(keyCode == 37)
        {
            player.left = false;
        }
    }

    //Functions that controls the change of sounds and auras when Player and Others interact
    this.updateInteractionScene = function()
    {
        colorMode(HSB);
        for (var i = 0; i < others.length; i++)
        {
            if (others[i].interact)
            {
                var tintAlpha = 0.7;
                if(others[i].aura == 'pink')
                {
                    //change the color
                    var lerpCol = lerpColor(others[i].origColor, player.origColor, 0.5);
                    lerpCol.setAlpha(tintAlpha);
                    
                    player.interact = true;
                    player.color = lerpCol;
                    others[i].color = lerpCol;
                }
                else if(others[i].aura == 'green')
                {
                    //change the color
                    var lerpCol = lerpColor(others[i].origColor, player.origColor, 0.5);
                    lerpCol.setAlpha(tintAlpha);

                    player.interact = true;
                    player.color = lerpCol;
                    others[i].color = lerpCol;
                }
                else if(others[i].aura == 'blue')
                {
                    //change the color
                    var lerpCol = lerpColor(others[i].origColor, player.origColor, 0.5);
                    lerpCol.setAlpha(tintAlpha);

                    player.interact = true;
                    player.color = lerpCol;
                    others[i].color = lerpCol;
                }
                else if(others[i].aura == 'yellow')
                {
                    //change the color
                    var lerpCol = lerpColor(others[i].origColor, player.origColor, 0.5);
                    lerpCol.setAlpha(tintAlpha);

                    player.interact = true;
                    player.color = lerpCol;
                    others[i].color = lerpCol;
                }
                break; //stop checking if others are interacting when one is found to interact
            }
            else //when not interacting
            {
                player.interact = false;
                //change colors to original colors
                player.color = player.origColor;
                others[i].color = others[i].origColor;
            }
        }
    }
    
    //functions for the information button in top corner
    this.questionShow = function(){
        questionClicked = true;
    }
    
    this.questionClose = function(){
        questionClicked = false;
        document.getElementById("close").style.display="none";
    }
    
}
    