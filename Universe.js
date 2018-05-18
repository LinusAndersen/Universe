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
        let force = [0,0];
        for (let Planet of Planets){
            if (Planet != this){
                force = addVector(force, getGVector(this.pos, Planet.pos, this.mass, Planet.mass,G));
            }
        }
        return(force);
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
        this.dir = addVector(this.dir, this.getForceOnMe(Planets));
        this.pos[0] += this.dir[0];
        this.pos[1] += this.dir[1];
        this.checkCol(Planets);
        this.show();
    }
}

console.log(getHitForce(2,[1,0],1,[-2,0]));



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


//earth, moon, sun
universe = []
universe.push(new Planet("Mond","#7a7a7a",2,5,[50,520],[4,1]));
universe.push(new Planet("Erde","#04870a",20,100,[-50,550],[4,0]));
universe.push(new Planet("Sonne","#ffdd00",40,200,[0,0],[0,0]));

planets = universe;

setInterval(gameLoop, 75);
function gameLoop(){
    G = document.getElementById("Gravity").value;
    if (selectedPlanet != null){
        followPlanet(selectedPlanet);
        if (selectedPlanet.del == true){
            selectedPlanet = null;
        }
    }
    clearCanvas();
    if (isPause==false){
        for (let Planet of planets){
            Planet.move(planets);
        }
    }
    for (let p = planets.length - 1;  p>=0; p--){
        if (planets[p].del){
            planets.splice(p,1);
        }
    }
    for (let Planet of planets){
        Planet.show();
    }
    
}
function pause(){
    if (isPause){
        isPause = false;
    }
    else{
        isPause = true;
    }
    console.log(isPause);
}
function followPlanet(Planet){
    sX = -(Planet.pos[0] - cW/2 );
    sY = -(Planet.pos[1] - cH/2);
}
document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    if (charStr == "a"){
        sX += scrollSpeed;
    }
    if (charStr == "d"){
        sX -= scrollSpeed;
    }
    if (charStr == "w"){
        sY += scrollSpeed;
    }
    if (charStr == "s"){
        sY -= scrollSpeed;
    }
    if (charStr == "q"){
        selectedPlanet = null;
    }
    if (charStr == "p"){
        pause();
    }
    if (charStr == "x"){
        if (selectedPlanet != null){
            selectedPlanet.del = true;
        }
    }

};
canvas.onmousedown = function (ev){
    console.log("MouseDown");
    downClick = getPlanet(ev);
    let Time = new Date();
    timeDownClick = Time.getTime();
}
canvas.onmouseup = function (ev){
    console.log("MouseUp");
    let Time = new Date();
    console.log(Time.getTime() - timeDownClick);
    if (Time.getTime() - timeDownClick > 200){
        if (downClick != null){
            downClick.pos = [ev.clientX -sX, ev.clientY - sY];
        }
    }
    else{
        if (downClick != null){
            selectedPlanet = downClick;
        }
        else{
            spawnPlanet(ev);
        }
    }
}
function getPlanet(ev){
    for(let Planet of planets){
        if (circleCollision([ev.clientX - sX, ev.clientY - sY],10,Planet.pos, Planet.size)){
            return Planet;
        }
    }
    return null;
}
function spawnPlanet(ev){
    sWnName = document.getElementById("name").value;
    sWnColor = document.getElementById("color").value;
    sWnR = parseInt(document.getElementById("radiusI").value);
    sWnM = sWnR;
    sWnV = [parseInt(document.getElementById("SVX").value),parseInt(document.getElementById("SVY").value)];
    planets.push(new Planet(sWnName,sWnColor,sWnR,sWnM, [ev.clientX - sX, ev.clientY - sY], sWnV));
}
function clearCanvas(){
    canvas.width = canvas.width;
}
function drawCircle(x,y,r,color){
    ctx.beginPath();
    ctx.arc(x + sX,y + sY,r,0,2*Math.PI, true);
    ctx.fillStyle=color;
    ctx.fill();
    ctx.fillStyle="#000000";
}
function drawLine(pos1,pos2){
    ctx.beginPath();
    ctx.moveTo(pos1[0] + sX,pos1[1] + sY);
    ctx.lineTo(pos2[0] + sX,pos2[1] + sY);
    ctx.stroke();
}
function showText(pos, string){
    ctx.fillSyle="blue";
    ctx.textAlign="center"; 
    ctx.font="30px Georgia";
    ctx.fillText(string,pos[0] + sX,pos[1] + sY);
}
function circleCollision(pos1,r1,pos2,r2){
    if (pythagoras(pos1[1]- pos2[1], pos1[0] - pos2[0]) > r1 + r2){
        return false;
    }
    else{
        return true;
    }
}
function addVector(V1, V2){
    let nVec = [];
    for (let i = 0; i < V1.length; i++){
        nVec.push(V1[i] + V2[i]);
    }
    return (nVec);
}
function getHitForce(m1, forceVector1, m2, forceVector2){
    console.log(m1, forceVector1, m2, forceVector2);
    console.log(addVector(forceVector1,getVector(getDir(forceVector2[0], forceVector2[1]),(m2/m1) * pythagoras(forceVector2[0],forceVector2[1]))));
    return(addVector(forceVector1,getVector(getDir(forceVector2[0], forceVector2[1]),(m2/m1) * pythagoras(forceVector2[0],forceVector2[1]))));
}
function getg(G, M1, r){
    return((G * M1)/r*r);
}
function pythagoras(a,b){
    return(Math.sqrt(a*a+b*b));
}
function getVector(dir, force){
    return([Math.cos(dir) * force, Math.sin(dir) * force]);
}
function getDir(a,b){
    let dir = Math.atan2(b/pythagoras(a,b),a/pythagoras(a,b));
    return (dir);
}
function getGVector(pos1,pos2,m1,m2,G){
    return(getVector(getDir(pos2[0]-pos1[0], pos2[1] - pos1[1]),getg(G,m2,pythagoras(pos2[0]-pos1[0], pos2[1] - pos1[1]))));
}
function rgbToHex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function findAverageOfColors(color1, color2){
    return(rgbToHex((hexToRgb(color1).r + hexToRgb(color2).r)/2, (hexToRgb(color1).g + hexToRgb(color2).g)/2, (hexToRgb(color1).b + hexToRgb(color2).b)/2));
}