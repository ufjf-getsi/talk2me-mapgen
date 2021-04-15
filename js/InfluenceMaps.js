import InfluenceMap from "./InfluenceMap.js";

export default class InfluenceMaps{
  constructor(rows=25, columns=25){
    this.rows = rows;
    this.rows = columns;
    this.maps = new Map();
    this.maps.set(0, new InfluenceMap(rows, columns));
    this.maps.set(1, new InfluenceMap(rows, columns));
    this.maps.set(2, new InfluenceMap(rows, columns));
    this.maps.set(3, new InfluenceMap(rows, columns));
    this.maps.set(4, new InfluenceMap(rows, columns));
    this.maps.set(5, new InfluenceMap(rows, columns));
  }

  addElement(key, row, column)
  {
    const map = this.maps.get(key);
    map.addElement(row, column)
  }

  verifyElement(key, row, column)
  {
    if(this.maps.get(key).values[row][column] == 0 || this.maps.get(key+3).values[row][column] == 0) 
    {
      return true;
    }
    return false;
  }

  getElement(key, row, column)
  {
    const map = this.maps.get(key);
    return map.values[row][column];
  }

  atualizaMapa(key, row, column)
  {
    const map = this.maps.get(key);
    map.values[row][column] = Infinity;
    let novoMapa = new InfluenceMap(this.rows, this.columns);
    for (let r = 0; r < map.values.length; r++) {
      for (let c = 0; c < map.values[0].length; c++) {
        if(map.values[r][c] == 0)
        {
          novoMapa.addElement(r, c);
        }
      }
    }
    this.maps.set(key,novoMapa);
  }
}