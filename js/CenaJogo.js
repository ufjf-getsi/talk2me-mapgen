import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Player from "./Player.js";

export default class CenaJogo extends Cena {
  quandoColidir(a, b) {
    if(a.tags.has("pc") && b.tags.has("planet")){
      for (let item of b.lista)
      {
        if (item < this.NumberGem) {
          a.cargas[item] += 1;
          this.mapa.maps.atualizaMapa(item, a.planetX, a.planetY);
          b.lista.delete(item)
        } else {
          if(a.cargas[item-3] > 0)
          {
            a.score += a.cargas[item-3];
            a.cargas[item-3] = 0;
            this.mapa.maps.atualizaMapa(item, a.planetX, a.planetY);
            b.lista.delete(item)
          }
        }
      }
    }
    if(a.tags.has("planet") && b.tags.has("pc"))
    {
      for (let item of a.lista)
      {
        if (item < this.NumberGem) {
          b.cargas[item] += 1;
          this.mapa.maps.atualizaMapa(item, b.planetX, b.planetY);
          a.lista.delete(item)
        } else {
          if(b.cargas[item-3] > 0)
          {
            b.score += b.cargas[item-3];
            b.cargas[item-3] = 0;
            this.mapa.maps.atualizaMapa(item, b.planetX, b.planetY);
            a.lista.delete(item)
          }
        }
      }
    }
  }
  preparar() {
    super.preparar();

    const mapa1 = new Mapa();
    mapa1.criaGerador(0);
    mapa1.criaGerador(1);
    mapa1.criaGerador(2);
    mapa1.criaGerador(0);
    mapa1.criaGerador(1);
    mapa1.criaGerador(2);
    mapa1.criaConsumidor(0);
    mapa1.criaConsumidor(1);
    mapa1.criaConsumidor(2);
    this.configuraMapa(mapa1);
    for (let r = 0; r < this.mapa.planets.length; r++) {
      for (let c = 0; c < this.mapa.planets[0].length; c++) {
        this.adicionar(this.mapa.planets[r][c]);
      }
    }
    const pc = new Player(this.NumberGem, 3.5, 3.5);
    pc.tags.add("pc");
    this.adicionar(pc);
  }
}
