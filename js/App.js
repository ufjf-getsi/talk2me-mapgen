import InfluenceMaps from "./InfluenceMaps.js";
import Planet from "./Planet.mjs";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;
let x = 100;
let y = 150;
let vx = 0;
let vy = 0;
let xMapa = 0;
let yMapa = 0;
let camada = 6;

const NumberGem = 3;
const SIDE = 5;
const SIZE = 50;

const maps = new InfluenceMaps(SIDE, SIDE);

let planets = Array(SIDE)
    .fill()
    .map(() => Array(SIDE).fill(undefined));

for (let r = 0; r < planets.length; r++) {
    for (let c = 0; c < planets[0].length; c++) {
        planets[r][c] = new Planet(r,c);
    }
}

let gr = 0;
let gc = 0;

//função para criar geradores apenas em locais que não existam gerador, definindo a color do gerador e indices de todos os planetas com a adição desse gerador 
function criaGerador(indice)
{
    gr = Math.floor(Math.random() * SIDE);
    gc = Math.floor(Math.random() * SIDE);
    while (maps.verifyElement(gr, gc)) {
        gr = Math.floor(Math.random() * SIDE);
        gc = Math.floor(Math.random() * SIDE);
    }
    switch (indice) {
        case 0:
            planets[gr][gc].color = "red";
            planets[gr][gc].role = 0;
            break;
        case 1:
            planets[gr][gc].color = "blue";
            planets[gr][gc].role = 1;
            break;
        case 2:
            planets[gr][gc].color = "green";
            planets[gr][gc].role = 2;
            break;
    }
    
    maps.addElement(indice, gr, gc);
}

//função para criar consumidores a determinada distancia , definindo a color do consumidor 
function criaConsumidor(indice)
{
    
    gr = Math.floor(Math.random() * SIDE);
    gc = Math.floor(Math.random() * SIDE);
    while (maps.verifyElement(gr, gc) || maps.getElement(indice, gr, gc) < 4) {
        gr = Math.floor(Math.random() * SIDE);
        gc = Math.floor(Math.random() * SIDE);
    }
    switch (indice) {
        case 0:
            planets[gr][gc].color = "Crimson";
            planets[gr][gc].role = 3;
            break;
        case 1:
            planets[gr][gc].color = "Cyan";
            planets[gr][gc].role = 4;
            break;
        case 2:
            planets[gr][gc].color = "SpringGreen";
            planets[gr][gc].role = 5;
            break;
    }
    maps.addElement(indice + NumberGem, gr, gc);
}

criaGerador(0);
criaGerador(1);
criaGerador(2);
criaGerador(0);
criaGerador(1);
criaGerador(2);

criaConsumidor(0);
criaConsumidor(1);
criaConsumidor(2);
let t0;
let dt;
requestAnimationFrame(desenha);

function desenha(t) {
    ctx.translate(xMapa, yMapa);
    t0 = t0 ?? t;
    dt = (t - t0) / 1000;
    //Desenha Fundo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Desloca origem
    ctx.save();
    ctx.translate(
        (canvas.width - SIDE * SIZE) / 2,
        (canvas.height - SIDE * SIZE) / 2
    );

    //Atualiza estados
    x = x + 25 * Math.sign(planets[gr][gc].x - x) * dt;
    y = y + 25 * Math.sign(planets[gr][gc].y - y) * dt;

    desenhaPlanetas();
    //Desenha elementos
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, 4, 4);

    ctx.restore();
    requestAnimationFrame(desenha);
    t0 = t;
    ctx.resetTransform();
}

function desenhaPlanetas() {
    //Desenha Fundo
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if(camada == 6){
        ctx.fillStyle = "white";
        ctx.fillText("Nenhuma camada selecionada", 0, 230);
    }
    else
    {
        ctx.fillStyle = "white";
        ctx.fillText("Camada selecionada: " + camada, 0, 230);
    }

    //Desenha Matrix de Planetas
    for (let r = 0; r < planets.length; r++) {
        for (let c = 0; c < planets[0].length; c++) {
            
            const planet = planets[r][c];
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            if(planet.role < 3) {
                ctx.rect(planet.x, planet.y, 8, 8)
            } else if(planet.role < 6) {
                ctx.ellipse(planet.x, planet.y, 4, 7, 0, 0, 2 * Math.PI, false);
            } else {
                ctx.ellipse(planet.x, planet.y, 7, 7, 0, 0, 2 * Math.PI, false);
            }
            
            ctx.fill();
            ctx.strokeStyle = "grey";
            ctx.stroke();
            if(camada == 6){
                ctx.fillStyle = "red";
                ctx.fillText(maps.getElement(0, r, c), planet.x + 10, planet.y + 10);
                ctx.fillStyle = "blue";
                ctx.fillText(maps.getElement(1, r, c), planet.x + 20, planet.y + 10);
                ctx.fillStyle = "green";
                ctx.fillText(maps.getElement(2, r, c), planet.x + 30, planet.y + 10);
            }
            else
            {
                ctx.fillStyle = "white";
                ctx.fillText(maps.getElement(camada, r, c), planet.x + 10, planet.y + 10);
            }
            
        }
    }
    
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "0":
            camada = 0;
            break;
        case "1":
            camada = 1;
            break;
        case "2":
            camada = 2;
            break;
        case "3":
            camada = 3;
            break;
        case "4":
            camada = 4;
            break;
        case "5":
            camada = 5;
            break;
        case "6":
            camada = 6;
            break;
        case "ArrowLeft":
            xMapa = xMapa - 10;
            break;
        case "ArrowRight":
            xMapa = xMapa + 10;
            break;
        case "ArrowUp":
            yMapa = yMapa - 10;
            break;
        case "ArrowDown":
            yMapa = yMapa + 10;
            break;
    }
});