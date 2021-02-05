import InfluenceMaps from "./InfluenceMaps.js";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;
let x = 100;
let y = 150;
let vx = 0;
let vy = 0;

const NumberGem = 3;
const SIDE = 5;
const SIZE = 50;

const maps = new InfluenceMaps(25, 25);



let planets = Array(SIDE)
    .fill()
    .map(() => Array(SIDE).fill(undefined));

for (let r = 0; r < planets.length; r++) {
    for (let c = 0; c < planets[0].length; c++) {
        const planet = planets[r][c] = {
            r: r,
            c: c,
            x: c * SIZE,
            y: r * SIZE,
            cor: "white",
            consumidor: false,
            type: Array(NumberGem).fill(Infinity),
            verificaGerador: verificaGera
        };
    }
}

let gr = 0;
let gc = 0;

//função para verificar se determinado planeta é um gerador, retornando verdadeiro caso seja
function verificaGera()
{
    for (let index = 0; index < this.type.length; index++) {
        if (this.type[index] == 0) {
            return true;
        }
    }
    return false;
}

//função para criar geradores apenas em locais que não existam gerador, definindo a cor do gerador e indices de todos os planetas com a adição desse gerador 
function criaGerador(indice)
{
    
    gr = Math.floor(Math.random() * SIDE);
    gc = Math.floor(Math.random() * SIDE);
    while (planets[gr][gc].verificaGerador()) {
        gr = Math.floor(Math.random() * SIDE);
        gc = Math.floor(Math.random() * SIDE);
    }
    switch (indice) {
        case 0:
            planets[gr][gc].cor = "red";
            break;
        case 1:
            planets[gr][gc].cor = "blue";
            break;
        case 2:
            planets[gr][gc].cor = "green";
            break;
    }
    planets[gr][gc].type[indice] = 0;
    for (let r = 0; r < planets.length; r++) {
        for (let c = 0; c < planets[0].length; c++) {
            let planet = planets[r][c];
            const d = Math.abs(gr - planet.r) + Math.abs(gc - planet.c);
            planet.type[indice] = Math.min(planet.type[indice], d);
        }
    }
}

//função para criar consumidores a determinada distancia , definindo a cor do consumidor 
function criaConsumidor(indice)
{
    
    gr = Math.floor(Math.random() * SIDE);
    gc = Math.floor(Math.random() * SIDE);
    while (planets[gr][gc].verificaGerador() || planets[gr][gc].consumidor || planets[gr][gc].type[indice] < 4) {
        gr = Math.floor(Math.random() * SIDE);
        gc = Math.floor(Math.random() * SIDE);
    }
    switch (indice) {
        case 0:
            planets[gr][gc].cor = "Crimson";
            break;
        case 1:
            planets[gr][gc].cor = "Cyan";
            break;
        case 2:
            planets[gr][gc].cor = "SpringGreen";
            break;
    }
    planets[gr][gc].consumidor = true;
    
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
}

function desenhaPlanetas() {
    //Desenha Fundo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    //Desenha Matrix de Planetas
    for (let r = 0; r < planets.length; r++) {
        for (let c = 0; c < planets[0].length; c++) {
            const planet = planets[r][c];
            ctx.fillStyle = planet.cor;
            ctx.beginPath();
            ctx.ellipse(planet.x, planet.y, 7, 7, 0, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.strokeStyle = "grey";
            ctx.stroke();
            ctx.fillStyle = "red";
            ctx.fillText(planet.type[0], planet.x + 10, planet.y + 10);
            ctx.fillStyle = "blue";
            ctx.fillText(planet.type[1], planet.x + 20, planet.y + 10);
            ctx.fillStyle = "green";
            ctx.fillText(planet.type[2], planet.x + 30, planet.y + 10);
        }
    }
}