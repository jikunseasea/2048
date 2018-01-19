import Entity from './Entity';


class Cell {
  constructor(x, y, entityId = 0, val) {
    this.entity = new Entity(entityId, val);
    this.x = x;
    this.y = y;
  }

  // 本不应该使用 static 方法，但是为了使用 localStorage
  // 所以不能使用实例方法
  static setEntityById(cell, entityId) {
    cell.entity = new Entity(entityId);
  }
}



export default Cell;