import Sprite from "./Sprite.js";

export default class Planet extends Sprite {
    constructor(row, column, tamanho){
        super({row, column});
        this.row = row;
        this.column = column;
        this.x = this.column*tamanho;
        this.y = this.row*tamanho;
        this.color = "white";
        this.lista = new Set();
        this.w = 7;
        this.h = 7;
    }

    desenhar(ctx){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 7, 7, 0, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.strokeStyle = "grey";
        ctx.stroke();
    }
}