import InfluenceMaps from "./InfluenceMaps.js";
import Planet from "./Planet.mjs";
import Player from "./Player.js";

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

let player = new Player(NumberGem, planets[0][0].x, planets[0][0].y);

//função para criar geradores apenas em locais que não existam gerador, definindo a color do gerador e indices de todos os planetas com a adição desse gerador 
function criaGerador(indice)
{
    let gr = Math.floor(Math.random() * SIDE);
    let gc = Math.floor(Math.random() * SIDE);
    while (maps.verifyElement(indice, gr, gc) || maps.getElement(indice + NumberGem, gr, gc) < 4) {
        gr = Math.floor(Math.random() * SIDE);
        gc = Math.floor(Math.random() * SIDE);
    }
    planets[gr][gc].lista.add(indice);
    maps.addElement(indice, gr, gc);
}

//função para criar consumidores a determinada distancia , definindo a color do consumidor 
function criaConsumidor(indice)
{
    let gr = Math.floor(Math.random() * SIDE);
    let gc = Math.floor(Math.random() * SIDE);
    while (maps.verifyElement(indice, gr, gc) || maps.getElement(indice, gr, gc) < 4) {
        gr = Math.floor(Math.random() * SIDE);
        gc = Math.floor(Math.random() * SIDE);
    }
    planets[gr][gc].lista.add(indice + NumberGem);
    maps.addElement(indice + NumberGem, gr, gc);
}

//função para determinar comportamento do jogador 
function comportamentoPlayer()
{
    let distanciaPlaneta = Infinity;
    let proximoPlaneta = "";
    if(player.seguindo == NumberGem*2) {
        let cargaPrioritaria = NumberGem;
        for (let index = 0; index < player.cargas.length; index++) {
            if(player.cargas[index] > 0)
            {
                if(cargaPrioritaria == NumberGem)
                {
                    cargaPrioritaria = index;
                    distanciaPlaneta = maps.getElement(cargaPrioritaria, player.planetX, player.planetY);
                }
                else
                {
                    if(maps.getElement(index, player.planetX, player.planetY) < distanciaPlaneta)
                    {
                        cargaPrioritaria = index;
                        distanciaPlaneta = maps.getElement(cargaPrioritaria, player.planetX, player.planetY);
                    }
                }
            }
        }
        if(cargaPrioritaria < NumberGem && distanciaPlaneta != Infinity)
        {
            player.seguindo = cargaPrioritaria + NumberGem; 
        } 
        else 
        {
            let mapaSeguido = 0;
            for (let index = 1; index < NumberGem; index++) {
                if(maps.getElement(index, player.planetX, player.planetY) < maps.getElement(mapaSeguido, player.planetX, player.planetY))
                    {
                        mapaSeguido = index;
                    } 
            }
            player.seguindo = mapaSeguido;
        }
    } 

    if(maps.getElement(player.seguindo, player.planetX, player.planetY) == 0)
    {
        //conclusão ao chegar no destino
        player.seguindo = NumberGem*2;
    }
    else
    {
        //deslocamento
        distanciaPlaneta = Infinity;
        if(player.planetX - 1 >= 0)
        {
            distanciaPlaneta = maps.getElement(player.seguindo, player.planetX - 1, player.planetY);
            proximoPlaneta = "Esquerda";
        }
        if(player.planetX + 1 < SIDE)
        {
            if(maps.getElement(player.seguindo, player.planetX + 1, player.planetY) < distanciaPlaneta)
            {
                distanciaPlaneta = maps.getElement(player.seguindo, player.planetX + 1, player.planetY);
                proximoPlaneta = "Direita";
            }
        }
        if(player.planetY - 1 >= 0)
        {
            if(maps.getElement(player.seguindo, player.planetX, player.planetY - 1) < distanciaPlaneta)
            {
                distanciaPlaneta = maps.getElement(player.seguindo, player.planetX, player.planetY - 1);
                proximoPlaneta = "Cima";
            }
        }
        if(player.planetY + 1 < SIDE)
        {
            if(maps.getElement(player.seguindo, player.planetX, player.planetY + 1) < distanciaPlaneta)
            {
                distanciaPlaneta = maps.getElement(player.seguindo, player.planetX, player.planetY + 1);
                proximoPlaneta = "Baixo";
            }
        }
    }
    interagirPlaneta()
    if(proximoPlaneta != "" && distanciaPlaneta != Infinity)
    {
        deslocarPlayer(proximoPlaneta);
    }
}

//função para determinar comportamento do jogador 
function interagirPlaneta()
{
    const planet = planets[player.planetX][player.planetY];
    for (let item of planet.lista)
    {
        if (item < NumberGem) {
            player.cargas[item] += 1;
            maps.atualizaMapa(item, player.planetX, player.planetY);
            planet.lista.delete(item)
        } else {
            if(player.cargas[item-3] > 0)
            {
                player.score += player.cargas[item-3];
                player.cargas[item-3] = 0;
                maps.atualizaMapa(item, player.planetX, player.planetY);
                planet.lista.delete(item)
            }
        }
    }
}

//função para determinar comportamento do jogador 
function deslocarPlayer(direcao)
{
    switch (direcao) {
        case "Esquerda":
            player.planetX -= 1;
            break;
        case "Direita":
            player.planetX += 1;
            break;
        case "Cima":
            player.planetY -= 1;
            break;
        case "Baixo":
            player.planetY += 1;
            break;
    }
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
let tempoEscolha = 0;
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
    if(tempoEscolha > 5)
    {
        comportamentoPlayer();
        tempoEscolha = 0;
    }
    else
    {
        tempoEscolha += dt;
    }

    /*Atualiza estados
    x = x + 25 * Math.sign(planets[gr][gc].x - x) * dt;
    y = y + 25 * Math.sign(planets[gr][gc].y - y) * dt;*/

    desenhaPlanetas();
    //Desenha player
    player.x = planets[player.planetX][player.planetY].x;
    player.y = planets[player.planetX][player.planetY].y;
    ctx.fillStyle = "purple";
    ctx.fillRect(player.x, player.y, 5, 5);

    ctx.restore();
    requestAnimationFrame(desenha);
    t0 = t;
    ctx.resetTransform();
    console.log(player.score);
    console.log(player.cargas);
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
            ctx.ellipse(planet.x, planet.y, 7, 7, 0, 0, 2 * Math.PI, false);
            
            ctx.fill();
            ctx.strokeStyle = "grey";
            ctx.stroke();
            if(camada == 6){
                let numeroElementos = 0;
                for (let item of planet.lista)
                {
                    switch (item) {
                        case 0:
                            ctx.fillStyle = "red";
                            ctx.fillRect(planet.x + 15, planet.y + 10*(numeroElementos-1)-5, 5, 5);            
                            break;
                        case 1:
                            ctx.fillStyle = "blue";
                            ctx.fillRect(planet.x + 15, planet.y + 10*(numeroElementos-1)-5, 5, 5);
                            break;
                        case 2:
                            ctx.fillStyle = "green";
                            ctx.fillRect(planet.x + 15, planet.y + 10*(numeroElementos-1)-5, 5, 5);
                            break;
                        case 3:
                            ctx.fillStyle = "red";
                            ctx.beginPath();
                            ctx.moveTo(planet.x + 15, planet.y + 10*(numeroElementos-1));
                            ctx.lineTo(planet.x + 20, planet.y + 10*(numeroElementos-1));
                            ctx.lineTo(planet.x + 17.5, planet.y + 10*(numeroElementos-1) - 4.33);
                            ctx.fill();
                            break;
                        case 4:
                            ctx.fillStyle = "blue";
                            ctx.beginPath();
                            ctx.moveTo(planet.x + 15, planet.y + 10*(numeroElementos-1));
                            ctx.lineTo(planet.x + 20, planet.y + 10*(numeroElementos-1));
                            ctx.lineTo(planet.x + 17.5, planet.y + 10*(numeroElementos-1) - 4.33);
                            ctx.fill();
                            break;
                        case 5:
                            ctx.fillStyle = "green";
                            ctx.beginPath();
                            ctx.moveTo(planet.x + 15, planet.y + 10*(numeroElementos-1));
                            ctx.lineTo(planet.x + 20, planet.y + 10*(numeroElementos-1));
                            ctx.lineTo(planet.x + 17.5, planet.y + 10*(numeroElementos-1) - 4.33);
                            ctx.fill();
                            break;
                    }
                    numeroElementos +=1;
                }
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
            e.preventDefault();
            xMapa = xMapa - 10;
            break;
        case "ArrowRight":
            e.preventDefault();
            xMapa = xMapa + 10;
            break;
        case "ArrowUp":
            e.preventDefault();
            yMapa = yMapa - 10;
            break;
        case "ArrowDown":
            e.preventDefault();
            yMapa = yMapa + 10;
            break;
    }
});