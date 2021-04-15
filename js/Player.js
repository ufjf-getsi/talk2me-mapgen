export default class Player {
    constructor(numberGems, x, y) {
        this.cargas = Array(numberGems).fill(0);
        this.score = 0;
        this.x = x;
        this.y = y;
        this.planetX = 0;
        this.planetY = 0;
        this.seguindo = numberGems*2;
        this.numberGem = numberGems;
    }
  }