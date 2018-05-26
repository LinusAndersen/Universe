//this is the "planet" class
class Planet{
    constructor(name, color, size, mass, pos, dir){
        this.name = name;
        this.color = color;
        this.size = size;
        this.mass = mass;
        this.pos = pos;
        this.dir = dir;
        this.del = false;
    }
    show(){
        drawCircle(this.pos[0], this.pos[1], this.size, this.color);
        drawLine(this.pos, [this.pos[0] + this.dir[0] * vS, this.pos[1] + this.dir[1]*vS]);
        showText(this.pos, this.name + ":" + String(this.mass));
    }
    getForceOnMe(Planets){
        let force = null;
        for (let Planet of Planets){
            if (Planet != this){
                if (force == null){
                    force = getGVector(this.pos, Planet.pos, this.mass, Planet.mass,G);
                }
                else{
                    force = addVector(force, getGVector(this.pos, Planet.pos, this.mass, Planet.mass,G));
                }
            }
        }
        console.log(force);
        if (force == null){
            return (false);
        }
        else{
            return(force);
        }
    }
    checkCol(Planets){
        for (let Planet of Planets){
            if (Planet != this){
                if (circleCollision(this.pos, this.size, Planet.pos, Planet.size)){
                    if (Planet.mass >= this.mass){
                        Planet.dir = getHitForce(Planet.mass, Planet.dir, this.mass, this.dir);
                        Planet.mass += this.mass;
                        Planet.size = Math.sqrt((Math.pow(this.size,2) * Math.PI + Math.pow(Planet.size,2) * Math.PI)/Math.PI);
                        Planet.color = findAverageOfColors(this.color, Planet.color);
                        this.del = true;
                    }
                }
            }
        }
    }
    move(Planets){
        console.log(this.dir);
        console.log(this.getForceOnMe(Planets));
        if (this.getForceOnMe(Planets) != false){
            this.dir = addVector(this.dir,this.getForceOnMe(Planets));
        }
        
        this.pos[0] += this.dir[0];
        this.pos[1] += this.dir[1];
        this.checkCol(Planets);
        this.show();
    }
}

//Test
console.log(getHitForce(2,[1,0],1,[-2,0]));
console.log(multipliVector([3,10], 0.5))
//Variables
let canvas =  document.getElementById("c");
let ctx =canvas.getContext("2d");
let cW = canvas.width;
let cH = canvas.height;
let buttonRUp= document.createElement('buttonRUp');
const Gravity = .0000000000667
let G = 0.0005;
let V1 = [0,1];
let V2 = [1,0];
let planets = [];
let selectedPlanet = null;
let downClick = null;
let timeDownClick = null;
let vS = 10;
let sX = 0;
let sY = 0;
let scrollSpeed = 100;
let sWnR = 10;
let sWnM = 10
let sWnV = [2,0];
let isPause = true;
let mouseDownEV;
let cMousePos = [0,0];
let gameSpeed = 100;
//earth, moon, sun
universe = []
universe.push(new Planet("Mond","#7a7a7a",2,5,[50,520],[4,1]));
universe.push(new Planet("Erde","#04870a",20,100,[-50,550],[4,0]));
universe.push(new Planet("Sonne","#ffdd00",40,200,[0,0],[0,0]));

//setting planets at the start to the state: "universe"
planets = universe;

//this is the gameLoop
gameLoop();
function gameLoop(){
    gameSpeed = document.getElementById("gameSpeed").value;
    G = document.getElementById("Gravity").value;
    //follow planet
    if (selectedPlanet != null){
        followPlanet(selectedPlanet);
        if (selectedPlanet.del == true){
            selectedPlanet = null;
        }
    }
    clearCanvas();
    //move
    if (isPause==false){
        for (let Planet of planets){
            Planet.move(planets);
        }
    }
    //delete if theres a need
    for (let p = planets.length - 1;  p>=0; p--){
        if (planets[p].del){
            planets.splice(p,1);
        }
    }
    //sbow the planets
    for (let Planet of planets){
        Planet.show();
    }
    setTimeout(gameLoop, gameSpeed);
}
//a function for inverting the isPause
function pause(){
    if (isPause){
        isPause = false;
    }
    else{
        isPause = true;
    }
    console.log(isPause);
}
//edits the selected planet to inputvalues
function edit(){
    if (selectedPlanet != null){
        selectedPlanet.name = document.getElementById("name").value;
        selectedPlanet.color = document.getElementById("color").value;
        selectedPlanet.size = parseInt(document.getElementById("radiusI").value);
        selectedPlanet.mass = parseInt(document.getElementById("massI").value);
        selectedPlanet.dir = [parseInt(document.getElementById("SVX").value),parseInt(document.getElementById("SVY").value)];
    }
}
//sets the planets-array to [] (clears the sceane)
function clearAll(){
    console.log("hey");
    planets = [];
}
//sets the scoll so the Planet is followed
function followPlanet(Planet){
    sX = -(Planet.pos[0] - cW/2 );
    sY = -(Planet.pos[1] - cH/2);
}
//handles the keypress event
document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    //moves your relative center left
    if (charStr == "a"){
        sX += scrollSpeed;
    }
    //moves your relative center right
    if (charStr == "d"){
        sX -= scrollSpeed;
    }
    //moves your relative center up
    if (charStr == "w"){
        sY += scrollSpeed;
    }
    //moves your relative center down
    if (charStr == "s"){
        sY -= scrollSpeed;
    }
    //disselects the selected planet
    if (charStr == "q"){
        selectedPlanet = null;
    }
    //p pauses/stops the game, does the same as the button
    if (charStr == "p"){
        pause();
    }
    //x delets the selected planet
    if (charStr == "x"){
        if (selectedPlanet != null){
            selectedPlanet.del = true;
        }
    }
    //v edits the dir/velocity of the selected planet
    if (charStr == "v"){
        if (selectedPlanet != null){
            console.log("Hey");
            //mousePos-planetePos /vs
            selectedPlanet.dir = [((cMousePos[0] - sX) - selectedPlanet.pos[0])/vS,((cMousePos[1] - sY) - selectedPlanet.pos[1])/vS];
        }
    }

};

canvas.onmousemove = function (ev){
    cMousePos = [ev.clientX, ev.clientY];
}
//handles the mouse down event
canvas.onmousedown = function (ev){
    console.log("MouseDown");
    //saves object mouse over, current time and mouseDownEvent 
    downClick = getPlanet(ev);
    let Time = new Date();
    timeDownClick = Time.getTime();
    mouseDownEV = ev;
}
//handles the mouse up event
canvas.onmouseup = function (ev){
    console.log("MouseUp");
    let Time = new Date();
    console.log(Time.getTime() - timeDownClick);
    if (Time.getTime() - timeDownClick > 200){
        //means: the action was dragging
        if (downClick != null){
            //means: hoverd over planet on downclick
            //moves the downClick (the planet clicked down on)
            downClick.pos = [ev.clientX -sX, ev.clientY - sY];
        }
        else{
            //means: clicked on void on downclick
            //spawns a new planet with startvelocity as dragged
            spawnPlanet(ev,mouseDownEV);
        }
    }
    else{
        //means: the action was clicking
        if (downClick != null){
            //means: clicked on object
            if (selectedPlanet == null || selectedPlanet != downClick){
                //means: this planet isn't selected atm
                selectedPlanet = downClick;
            }
            else{
                //means: planet is already selected
                //copy the stats down
                document.getElementById("name").value = selectedPlanet.name;
                document.getElementById("color").value = selectedPlanet.color;
                document.getElementById("radiusI").value = selectedPlanet.size;
                document.getElementById("massI").value = selectedPlanet.mass;
                document.getElementById("SVX").value = selectedPlanet.dir[0];
                document.getElementById("SVY").value = selectedPlanet.dir[1];
            }
        }
        else{
            //means: clicked on void
            spawnPlanet(ev,false);
        }
    }
}
//returns the planet the mouse is over
//else returns void
function getPlanet(ev){
    for(let Planet of planets){
        if (circleCollision([ev.clientX - sX, ev.clientY - sY],10,Planet.pos, Planet.size)){
            return Planet;
        }
    }
    return null;
}
//spawns a planet on a given location, if you want with velocity
function spawnPlanet(ev,otherEV){
    sWnName = document.getElementById("name").value;
    sWnColor = document.getElementById("color").value;
    sWnR = parseInt(document.getElementById("radiusI").value);
    sWnM = parseInt(document.getElementById("massI").value);
    if (otherEV == false){
        sWnV = [parseInt(document.getElementById("SVX").value),parseInt(document.getElementById("SVY").value)];
    }
    else{
        sWnV = [(otherEV.clientX-ev.clientX)/vS, (otherEV.clientY-ev.clientY)/vS];
    }
    planets.push(new Planet(sWnName,sWnColor,sWnR,sWnM, [ev.clientX - sX, ev.clientY - sY], sWnV));
}
//clears the canvas
function clearCanvas(){
    canvas.width = canvas.width;
}
//draws a circle with radius r and a color c with the location (x,y)
function drawCircle(x,y,r,color){
    ctx.beginPath();
    ctx.arc(x + sX,y + sY,r,0,2*Math.PI, true);
    ctx.fillStyle=color;
    ctx.fill();
    ctx.fillStyle="#000000";
}
//draws a line between two positions
function drawLine(pos1,pos2){
    ctx.beginPath();
    ctx.moveTo(pos1[0] + sX,pos1[1] + sY);
    ctx.lineTo(pos2[0] + sX,pos2[1] + sY);
    ctx.stroke();
}
//shows a text (string) on a given position
function showText(pos, string){
    ctx.fillSyle="blue";
    ctx.textAlign="center"; 
    ctx.font="30px Georgia";
    ctx.fillText(string,pos[0] + sX,pos[1] + sY);
}
//checks for collision between two circles
function circleCollision(pos1,r1,pos2,r2){
    if (pythagoras(pos1[1]- pos2[1], pos1[0] - pos2[0]) > r1 + r2){
        return false;
    }
    else{
        return true;
    }
}
//adds two circles
function addVector(V1, V2){
    let nVec = [];
    for (let i = 0; i < V1.length; i++){
        nVec.push(V1[i] + V2[i]);
    }
    return (nVec);
}
//calculates the force the surviving planet has after collision 2 planets
function getHitForce(m1, forceVector1, m2, forceVector2){
    console.log(m1, forceVector1, m2, forceVector2);
    console.log(addVector(forceVector1,getVector(getDir(forceVector2[0], forceVector2[1]),(m2/m1) * pythagoras(forceVector2[0],forceVector2[1]))));
    return(addVector(forceVector1,getVector(getDir(forceVector2[0], forceVector2[1]),(m2/m1) * pythagoras(forceVector2[0],forceVector2[1]))));
}
//get gravitation comming from a planet with mass M! and radius r under considoration of the gravitational constant
function getg(G, M1, r){
    return((G * M1)/r*r);
}
//returns c given a and b in a² + b² = c³
function pythagoras(a,b){
    return(Math.sqrt(a*a+b*b));
}
//returns a vector given the direction and the force
function getVector(dir, force){
    return([Math.cos(dir) * force, Math.sin(dir) * force]);
}
//returns the direction of a given vector
function getDir(a,b){
    let dir = Math.atan2(b/pythagoras(a,b),a/pythagoras(a,b));
    return (dir);
}
//gets the vactor gravity pulls on a planet, given the planet and the other planet
function getGVector(pos1,pos2,m1,m2,G){
    return(getVector(getDir(pos2[0]-pos1[0], pos2[1] - pos1[1]),getg(G,m2,pythagoras(pos2[0]-pos1[0], pos2[1] - pos1[1]))));
}
function multipliVector(V, multiplicator){
    return([V[0] * multiplicator, V[1] * multiplicator]);
}
//converts a rgb-string to a hex-string
function rgbToHex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}
//converts a hex-string to a rgb-string
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
//finds the rgb-middle of 2 given colors
function findAverageOfColors(color1, color2){
    return(rgbToHex((hexToRgb(color1).r + hexToRgb(color2).r)/2, (hexToRgb(color1).g + hexToRgb(color2).g)/2, (hexToRgb(color1).b + hexToRgb(color2).b)/2));
}