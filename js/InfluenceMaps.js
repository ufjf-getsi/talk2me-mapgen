import InfluenceMap from "./InfluenceMap.js";

export default class InfluenceMaps{
  constructor(rows=25, columns=25){
    this.maps = new Map();
    this.maps.set("default", new InfluenceMap(rows, columns));
  }
}