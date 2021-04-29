export default class Cena {
  constructor(canvas = null, assets = null, numberGem = 3) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d");
    this.assets = assets;
    this.game = null;
    this.preparar();
    this.NumberGem = numberGem;
    this.mapa = null;
    this.camada = 6;
    this.xMapa = 0;
    this.yMapa = 0;
  }
  desenhar() {
    const SIDE = 5;
    const SIZE = 50;
    //Desenha Fundo
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(-300, -300, this.canvas.width + 300, this.canvas.height + 300);

    //Desloca origem
    this.ctx.save();
    this.ctx.translate(
        (this.canvas.width - SIDE * SIZE) / 2,
        (this.canvas.height - SIDE * SIZE) / 2
    );
    this.ctx.translate(this.xMapa, this.yMapa);
    this.mapa?.desenhar(this.ctx, this.camada);
    
    if(this.assets.acabou()){
      for (let s = 0; s < this.sprites.length; s++) {
        const sprite = this.sprites[s];
        sprite.desenhar(this.ctx);
      }
    }
    this.ctx.restore();
    this.ctx.resetTransform();
  }
  adicionar(sprite) {
    sprite.cena = this;
    this.sprites.push(sprite);
  }
  passo(dt) {
    if(this.assets.acabou()){
      for (const sprite of this.sprites) {
        sprite.passo(dt);
      }
    }
  }

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = (t - this.t0) / 1000;

    this.passo(this.dt);
    this.desenhar();
    this.checaColisao();
    this.removerSprites();

    if(this.rodando) {
      this.iniciar()
    };
    this.t0 = t;
  }
  iniciar() {
    this.rodando = true;
    this.idAnim = requestAnimationFrame((t) => {
      this.quadro(t);
    });
  }
  parar() {
    this.rodando = false;
    cancelAnimationFrame(this.idAnim);
    this.t0 = null;
    this.dt = 0;
  }
  checaColisao() {
    for (let a = 0; a < this.sprites.length - 1; a++) {
      const spriteA = this.sprites[a];
      for (let b = a + 1; b < this.sprites.length; b++) {
        const spriteB = this.sprites[b];
        if (spriteA.colidiuCom(spriteB)) {
          this.quandoColidir(spriteA, spriteB);
        }
      }
    }
  }
  quandoColidir(a, b) {
    if (!this.aRemover.includes(a)) {
      this.aRemover.push(a);
    }
    if (!this.aRemover.includes(b)) {
      this.aRemover.push(b);
    }
  }
  removerSprites() {
    for (const alvo of this.aRemover) { 
      const idx = this.sprites.indexOf(alvo);
      if (idx >= 0) {
        this.sprites.splice(idx, 1);
      }
    }
    this.aRemover = [];
  }

  configuraMapa(mapa){
    this.mapa = mapa;
    this.mapa.cena = this;
  }

  preparar(){
    this.sprites = [];
    this.aRemover = [];
    this.t0 = null;
    this.dt = 0;
    this.idAnim = null;
    this.mapa = null;
    this.rodando = true;
  }
}
