class Planet{
    constructor(size, mass, pos, dir){
        this.size = size;
        this.mass = mass;
        this.pos = pos;
        this.dir = dir;
        this.del = false;
    }
    show(){
        drawCircle(this.pos[0], this.pos[1], this.size);
        drawLine(this.pos, [this.pos[0] + this.dir[0] * vS, this.pos[1] + this.dir[1]*vS]);
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
                        this.del = true;
                    }
                }
            }
        }
    }
    tick(Planets){
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
canvas.addEventListener('click', spawnPlanet, false);
let buttonRUp= document.createElement('buttonRUp');

const Gravity = .0000000000667
let G = 0.0005;
let V1 = [0,1];
let V2 = [1,0];
let planets = [];
let vS = 10;
let sX = 0;
let sY = 0;
let scrollSpeed = 10;
let sWnR = 10;
let sWnM = 10
let sWnV = [2,0];

//collision
collision = [];
collision.push(new Planet(20,20,[100,250],[0,0]));
collision.push(new Planet(40,40,[250,250],[0,0]));



//earth, moon, sun
universe = []
universe.push(new Planet(5,5,[300,770],[8,2]));
universe.push(new Planet(50,100,[200,800],[8,0]));
universe.push(new Planet(100,200,[250,250],[0,0]));

planets = [];
planets.push(new Planet(10,10,[300,400],[2,0]));
planets.push(new Planet(50,50,[200,300],[0,0]));

setInterval(gameLoop, 50);
function gameLoop(){
    clearCanvas();
    for (let Planet of planets){
        Planet.tick(planets);
    }
    for (let p = planets.length - 1;  p>=0; p--){
        if (planets[p].del){
            planets.splice(p,1);
        }
    }
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
};

function spawnPlanet(ev){
    sWnR = parseInt(document.getElementById("radiusI").value);
    sWnM = sWnR;
    sWnV = [parseInt(document.getElementById("SVX").value),parseInt(document.getElementById("SVY").value)];
    planets.push(new Planet(sWnR,sWnM, [ev.clientX - sX, ev.clientY - sY], sWnV));
}
function clearCanvas(){
    canvas.width = canvas.width;
}
function drawCircle(x,y,r){
    ctx.beginPath();
    ctx.arc(x + sX,y + sY,r,0,2*Math.PI, true);
    ctx.fillStyle="#5F5F5F";
    ctx.fill();
    ctx.fillStyle="#000000";
}
function drawLine(pos1,pos2){
    ctx.beginPath();
    ctx.moveTo(pos1[0] + sX,pos1[1] + sY);
    ctx.lineTo(pos2[0] + sX,pos2[1] + sY);
    ctx.stroke();
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
