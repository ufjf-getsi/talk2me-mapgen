import Sprite from "./Sprite.js";

export default class Player extends Sprite{
    constructor(numberGems, x, y) {
        super({x, y});
        this.cargas = Array(numberGems).fill(0);
        this.score = 0;
        this.x = x;
        this.y = y;
        this.planetX = 0;
        this.planetY = 0;
        this.seguindo = numberGems*2;
        this.numberGem = numberGems;
        this.emDeslocamento = false;
        this.w = 5;
        this.h = 5;
    }
  
    temCarga()
    {
        for (let index = 0; index < this.cargas.length; index++){
            if(this.cargas[index] > 0)
            {
                return true;
            }
        }
        return false;
    }

    comportamentoPlayer()
    {
        let distanciaPlaneta = Infinity;
        let proximoPlaneta = "";
        if(this.seguindo == this.numberGem*2 || this.temCarga()) { // verificar se o jogador está seguindo algum mapa de influencia
            let cargaPrioritaria = this.numberGem;
            for (let index = 0; index < this.cargas.length; index++) { // verificar se o jogador tem carga e se existe um planeta como consumidor
                if(this.cargas[index] > 0)
                {
                    if(this.cena.mapa.maps.getElement(index + this.numberGem, this.planetX, this.planetY) < distanciaPlaneta)
                    {
                        cargaPrioritaria = index;
                        distanciaPlaneta = this.cena.mapa.maps.getElement(index + this.numberGem, this.planetX, this.planetY);
                    }
                }
            }
            if(cargaPrioritaria < this.numberGem && distanciaPlaneta != Infinity) // se tiver carga e planeta para entregar determina o mapa a seguir
            {
                this.seguindo = cargaPrioritaria + this.numberGem; 
            } 
            else // caso não tenha carga determina o mapa de influencia do gerador mais próximo
            {
                let mapaSeguido = 0;
                for (let index = 1; index < this.numberGem; index++) {
                    if(this.cena.mapa.maps.getElement(index, this.planetX, this.planetY) < this.cena.mapa.maps.getElement(mapaSeguido, this.planetX, this.planetY))
                        {
                            mapaSeguido = index;
                        } 
                }
                this.seguindo = mapaSeguido;
            }
        } 

        if(this.cena.mapa.maps.getElement(this.seguindo, this.planetX, this.planetY) == 0)
        {
            //conclusão ao chegar no destino
            this.seguindo = this.numberGem*2;
            console.log("chegou");
        }
        else
        {
            //deslocamento
            distanciaPlaneta = Infinity;
            if(this.planetX - 1 >= 0)
            {
                distanciaPlaneta = this.cena.mapa.maps.getElement(this.seguindo, this.planetX - 1, this.planetY);
                proximoPlaneta = "Cima";
            }
            if(this.planetX + 1 < this.cena.mapa.LINHAS)
            {
                if(this.cena.mapa.maps.getElement(this.seguindo, this.planetX + 1, this.planetY) < distanciaPlaneta)
                {
                    distanciaPlaneta = this.cena.mapa.maps.getElement(this.seguindo, this.planetX + 1, this.planetY);
                    proximoPlaneta = "Baixo";
                }
            }
            if(this.planetY - 1 >= 0)
            {
                if(this.cena.mapa.maps.getElement(this.seguindo, this.planetX, this.planetY - 1) < distanciaPlaneta)
                {
                    distanciaPlaneta = this.cena.mapa.maps.getElement(this.seguindo, this.planetX, this.planetY - 1);
                    proximoPlaneta = "Esquerda";
                }
            }
            if(this.planetY + 1 < this.cena.mapa.COLUNAS)
            {
                if(this.cena.mapa.maps.getElement(this.seguindo, this.planetX, this.planetY + 1) < distanciaPlaneta)
                {
                    distanciaPlaneta = this.cena.mapa.maps.getElement(this.seguindo, this.planetX, this.planetY + 1);
                    proximoPlaneta = "Direita";
                }
            }
        }
        if(proximoPlaneta != "" && distanciaPlaneta != Infinity)
        {
            this.deslocarPlayer(proximoPlaneta);
            this.emDeslocamento = true;
        }
        if(distanciaPlaneta == Infinity)
        {
            this.seguindo = this.numberGem*2;
            console.log("chegou");
        }
    }

    deslocarPlayer(direcao)
    {
        console.log(direcao);
        switch (direcao) {
            case "Cima":
                this.planetX -= 1;
                this.vy = -5;
                break;
            case "Baixo":
                this.planetX += 1;
                this.vy = +5;
                break;
            case "Esquerda":
                this.planetY -= 1;
                this.vx = -5;
                break;
            case "Direita":
                this.planetY += 1;
                this.vx = +5;
                break;
        }
    }

    mover(dt) {
        if(this.colidiuCom(this.cena.mapa.planets[this.planetX][this.planetY]))
        {
            console.log("paro " + this.seguindo);
            this.emDeslocamento = false;
            this.vx = 0;
            this.vy = 0;
        }  
        this.x = this.x + this.vx * dt;
        this.y = this.y + this.vy * dt;
    }

    passo(dt) {
        if(!this.emDeslocamento)
        {
            this.comportamentoPlayer();
        }
        this.mover(dt);
    }

    desenhar(ctx) {
        ctx.fillStyle = "purple";
        ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        ctx.fillStyle = "white";
        ctx.fillText("Pontuação: " + this.score, 150, 230);
        if(this.cena.camada == 6){
            ctx.fillStyle = "white";
            ctx.fillText("Nenhuma camada selecionada", 0, 230);
        }
        else
        {
            ctx.fillStyle = "white";
            ctx.fillText("Camada selecionada: " + this.cena.camada, 0, 230);
        }
    }
}