//This js file creates the other characters in the game

//Character variables
var Other;

//Arrays for the aura particles
var othersAuraGreen = [];
var othersAuraPink = [];
var othersAuraBlue = [];
var othersAuraYellow = [];

//Constructor function for the other characters
function Other(xpos, ypos)
{
    this.xpos = xpos;
    this.ypos = ypos;
    this.origX = xpos;
    this.origY = ypos;
    this.aura = undefined;
    this.color = undefined;
    this.origColor = undefined;

    this.width = 30;
    this.height = 30;

    this.xmove = random(0.7);
    this.ymove = random(-0.7, -0.05);

    this.interact = false;
    this.distance;

    this.auraParticles = [];

    this.assignAura = function()
    {
        var auraIndex = floor(random(0, auraColours.length));
        var otherAuraName = auraColourNames[auraIndex];
        var otherAuraColour = auraColours[auraIndex];
        this.aura = otherAuraName;
        this.color = otherAuraColour;
        this.origColor = otherAuraColour;
    }

    this.createAura = function()
    {
        //Create the aura for the Other
        for(var i = 0; i < 2; i++)
        {
            this.auraParticles.push(new Aura(this.xpos + random(-5, 5), 
                               this.ypos + random(-5,10), 
                               this.color.levels[0],
                               this.color.levels[1],
                               this.color.levels[2]));
        }

        for(var i = this.auraParticles.length-1; i >= 0; i--)
        {
            this.auraParticles[i].update();
            this.auraParticles[i].draw();

            if(this.auraParticles[i].dead())
            {
                this.auraParticles.splice(i, 1); //remove that aura particle
            }
        }
    }

    this.draw = function()
    {
        imageMode(CENTER);
        
        if(this.interact)
        {
            tint(this.color);
        }
        else
        {
            noTint();
        }
        
        if(this.xmove >= 0 && this.xmove > this.ymove)
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
        else if(this.xmove <= 0 && this.xmove < this.ymove)
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
        
        else if(this.ymove >= 0 && this.xmove <= this.ymove)
        {
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
        else if(this.ymove <= 0 && this.xmove >= this.ymove)
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
           
        else
        {
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
        this.xpos += this.xmove;
        this.ypos += this.ymove;
        var border = 50;

        if(this.xpos >= this.origX + border)
        {
           this.xmove = random(-0.7, -0.05);
            
        }
        if(this.xpos < this.origX - border)
        {
           this.xmove = random(0.7);
        }
        if(this.ypos >= this.origY + border)
        {
           this.ymove = random(-0.7, -0.05);
        }
        if(this.ypos < this.origY - border)
        {
           this.ymove = random(0.7);
        }
    }

    this.checkInteraction = function()
    {
        var d = dist(this.xpos, this.ypos, playerWorldPosX, playerWorldPosY);
        this.distance = d;

        //if the player is close enough to others set the others' interact to true
        if (this.distance < 30)
        {
            this.interact = true;
        }
        else
        {
            this.interact = false;
        }
    }
}