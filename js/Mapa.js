import InfluenceMaps from "./InfluenceMaps.js";
import Planet from "./Planet.mjs";

export default class Mapa{
    constructor(linhas=5, colunas=5, tamanho = 50, numberGem = 3){
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.maps = new InfluenceMaps(this.LINHAS, this.COLUNAS);
        this.cena = null;
        this.NumberGem = numberGem;
        this.planets = Array(this.LINHAS)
            .fill()
            .map(() => Array(this.COLUNAS).fill(undefined));
        for (let r = 0; r < this.planets.length; r++) {
            for (let c = 0; c < this.planets[0].length; c++) {
                this.planets[r][c] = new Planet(r,c,tamanho);
                this.planets[r][c].tags.add("planet");
            }
        }
    }

    //função para criar geradores apenas em locais que não existam gerador, definindo a color do gerador e indices de todos os planetas com a adição desse gerador 
    criaGerador(indice)
    {
        let gr = Math.floor(Math.random() * this.LINHAS);
        let gc = Math.floor(Math.random() * this.COLUNAS);
        while (this.maps.verifyElement(indice, gr, gc) || this.maps.getElement(indice + this.NumberGem, gr, gc) < 4) {
            gr = Math.floor(Math.random() * this.LINHAS);
            gc = Math.floor(Math.random() * this.COLUNAS);
        }
        this.planets[gr][gc].lista.add(indice);
        this.maps.addElement(indice, gr, gc);
    }

    //função para criar consumidores a determinada distancia , definindo a color do consumidor 
    criaConsumidor(indice)
    {
        let gr = Math.floor(Math.random() * this.LINHAS);
        let gc = Math.floor(Math.random() * this.COLUNAS);
        while (this.maps.verifyElement(indice, gr, gc) || this.maps.getElement(indice, gr, gc) < 4) {
            gr = Math.floor(Math.random() * this.LINHAS);
            gc = Math.floor(Math.random() * this.COLUNAS);
        }
        this.planets[gr][gc].lista.add(indice + this.NumberGem);
        this.maps.addElement(indice + this.NumberGem, gr, gc);
    }

    desenhar(ctx, camada){
        
        for (let l = 0; l < this.LINHAS; l++) {
            for (let c = 0; c < this.COLUNAS; c++) {
                const planet = this.planets[l][c];
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
                    ctx.fillText(this.maps.getElement(camada, l, c), planet.x + 10, planet.y + 10);
                }
            }
        }
    }
}