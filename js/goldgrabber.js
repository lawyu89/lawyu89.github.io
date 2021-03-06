 // U3.W7: Design your own Code Combat Mission

// This is a solo challenge

// Your mission description: Collect all the coins and avoid traps
// Overall mission: Collect coins and avoid guards and traps
// Goals:Collect all coins without dying
// Characters: Player and Guards
// Objects: Coins
// Functions: moveUp, moveDown, moveLeft, moveRight

// Pseudocode
//Generate Character for player
//Generate board based on level (nested array for position)
//Randomly select location on board to place coins and traps
//Create move functions to allow player object to have different positions within board
//alert user when has completed mission or died

// Initial Code
function runGame() {
    //allow player to choose difficulty speed
    var speed=0;
    var level =prompt("Select Difficulty: Please enter 'normal', 'hard', or 'impossible'")
    if (level==='impossible') {
        speed=20;
    } else if (level==='hard'){
        speed=60;
    } else {
        speed=120;
    }
    var coinlocation=[]
    var coinsImg=document.getElementsByClassName('coin')
    var leprechaunsImg=document.getElementsByClassName('leprechaun');
    var playerImg=document.getElementById('playerImg');
    playerImg.style.top=0+'px';
    playerImg.style.left=0+'px';
    var i=0;
    //randomly generate coin locations
    while (i<coinsImg.length) {
        var h = Math.floor(Math.random()*29)*20;
        var v = Math.floor(Math.random()*29)*20;
        coinsImg[i].style.top=v+"px";
        coinsImg[i].style.left=h+"px";
        coinsImg[i].style.opacity="1";
        coinlocation[i]=[h,v]
        i++;
    }
    //randomly generate leprechaun starting locations
    leprechauns=document.getElementsByClassName('leprechaun')
    var i=0;
     while (i<leprechauns.length) {
        var h = Math.floor(Math.random()*28)*20+20;
        var v = Math.floor(Math.random()*28)*20+20;
        leprechauns[i].style.top=v+"px";
        leprechauns[i].style.left=h+"px";
        i++;
    }
    //store player and leprechaun objects to record location and status
    var player = {
        xCoord:0,
        yCoord:0,
        alive: true,
    }
    var leprechauns = [
        {name:"leprechaun1",xCoord:0,yCoord:0},
        {name:"leprechaun2",xCoord:0,yCoord:0},
        {name:"leprechaun3",xCoord:0,yCoord:0},
        {name:"leprechaun4",xCoord:0,yCoord:0},
        {name:"leprechaun5",xCoord:0,yCoord:0},
        {name:"leprechaun6",xCoord:0,yCoord:0},
        {name:"leprechaun7",xCoord:0,yCoord:0},
    ]
    //remove coin from display if player is on top of coin (set opacity to 0)
    //placed this check outside other setInteral function with a faster interval speed to avoid someone pressing an arrow button too quickly and not pick up coin.
    window.setInterval(function(){
        i=0
        while (i<coinlocation.length) {
            if (coinlocation[i][0]===player.xCoord && coinlocation[i][1]===player.yCoord){
                player.gold++;
                coinsImg[i].style.opacity="0";
            }
            i++;
        }
    },10);
    //create a setInterval function to move leprechauns based on selected speed so they move in real time.
    var movingAI=window.setInterval(function() { ai_movement()},speed);
    function ai_movement() {
        var i=0;
        var directions=['up','right','down','left'];
        while (i<leprechaunsImg.length){
            var leprechaunImgStyle=getComputedStyle(leprechaunsImg[i],null)
            lepx=parseInt(leprechaunImgStyle.left) || 20;
            lepy=parseInt(leprechaunImgStyle.top) || 20;
            goDir=directions[Math.floor(Math.random()*4)]
            if (goDir==='up') {
                if (lepy>=20) {
                    leprechaunsImg[i].style.top=(lepy-20)+"px";
                    leprechauns[i].yCoord=lepy-20;
                }
            }
            else if (goDir==='right') {
                if (lepx<=540) {
                    leprechaunsImg[i].style.left=(lepx+20)+"px";
                    leprechauns[i].xCoord=lepx+20;
                }
            }else if (goDir==='down') {
                if (lepy<=540) {
                    leprechaunsImg[i].style.top=(lepy+20)+"px";
                    leprechauns[i].yCoord=lepy+20;
                }
            }else if (goDir==='left') {
                if (lepx>=20){
                    leprechaunsImg[i].style.left=(lepx-20)+"px";
                    leprechauns[i].xCoord=lepx-20;
                }
            }
            //added the !=0 coordinates because player should be safe in house
            if (leprechauns[i].xCoord===player.xCoord && leprechauns[i].yCoord===player.yCoord && player.xCoord!==0 && player.yCoord!==0){
                player.alive=false
                stop_game()
                if (confirm("You've Been Caught! The Leprechaun Cast a Curse on You!!! \n\n Try Again?")) {
                    runGame();
                }
            }
            i++
        }
        //onkeydown function to allow player to move with arrow keys
        document.onkeydown = function movePlayer(direction) {
            var playerImgStyle=getComputedStyle(playerImg,null)
            playerx=parseInt(playerImgStyle.left) || 0;
            playery=parseInt(playerImgStyle.top) || 0;
            if (direction.keyCode===38 && player.alive===true) { //up
                if (playery>=20) {
                    playerImg.style.top=playery-20+"px";
                    player.yCoord=playery-20;
                }
            } else if (direction.keyCode===39 && player.alive===true) { //right
                if (playerx<=540) {
                    playerImg.style.left=(playerx+20)+"px";
                    player.xCoord=playerx+20;
                }
            } else if (direction.keyCode===40 && player.alive===true) { //down
                if (playery<=540) {
                    playerImg.style.top=(playery+20)+"px";
                    player.yCoord=playery+20;
                }
            } else if (direction.keyCode===37 && player.alive===true) { //left
                if (playerx>=20) {
                    playerImg.style.left=(playerx-20)+"px";
                    player.xCoord=playerx-20;
                }
            }
            if (player.xCoord===0 && player.yCoord===0) {
                if (missionComplete()===true){
                    player.alive=false
                    stop_game()
                    if (confirm("You win!!! Congratulations!!! \n\n Play Again?")) {
                        runGame();
                    }
                }
            }
            //if player returns to house, check if they collected all coins
            function missionComplete() {
                var complete=false;
                i=0;
                total=0
                while (i<coinsImg.length){
                    var coinsImgStyle=getComputedStyle(coinsImg[i],null);
                    total += parseInt(coinsImgStyle.opacity)
                    i++;
                }
                if (total<1){
                    complete=true;
                } else {
                    complete=false;
                }
                return complete;
            }
        }
    }
    //stop game from moving (gets called when player finishes mission or is caught)
    function stop_game() {
        clearTimeout(movingAI);
        movingAI=null;
    }
}


//prevent window screen from moving when arrow keys are pressed
window.addEventListener("keydown", function(e) {
    if([13,37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);







// Reflection
//
//
//
//
//
//
//
//