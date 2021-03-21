//This js file creates the sound in the game

//The file uses maxiExtras.js and maxiLib.js in order to sythesis the sounds

//The bases of the player's sound for each aura
var playerNoise = 0;
var noiseVal = 0;

function audioPlay()
{
    //audio will only output sound if the active scene is the gameplay one
    if(mng.isCurrent(Gameplay))
    {
        noiseVal += 0.01;
        var yellowPlayer = playerBrownNoise(0.25) * yellowSound.sinewave(392) * 0.25; //a bit more bearable
        var pinkPlayer = playerBrownNoise(0.25) * pinkSound.sinewave(329.63) * 0.25;
        var bluePlayer = playerBrownNoise(0.25) * blueSound.sinewave(261.63) * 0.25;
        var greenPlayer = playerBrownNoise(0.25) * greenSound.sinewave(440) * 0.25;

        var yellowOther = playerBrownNoise(0.25) * yellowSound.sinewave(392);
        var greenOther = playerBrownNoise(0.25) * greenSound.sinewave(440);
        var blueOther = playerBrownNoise(0.25) * greenSound.sinewave(261.63);
        var pinkOther = playerBrownNoise(0.25) * pinkSound.sinewave(329.63);

        //constantly check whether the player is interacting with others
        for(var i = 0; i < others.length; i++)
        {
            if(others[i].interact)
            {
                //PINK PLAYER
                if(player.aura == 'pink' && others[i].aura =='pink')
                {
                    this.output = (pinkPlayer + pinkOther)/2;
                }
                else if(player.aura == 'pink' && others[i].aura =='yellow')
                {
                    this.output = (pinkPlayer + yellowOther)/2;
                }
                else if(player.aura == 'pink' && others[i].aura =='blue')
                {
                    this.output = (pinkPlayer + blueOther)/2;
                }
                else if(player.aura == 'pink' && others[i].aura =='green')
                {
                    this.output = (pinkPlayer + greenOther)/2;
                }

                //YELLOW PLAYER
                else if(player.aura == 'yellow' && others[i].aura =='pink')
                {
                    this.output = (yellowPlayer + pinkOther)/2;
                }
                else if(player.aura == 'yellow' && others[i].aura =='yellow')
                {
                    this.output = (yellowPlayer + yellowOther)/2;
                }
                else if(player.aura == 'yellow' && others[i].aura =='blue')
                {
                    this.output = (yellowPlayer + blueOther)/2;
                }
                else if(player.aura == 'yellow' && others[i].aura =='green')
                {
                    this.output = (yellowPlayer + greenOther)/2
                }

                //BLUE PLAYER
                else if(player.aura == 'blue' && others[i].aura =='pink')
                {
                    this.output = (bluePlayer + pinkOther)/2;
                }
                else if(player.aura == 'blue' && others[i].aura =='yellow')
                {
                    this.output = (bluePlayer + yellowOther)/2;
                }
                else if(player.aura == 'blue' && others[i].aura =='blue')
                {
                    this.output = (bluePlayer + blueOther)/2;
                }
                else if(player.aura == 'blue' && others[i].aura =='green')
                {
                    this.output = (bluePlayer + greenOther)/2;
                }

                //GREEN PLAYER
                else if(player.aura == 'green' && others[i].aura =='pink')
                {
                    this.output = (greenPlayer + pinkOther)/2;
                }
                else if(player.aura == 'green' && others[i].aura =='yellow')
                {
                    this.output = (greenPlayer + yellowOther)/2;
                }
                else if(player.aura == 'green' && others[i].aura =='blue')
                {
                    this.output = (greenPlayer + blueOther)/2;
                }
                else if(player.aura == 'green' && others[i].aura =='green')
                {
                    this.output = (greenPlayer + greenOther)/2;
                }
                else
                {
                    this.output=0;
                }
                break; //stop checking if others are interacting when one is found to interact
            }
            else if (others[i].interact == false) //play just the player sounds based on the player's aura
            {
                if(player.aura == 'pink')
                {
                   this.output = pinkPlayer;
                }
                else if(player.aura == 'yellow')
                {
                   this.output = yellowPlayer;
                }
                else if(player.aura == 'green')
                {
                    this.output = greenPlayer;
                }
                else if(player.aura == 'blue')
                {
                    this.output = bluePlayer;
                }
            }
        }
    }
    else
    {
        this.output = 0;
    }
    
    //this.output = 0;
}

function playerBrownNoise(amp)
{
    playerNoise += random(-0.01, 0.01);
    playerNoise = min(playerNoise, amp);
    playerNoise = max(-amp, playerNoise);
    return playerNoise;
}

function interactBrownNoise(amp)
{
    interactNoise += random(-0.01, 0.01);
    interactNoise = min(interactNoise, amp);
    interactNoise = max(-amp, interactNoise);
    return interactNoise;
}