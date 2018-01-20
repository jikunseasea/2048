import * as $ from 'jquery';
const contentStyle = {
  fontSize: '34px',
  fontWeight: 'bolder',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
const BLOCK_KINDS = [
  {
    level: 0,
    value: 2,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 1,
    value: 4,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 2,
    value: 8,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 3,
    value: 16,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 4,
    value: 32,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 5,
    value: 64,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 6,
    value: 128,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 7,
    value: 256,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 8,
    value: 512,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 9,
    value: 1024,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 10,
    value: 2048,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 11,
    value: 4096,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
  {
    level: 12,
    value: 8192,
    style: $.extend({}, contentStyle, {
      backgroundColor: 'rgb(238,228,218)',
      color: 'rgb(124,115,106)'
    })
  },
];

export default {
  row: 4,
  col: 4,
  boxRadius: '10px',
  backgroundColor: 'rgb(187,173, 160)',
  blockWidth: '100px',
  blockHeight: '100px',
  intervalSize: '10px',
  blockColor: 'rgb(205, 193, 180)',
  blockRadius: '7px',
  blockKinds: BLOCK_KINDS,
  initBlockNum: 2,
  showUpTime: 300,
  winLevel: 10
};