//This js file contains the scene for when the user enters the information house
function About(){
    
    this.setup = function(){
        background(20, 20, 50);
    }
    
    this.draw = function(){
        
        fill(25,50,100);
        stroke(0,0,100);
        strokeWeight(4);
        rectMode(CENTER);
        rect(width/2, height/2, 700, 500, 15);
        
        textAlign(CENTER, CENTER);
        noStroke();
        textSize(20);
        fill(30);
        text("About", width/2, 100);
        textSize(16);
        fill(0);
        text("Lost Frequencies is a project created by two Creative Computing students in the 1st year module Creative Projects at Goldsmiths University. It is an interactive web-based program representing a speculative reality. Upon starting the game, the player enters a world without language, where the main form of communication are light and sounds emerging from interaction between the characters’ auras. Each person is characterised by the colour of their aura and the sound accompanying it, both of which are clearly visible to everyone. By stripping away verbal communication, the authors create a universal experience as the ‘language’ of sound is commonly understood. The user thus must learn to navigate the world relying on other perception abilities. Consequently, by neglecting the concept of personality and defining each person based on their aura alone, the user should discover the direct reflection of the real world in which people often judge each other based on stereotypes and outward appearance.", width/2, height/2, 630, 470);
        
      
        //displays the <p> so user can click to see the pdf
        document.getElementById("about-click").style.display="grid";
        
        //when clicked takes user to pdf
        document.getElementById("about-click").addEventListener("click", this.pdfShow);
        
        //change buttons to display or not
        document.getElementById("globeButton").style.display ="grid";
        document.getElementById("cameraButton").style.display = "none";
        document.getElementById("questionButton").style.display = "none";
        
        //if button clicked runs backToWorld function
        document.getElementById("globeButton").addEventListener("click",this.backToWorld);
    }
    
    //takes user back to gameplay
    this.backToWorld = function(){
        mng.showScene(Gameplay);
    }
    
    //opens pdf in another window
    this.pdfShow = function(){
        console.log('clicked');
        window.open("https://drive.google.com/file/d/1RLMNppe4hYI2lKhgloUsIMfOMNHATon-/view?usp=sharing");
    }
}