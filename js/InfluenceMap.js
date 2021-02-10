export default class InfluenceMap {
  constructor(rows = 20, columns = 20) { //, method = () => {}
    this.values = Array(rows)
      .fill()
      .map(() => Array(columns).fill(Infinity));
    //this.method = method;
  }

  /*updateValues(world) {
    this.method();
  }*/

  addElement(row, column)
  {
    this.values[row][column] = 0;
    for (let r = 0; r < this.values.length; r++) {
        for (let c = 0; c < this.values[0].length; c++) {
            const d = Math.abs(row - r) + Math.abs(column - c);
            this.values[r][c] = Math.min(this.values[r][c], d);
        }
    }
  }
}
