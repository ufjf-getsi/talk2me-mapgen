import Sprite from "./Sprite.js";

const SIZE = 50;
export default class Planet extends Sprite {
    constructor(row, column){
        super({row, column});
        this.row = row;
        this.column = column;
        this.x = this.column*SIZE;
        this.y = this.row*SIZE;
        this.color = "white";
        this.lista = new Set();
        /*this.contents = [
            GEM_RED,
            BUYER_GREEN
        ];*/
    }
}