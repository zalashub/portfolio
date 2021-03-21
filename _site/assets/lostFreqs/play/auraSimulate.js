//This js file draws the aura smulation behind the characters

function Aura(xpos, ypos, colorR, colorG, colorB)
{
    colorMode(RGB);
    this.x = xpos;
    this.y = ypos;
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;
    
    this.xspeed = random(-0.5, 0.5);
    this.yspeed = random(-1, 0);
    
    this.alpha = 255;
    
    this.draw = function()
    {
        noStroke();
        fill(this.colorR, this.colorG, this.colorB, this.alpha);
        ellipse(this.x, this.y, 7);
    }
    
    this.update = function()
    {
        this.x += this.xspeed;
        this.y += this.yspeed;
        this.alpha -= 5;
    }
    
    this.dead = function()
    {
        if (this.alpha < 0)
        {
            return true;
        }
        else 
        {
            return false;
        }
        
        //will return true when the alpha < 0;
    }
    
}