//This js file creates the users character in the game

var Player;
var player;
var playerAura = [];

//Constructor function for the player
function Player(x, y, aura, color)
{
    this.aura = aura;
    this.xpos = x;
    this.ypos = y;
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.interact = false;
    this.origColor = color;
    this.color = color;
    this.width = 30;

    this.createAura = function()
    {
        //Create the aura for the player
        for(var i = 0; i < 3; i++)
        {
            playerAura.push(new Aura(playerWorldPosX + random(-5, 5), 
                               playerWorldPosY + random(-5,10), 
                               this.color.levels[0],
                               this.color.levels[1],
                               this.color.levels[2]));
        }

        for(var i = playerAura.length-1; i >= 0; i--)
        {
            playerAura[i].update();
            playerAura[i].draw();

            if(playerAura[i].dead())
            {
                playerAura.splice(i, 1); //remove that aura particle
            }
        }
    }

    this.display = function()
    {
        if(this.interact)
        {
            tint(this.color);
        }
        else
        {
            noTint();
        }
        
        if(this.down)
        {
            //walk down animation
            if(this.aura == "pink")
            {
                animation(pinkDown, this.xpos, this.ypos);
            }
            else if(this.aura == 'green')
            {
                animation(greenDown, this.xpos, this.ypos);
            }
            else if(this.aura == 'blue')
            {
                animation(blueDown, this.xpos, this.ypos);
            }
            else if(this.aura == 'yellow')
            {
                animation(yellowDown, this.xpos, this.ypos);
            }
            
        }
        else if(this.up)
        {
            if(this.aura == "pink")
            {
                animation(pinkUp, this.xpos, this.ypos);
            }
            else if(this.aura == 'green')
            {
                animation(greenUp, this.xpos, this.ypos);
            }
            else if(this.aura == 'blue')
            {
                animation(blueUp, this.xpos, this.ypos);
            }
            else if(this.aura == 'yellow')
            {
                animation(yellowUp, this.xpos, this.ypos);
            }
        }
        else if(this.left)
        {
            if(this.aura == "pink")
            {
                animation(pinkLeft, this.xpos, this.ypos);
            }
            else if(this.aura == 'green')
            {
                animation(greenLeft, this.xpos, this.ypos);
            }
            else if(this.aura == 'blue')
            {
                animation(blueLeft, this.xpos, this.ypos);
            }
            else if(this.aura == 'yellow')
            {
                animation(yellowLeft, this.xpos, this.ypos);
            }
        }
        else if(this.right)
        {
            if(this.aura == "pink")
            {
                animation(pinkRight, this.xpos, this.ypos);
            }
            else if(this.aura == 'green')
            {
                animation(greenRight, this.xpos, this.ypos);
            }
            else if(this.aura == 'blue')
            {
                animation(blueRight, this.xpos, this.ypos);
            }
            else if(this.aura == 'yellow')
            {
                animation(yellowRight, this.xpos, this.ypos);
            }
        }
        else
        {
            //still
            imageMode(CENTER);
            if(this.aura == "pink")
            {
                image(pinkStill, this.xpos, this.ypos);
            }
            else if(this.aura == 'green')
            {
                image(greenStill, this.xpos, this.ypos);
            }
            else if(this.aura == 'blue')
            {
                image(blueStill, this.xpos, this.ypos);
            }
            else if(this.aura == 'yellow')
            {
                image(yellowStill, this.xpos, this.ypos);
            }
        }
    }

    this.move = function()
    {      
        var step = 3;
        
        //Control movement to the left
        if (this.left && 
            playerWorldPosX <= worldLeftEdge && 
            this.xpos > -cameraW/2 + this.width + 30 //on the left edge of the world
            ||
            this.left && 
            playerWorldPosX > worldRightEdge && 
            this.xpos <= cameraW/2 + this.width+step - 40) //right edge of the world
        {
            this.xpos -= step;
        }
        else if (this.left && 
                 playerWorldPosX > worldLeftEdge &&
                 playerWorldPosX < worldRightEdge) //inside the world
        {
            scrollPosX += step;
        }

        //Control movement to the right
        else if (this.right && 
                 playerWorldPosX >= worldRightEdge && 
                 this.xpos < cameraW/2 - this.width - 40 
                 || //right edge of the world
                 this.right && 
                 playerWorldPosX < worldLeftEdge && 
                 this.xpos >= -cameraW/2 + this.width-step + 30) //left edge of the world
        {
            this.xpos += step;
        }
        else if (this.right && playerWorldPosX > worldLeftEdge && playerWorldPosX < worldRightEdge) //inside the world
        {
            scrollPosX -= step;
        }

        //Control movement upwards
        if (this.up && playerWorldPosY <= worldTopEdge && this.ypos > -cameraH/2 + this.width-step + 51 //top edge of the world 
            || 
            this.up && 
            playerWorldPosY >= worldBottomEdge && 
            this.ypos <= cameraH/2 - this.width+step - 69) //bottom edge of the world
        {
            this.ypos -= step;
        }
        else if (this.up && playerWorldPosY > worldTopEdge && playerWorldPosY < worldBottomEdge) //inside the world
        {
            scrollPosY += step;
        }

        //Control movement downwards
        else if (this.down && 
                 playerWorldPosY <= worldTopEdge && 
                 this.ypos >= -cameraH/2 + this.width-step + 51 //top edge of the world
                 || 
                 this.down && 
                 playerWorldPosY >= worldBottomEdge && 
                 this.ypos < cameraH/2 - this.width+step - 69) //bottom edge of the world
        {
            this.ypos += step;
        }

        else if (this.down && playerWorldPosY > worldTopEdge && playerWorldPosY < worldBottomEdge) //inside the world
        {
            scrollPosY -= step;
        }

    }

    this.checkInsideCameraHorizontal = function()
    {
        if(playerWorldPosX > worldLeftEdge && playerWorldPosX < worldRightEdge)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    this.checkInsideCameraVertical = function()
    {
        if(playerWorldPosY > worldTopEdge && playerWorldPosY < worldBottomEdge)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}