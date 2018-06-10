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
    show(Planets){
        this.pos1 = [this.pos[0] + sX, this.pos[1] + sY];
        drawCircle(this.pos1[0], this.pos1[1], this.size, this.color);
        let rX = 0;
        let rY = 0;
        if (relativePlanet != null){
            rX = relativePlanet.dir[0];
            rY = relativePlanet.dir[1];
        }
        drawLine(this.pos1, [this.pos1[0] + (this.dir[0] - rX) * vS, this.pos1[1] + (this.dir[1] - rY) *vS], "0,0,0");
        showText(this.pos1, this.name + ":" + String(this.mass));
        this.showForceOnMe(Planets);
    }
    showForceOnMe(Planets){
        for (let planet of Planets){
            if (planet != this){
                if (detailedForce){
                    drawLine(this.pos1, [this.pos1[0] + (getGVector(this.pos, planet.pos, this.mass, planet.mass,G)[0]) * vSI, this.pos1[1] + (getGVector(this.pos, planet.pos, this.mass, planet.mass,G)[1]) * vSI], planet.color);
                }
            }
        }
    }
    getForceOnMe(Planets){
        let force = null;
        for (let planet of Planets){
            if (planet != this){
                if (force == null){
                    force = getGVector(this.pos, planet.pos, this.mass, planet.mass,G);
                }
                else{
                    force = addVector(force, getGVector(this.pos, planet.pos, this.mass, planet.mass,G));
                }
            }
        }
        if (force == null){
            return (false);
        }
        else{
            return(force);
        }
    }
    checkCol(Planets){
        for (let planet of Planets){
            if (planet != this){
                if (circleCollision(this.pos, this.size, planet.pos, planet.size)){
                    if (planet.mass >= this.mass){
                        planet.dir = getHitForce(planet.mass, planet.dir, this.mass, this.dir);
                        planet.mass += this.mass;
                        planet.size = Math.sqrt((Math.pow(this.size,2) * Math.PI + Math.pow(planet.size,2) * Math.PI)/Math.PI);
                        planet.color = findAverageOfColors(this.color,this.mass, planet.color, planet.mass);
                        if (didInteract){
                            playSound("Explosion.mp3",0.3);
                        }
                        this.del = true;
                    }
                }
            }
        }
    }
    move(Planets){
        if (this.getForceOnMe(Planets) != false){
            this.dir = addVector(this.dir,this.getForceOnMe(Planets));
        }
        
        this.pos[0] += this.dir[0];
        this.pos[1] += this.dir[1];
        this.checkCol(Planets);
    }
}

//Test
console.log(getHitForce(2,[1,0],1,[-2,0]));
console.log(multipliVector([3,10], 0.5))
console.log(objToArray({0: "Linus", 1: "Jonni"}));
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
let relativePlanet = null;
let downClick = null;
let timeDownClick = null;
let vS = 10;
let vSI = 1000;
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
let zoom = 1;
let didInteract = false;
let saveSlot1;
let detailedForce = false;
//music
var UniSoundtrack = new Audio("Universe_Soundtrack.mp3"); // buffers automatically when created
UniSoundtrack.volume = 0.1;
document.body.onclick=()=>{UniSoundtrack.play();didInteract = true;}

function playSound(source, volume){
    let sound = new Audio(source);
    sound.volume = volume;
    sound.play();

}


//earth, moon, sun
universe = [];
universe.push(new Planet("Mond","100,100,100",2,5,[50,520],[4,1]));
universe.push(new Planet("Erde","0,200,40",20,100,[-50,550],[4,0]));
universe.push(new Planet("Sonne","200,200,0",40,200,[0,0],[0,0]));

//setting planets at the start to the state: "universe"
planets = universe;

//this is the gameLoop
gameLoop();
function gameLoop(){
    //console.log(planets);
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    cW = canvas.width;
    cH = canvas.height;
    gameSpeed = document.getElementById("gameSpeed").value;
    G = document.getElementById("Gravity").value;
    //follow planet
    if (selectedPlanet != null){
        followPlanet(selectedPlanet);
        if (selectedPlanet.del == true){
            selectedPlanet = null;
        }
    }
    if (relativePlanet != null){
        if (relativePlanet.del == true){
            relativePlanet = null;
        }
    }
    clearCanvas();
    ctx.translate( cW/2,cH/2);
    ctx.scale( zoom, zoom);
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
    //show the planets
    for (let planet of planets){
        planet.show(planets);
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
function save(){
    document.getElementById("Save").value = planetsToString(planets);
}
function load(){
    planets = stringToPlanets(document.getElementById("Save").value, 8);
}
function objToArray(object){
    let array = [];
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            array.push( object[property]);
        }
    }
    return (array);
}
//sets the planets-array to [] (clears the sceane)
function clearAll(){
    console.log("hey");
    planets = [];
}
//sets the scoll so the Planet is followed
function followPlanet(Planet){
    sX = -(Planet.pos[0]);
    sY = -(Planet.pos[1]);
}
//handles the keypress event
document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    //moves your relative center left
    if (charStr == "a"){
        sX += scrollSpeed/zoom;
    }
    //moves your relative center right
    if (charStr == "d"){
        sX -= scrollSpeed/zoom;
    }
    //moves your relative center up
    if (charStr == "w"){
        sY += scrollSpeed/zoom;
    }
    //moves your relative center down
    if (charStr == "s"){
        sY -= scrollSpeed/zoom;
    }
    //disselects the selected planet
    if (charStr == "q"){
        selectedPlanet = null;
    }
    if (charStr == "r"){
        relativePlanet = null;
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
    if (charStr == "i"){
        console.log("showForces");
        if (detailedForce){
            detailedForce = false;
        }
        else{
            detailedForce = true;
        }
    }
    //v edits the dir/velocity of the selected planet
    if (charStr == "v"){
        if (selectedPlanet != null){
            console.log("Hey");
            //mousePos-planetePos /vs
            console.log((getMousePos(sX, sY, zoom, cMousePos[0], cMousePos[1])[0] - selectedPlanet.pos[0] ) /vS);
            console.log(parseFloat(document.getElementById("SVX").value));
            let rX = 0;
            let rY = 0;
            if (relativePlanet != null){
                rX = relativePlanet.dir[0];
                rY = relativePlanet.dir[1];
            }
            selectedPlanet.dir = [(getMousePos(sX, sY, zoom, cMousePos[0], cMousePos[1])[0] - selectedPlanet.pos[0] ) /vS +rX, (getMousePos(sX, sY, zoom, cMousePos[0], cMousePos[1])[1] - selectedPlanet.pos[1]) /vS + rY];
        }
    }

};
window.onwheel = function(){ return false; }
canvas.addEventListener("onwheel" in document ? "wheel" : "mousewheel", function(e) {
    e.wheel = e.deltaY ? -e.deltaY : e.wheelDelta/40;
    zoom += e.wheel/1000;
  });
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
            downClick.pos = getMousePos(sX, sY, zoom, ev.clientX, ev.clientY);
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
                relativePlanet = selectedPlanet;
            }
        }
        else{
            //means: clicked on void
            spawnPlanet(ev,false);
        }
    }
}
function  getMousePos(sX, sY, zoom, x,y) {
    return  ([(x - cW/2) / zoom -sX , (y  - cH/2) / zoom - sY]);
  }
//returns the planet the mouse is over
//else returns void
function getPlanet(ev){
    for(let planet of planets){
        if (circleCollision( getMousePos(sX, sY, zoom, ev.clientX, ev.clientY),10,planet.pos, planet.size)){
            return planet;
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
        let rX = 0;
        let rY = 0;
        if (relativePlanet != null){
            rX = relativePlanet.dir[0];
            rY = relativePlanet.dir[1];
        }
        sWnV = [((otherEV.clientX-ev.clientX)/zoom)/vS +rX, ((otherEV.clientY-ev.clientY)/zoom)/vS +rY];
    }
    planets.push(new Planet(sWnName,sWnColor,sWnR,sWnM, getMousePos(sX, sY, zoom, ev.clientX, ev.clientY), sWnV));
    if (didInteract){
        playSound("PlaceSound.mp3",0.3);
    }
}
//clears the canvas
function clearCanvas(){
    canvas.width = canvas.width;
}
//draws a circle with radius r and a color c with the location (x,y)
function drawCircle(x,y,r,color){
    ctx.beginPath();
    ctx.arc(x ,y,r,0,2*Math.PI, true);
    ctx.fillStyle=getHexOfRGBString(color);
    ctx.fill();
    ctx.fillStyle="#000000";
}
//draws a line between two positions
function drawLine(pos1,pos2, color){
    console.log(color);
    ctx.strokeStyle = getHexOfRGBString(color);
    ctx.beginPath();
    ctx.moveTo(pos1[0],pos1[1]);
    ctx.lineTo(pos2[0],pos2[1]);
    ctx.stroke();
}
//shows a text (string) on a given position
function showText(pos, string){
    ctx.fillSyle="blue";
    ctx.textAlign="center"; 
    ctx.font="30px Georgia";
    ctx.fillText(string,pos[0],pos[1]);
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
console.log(getg(1,2,2));
function getg(G, M1, r){
    return((G * M1)/(r*r)); //    return((G * M1)/r*r);
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
function findAverageOfColors(color1, v1, color2, v2){
    return(parseInt((getRGBOfRGBString(color1)[0] * v1 + getRGBOfRGBString(color2)[0] * v2)/(v1 + v2)) +","+parseInt((getRGBOfRGBString(color1)[1] * v1 + getRGBOfRGBString(color2)[1] * v2)/(v1+v2))+","+parseInt((getRGBOfRGBString(color1)[2]*v1 + getRGBOfRGBString(color2)[2]*v2)/(v1+v2)));
}
console.log(getHexOfRGBString("01,50.3,120"));
function getHexOfRGBString(RGBString){
    return(rgbToHex(getRGBOfRGBString(RGBString)[0], getRGBOfRGBString(RGBString)[1], getRGBOfRGBString(RGBString)[2]));
}
function getRGBOfRGBString(RGBString){
    let rgb = [];
    let x = "";
    for (var i=0; i < RGBString.length; i++) { 
        if (RGBString.charAt(i) != ','){
            x += RGBString.charAt(i);
        }
        else{
            rgb.push(parseFloat(x));
            x = "";
        }

    }
    rgb.push(parseFloat(x));
    return(rgb);
}
function planetsToString(planets){
    let str = "";
    for (planet of planets){
        for (let property in planet) {
            if (planet.hasOwnProperty(property)) {
                // do stuff
                str = str.concat(planet[property] + ":");
            }
        }
    }
    return(str);
}
function stringToPlanets(str, attPerPlanet){
    let i = 0;
    let planetData = [];
    let attString = "";
    let newPlanets = [];
    while (i < str.length){
         if (str.charAt(i) == ":"){
            planetData.push(attString);
            attString = "";
            if (planetData.length == attPerPlanet){
                console.log(planetData);
                newPlanets.push(new Planet(planetData[0], planetData[1], parseInt(planetData[2]), parseInt(planetData[3]), [stringToArray(planetData[7])[0] - sX, stringToArray(planetData[7])[1] - sY], stringToArray(planetData[5])));
                planetData = [];
            }
        }
        else{
            attString = attString.concat(str.charAt(i));
        }
        i += 1;
    }
    return(newPlanets);
}
function stringToArray(str){
    let array = [];
    let e = "";
    for(char of str){
        if (char == ","){
            array.push(parseFloat(e));
            e = "";
        }
        else{
            e = e.concat(char);
        }
    }
    array.push(parseFloat(e));
    return array;
}
//name, color, size, mass, pos, dir