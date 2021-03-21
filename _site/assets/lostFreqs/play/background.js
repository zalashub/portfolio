//This js file draws the background of the world

var houses = [];
var numHouse = 3;

var tempHouses = [];

function House(xpos, ypos, width, height, access, type)
{
    rectMode(CENTER);
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.access = access; //either true or false
    this.type = type || undefined;
    
    this.display = function()
    {
        rectMode(CENTER);
        strokeWeight(1);
        stroke(80);
        fill(300, 50, 70, 0.65);
        rect(this.xpos, this.ypos, this.width, this.height);
        
        //if want index of specific house
        fill(0);
        noStroke();
        textSize(18);
        text(houses.indexOf(this), this.xpos, this.ypos);
    }
    
    
    this.showIcons = function()
    {   
        if(this.type == 'info')
        {
            //info icon
            noStroke();
            fill(20, 0.5);
            ellipse(this.xpos, this.ypos - this.height/2 - mng.infoIcon.height/2, 45);
            image(mng.infoIcon, this.xpos, this.ypos - this.height/2 - mng.infoIcon.height/2);
        }
        
        if(this.type == 'camera')
        {
            //camera icon
            noStroke();
            fill(20, 0.5);
            ellipse(this.xpos, this.ypos - this.height/2 - mng.cameraIcon.height/2, 45);
            image(mng.cameraIcon, this.xpos, this.ypos - this.height/2 - mng.cameraIcon.height/2);
        }
    }
    
    this.run = function()
    {
        //this.display(); //used for checking the boudaries and the index
        this.showIcons();
        this.checkPlayer(player);
    }
    
    this.checkPlayer = function(player)
    {
        //calculate the distance between the player's position and the center of the house
        let trueD = dist(this.xpos, this.ypos, playerWorldPosX, playerWorldPosY);
        
        //get the diagonal of the house
        let diagonal = sqrt( pow(this.width/2, 2) + pow(this.height/2, 2) );

        //to count as overlapping, the distance between the player's position and the house must be <= player's width/2 (distance from player's central point to their edge) + the house's diagonal 
        let maxD = player.width/2 + diagonal;
        
        var leftEdge = this.xpos - this.width/2; 
        var rightEdge = this.xpos + this.width/2;
        var topEdge = this.ypos - this.height/2;
        var bottomEdge = this.ypos + this.height/2;
            
        let border = 3;
        
        if(this.access)//if the player can access the house, check whether they are inside of it
        {
            if(playerWorldPosX >= leftEdge && playerWorldPosX <= rightEdge && playerWorldPosY >= topEdge && playerWorldPosY <= bottomEdge && trueD <= maxD) //check whether they're inside
            {
                //if they can, call the this.enter function
               this.enter();
            }
        } 
        else
        {
           //if they can't, proceed to check from where they've arrived
            
            //determine from which side the player is coming from
            if(playerWorldPosX < leftEdge && playerWorldPosY < topEdge && trueD <= maxD)
            {
                console.log('COMING FROM TOP LEFT DIAGNOALLY');  
                if(player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    scrollPosX+=border;
                    scrollPosY+=border;
                }
                else if(player.checkInsideCameraHorizontal() && !player.checkInsideCameraVertical())
                {
                    scrollPosX+=border;
                    player.ypos-=border;
                }
                else if(!player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    player.xpos-=border;
                    scrollPosY+=border;
                }
                else
                {
                    player.xpos-=border;
                    player.ypos-=border;
                }

            }
            else if(playerWorldPosX < leftEdge && playerWorldPosY > bottomEdge && trueD <= maxD)
            {
                console.log('COMING FROM BOTTOM LEFT DIAGNOALLY');

                if(player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    scrollPosX+=border;
                    scrollPosY-=border;
                }
                else if(player.checkInsideCameraHorizontal() && !player.checkInsideCameraVertical())
                {
                    scrollPosX+=border;
                    player.ypos+=border;
                }
                else if(!player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    player.xpos-=border;
                    scrollPosY-=border;
                }
                else
                {
                    player.xpos-=border;
                    player.ypos+=border;
                }
            }
            else if(playerWorldPosX >= leftEdge-player.width/2-5 && playerWorldPosX <= leftEdge+player.width/2+5 && playerWorldPosY > topEdge && playerWorldPosY < bottomEdge)
            {
                console.log('COMING FROM LEFT');

                if(player.checkInsideCameraHorizontal())
                {
                    scrollPosX+=border;
                }
                else
                {
                    player.xpos-=border;
                }
            }
            else if(playerWorldPosY >= bottomEdge-player.width/2-5 && playerWorldPosY <= bottomEdge+player.width/2+5 && playerWorldPosX > leftEdge && playerWorldPosX < rightEdge)
            {
                console.log('COMING FROM THE BOTTOM');

                if(player.checkInsideCameraVertical())
                {
                    scrollPosY-=border;
                }
                else
                {
                    player.ypos+=border;
                }
            }
            else if(playerWorldPosX > rightEdge && playerWorldPosY > bottomEdge && trueD <= maxD)
            {
                console.log('COMING FROM BOTTOM RIGHT DIAGNOALLY');

                if(player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    scrollPosX-=border;
                    scrollPosY-=border;
                }
                else if(player.checkInsideCameraHorizontal() && !player.checkInsideCameraVertical())
                {
                    scrollPosX-=border;
                    player.ypos+=border;
                }
                else if(!player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    player.xpos+=border;
                    scrollPosY-=border;
                }
                else
                {
                    player.xpos+=border;
                    player.ypos+=border;
                }
            }
            else if(playerWorldPosX >= rightEdge-player.width/2-5 && playerWorldPosX <= rightEdge+player.width/2+5 && playerWorldPosY > topEdge && playerWorldPosY < bottomEdge)
            {
                console.log('COMING FROM RIGHT');

                //check only if inside in x direction
                if(player.checkInsideCameraHorizontal())
                {
                    scrollPosX-=border;
                }
                else
                {
                    player.xpos+=border;
                }
            }
            else if(playerWorldPosX > rightEdge && playerWorldPosY < topEdge && trueD <= maxD)
            {
                console.log('COMING FROM TOP RIGHT DIAGNOALLY');

                if(player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    scrollPosX-=border;
                    scrollPosY+=border;
                }
                else if(player.checkInsideCameraHorizontal() && !player.checkInsideCameraVertical())
                {
                    scrollPosX-=border;
                    player.ypos-=border;
                }
                else if(!player.checkInsideCameraHorizontal() && player.checkInsideCameraVertical())
                {
                    player.xpos+=border;
                    scrollPosY+=border;
                }
                else
                {
                    player.xpos+=border;
                    player.ypos-=border;
                }
            }
            else if(playerWorldPosY >= topEdge-player.width/2-5 && playerWorldPosY <= topEdge+player.width/2+5 && playerWorldPosX > leftEdge && playerWorldPosX < rightEdge)
            {
                console.log('COMING FROM THE TOP');

                if(player.checkInsideCameraVertical())
                {
                    scrollPosY+=border;
                }
                else
                {
                    player.ypos-=border;
                }
            }
        }
    }
    
    this.enter = function()
    {
        textSize(16);
        textAlign(CENTER, CENTER);
        
        if (this.type == "camera")
        {
            //Background
            fill(25,50,100);
            stroke(0,0,100);
            strokeWeight(4);
            rect(playerWorldPosX - 380/2, playerWorldPosY - 90/2 - 80, 380, 90, 15);
            
            //Text
            fill(0, 0, 100);
            noStroke();
            text('You have entered the camera house. To see your aura, press SPACE.', playerWorldPosX - 350/2, playerWorldPosY - 90/2 - 80, 350, 50);
            textSize(13);
            text('NOTE: this feature requires access to the camera.', playerWorldPosX - 350/2, playerWorldPosY - 90/2 - 28, 350, 30);
            
            //if space key is pressed
            if(keyIsPressed && keyCode == 32)
            {
                mng.showScene(AuraCamera);
            }
            
        }
        else if (this.type == "info")
        {
            //Background
            fill(25,50,100);
            stroke(0,0,100);
            strokeWeight(4);
            rect(playerWorldPosX - 380/2, playerWorldPosY - 90/2 - 80, 380, 85, 15);
            
            //Text
            fill(0, 0, 100);
            noStroke();
            text('You have entered the information house. To find out more about our project, press SPACE.', playerWorldPosX - 350/2, playerWorldPosY - 90/2 - 80, 350, 80);
            
            if(keyIsPressed && keyCode == 32)
            {
                //switch to about scene
                mng.showScene(About);
            }
        }        
    }
}

function createScenery()
{
    imageTopEdge = -worldH/2;
    imageLeftEdge = -worldW/2;

    tempHouses = [
    {   
        xpos: imageLeftEdge + 120,
        ypos: imageTopEdge + 590,
        width: 80,
        height: 75,
        acces: false
    },
    {
        xpos: imageLeftEdge + 196,
        ypos: imageTopEdge + 800,
        width: 110,
        height: 78,
        acces: false
    },
    {
        //the information house
        xpos: imageLeftEdge + 575,
        ypos: imageTopEdge + 1142,
        width: 259,
        height: 201,
        acces: true,
        type: 'info'
    },
    {
        xpos: imageLeftEdge + 795,
        ypos: imageTopEdge + 1130,
        width: 150,
        height: 177,
        acces: false
    },
    {
        xpos: imageLeftEdge + 779,
        ypos: imageTopEdge + 735,
        width: 138,
        height: 78,
        acces: false
    },
    {
        xpos: imageLeftEdge + 705,
        ypos: imageTopEdge + 1580,
        width: 175,
        height: 147,
        acces: false
    },
    {
        xpos: imageLeftEdge + 1110,
        ypos: imageTopEdge + 808,
        width: 91,
        height: 133,
        acces: false,
    },
    {
        xpos: imageLeftEdge + 1277,
        ypos: imageTopEdge + 1410,
        width: 200,
        height: 312,
        acces: false
    },
    {
        xpos: imageLeftEdge + 1479,
        ypos: imageTopEdge + 1475,
        width: 145,
        height: 103,
        acces: false
    },
    {
        xpos: imageLeftEdge + 1487,
        ypos: imageTopEdge + 396,
        width: 395,
        height: 236,
        acces: false
    },
    {
        xpos: imageLeftEdge + 1725,
        ypos: imageTopEdge + 937,
        width: 118,
        height: 128,
        acces: false
    },
    {
        //the camera house
        xpos: imageLeftEdge + 1882,
        ypos: imageTopEdge + 925,
        width: 151,
        height: 172,
        acces: true,
        type: "camera"
    },
    {
        xpos: imageLeftEdge + 2027,
        ypos: imageTopEdge + 933,
        width: 85,
        height: 125,
        acces: false,
    },
    {
        xpos: imageLeftEdge + 2204,
        ypos: imageTopEdge + 634,
        width: 242,
        height: 275,
        acces: false,
    }
    ];
    
    for(let temp of tempHouses)
    {
        houses.push(new House(temp.xpos, temp.ypos, temp.width, temp.height, temp.acces, temp.type));
    }
}

function drawScenery()
{
    colorMode(HSB);

    imageMode(CENTER);
    image(mng.worldMap, 0, 0);

    for(let house of houses)
    {
        house.run();
    }
}