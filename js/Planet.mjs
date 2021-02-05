export default class Planet {
    constructor({row, column}){
        this.row = row;
        this.column = column;
        this.x = this.column*SIZE;
        this.y = this.row*SIZE;
        this.color = "white";
        this.contents = [
            GEM_RED,
            BUYER_GREEN
        ];
    }
};