export default class InfluenceMap {
  constructor(rows = 20, columns = 20, method = () => {}) {
    this.values = Array(rows)
      .fill()
      .map(() => Array(columns).fill(Infinity));
    this.method = method;
  }
  updateValues(world) {
    this.method();
  }
}
