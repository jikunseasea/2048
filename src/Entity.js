const PRE_ENTITIES = [
  { val: 1, fgColor: null, bgColor: null},
  { val: 2, fgColor: '#0099BC', bgColor: '#f1c40f'},
  { val: 4, fgColor: '#2D7D9A', bgColor: '#f39c12'},
  { val: 8, fgColor: '#00B7C3', bgColor: '#e67e22'},
  { val: 16, fgColor: '#038387', bgColor: '#d35400'},
  { val: 32, fgColor: '#00B294', bgColor: '#9b59b6'},
  { val: 64, fgColor: '#018574', bgColor: '#8e44ad'},
  { val: 128, fgColor: '#00CC6A', bgColor: '#3498db'},
  { val: 256, fgColor: '#10893E', bgColor: '#2980b9'},
  { val: 512, fgColor: '#55acee', bgColor: '#1abc9c'},
  { val: 1024, fgColor: '#00AFF0', bgColor: '#16a085'},
  { val: 2048, fgColor: '#1ab7ea', bgColor: '#c0392b'},
  { val: 'success', fgColor: 'white', bgColor: 'black'},
];

class Entity {
  constructor(id = 0, val) {
    if (id > PRE_ENTITIES.length - 1) {
      this.val = val ? val : PRE_ENTITIES[PRE_ENTITIES.length - 1].val;
      this.fgColor = PRE_ENTITIES[PRE_ENTITIES.length - 1].fgColor;
      this.bgColor = PRE_ENTITIES[PRE_ENTITIES.length - 1].bgColor;
    } else {
      this.val = PRE_ENTITIES[id].val;
      this.fgColor = PRE_ENTITIES[id].fgColor;
      this.bgColor = PRE_ENTITIES[id].bgColor;
    }
  }

  static createEmpty() {
    return ({
      val: '',
      fgColor: null,
      bgColor: null
    });
  }

  static getIdByVal(val) {
    return PRE_ENTITIES.findIndex(e => e.val === val);
  }
}

export default Entity;