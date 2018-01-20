import * as $ from 'jquery';

export default function (defaultOptions, options) {
  const settings = $.extend({}, defaultOptions, options);

  let boxWidth = 0;
  let boxHeight = 0;
  let blockWidth = 0;
  let blockHeight = 0;
  let col = 0;
  let row = 0;
  let initBlockNum = 0;
  let intervalSize = 0;
  col = parseInt(settings.col);
  if (typeof col !== 'number' || col < 1) {
    throw 'Wrong settings of col!';
  }

  row = parseInt(settings.row);
  if (typeof row !== 'number' || row < 1) {
    throw 'Wrong settings of row!';
  }

  blockWidth = parseInt(settings.blockWidth);
  if (isNaN(blockWidth)) {
    throw 'Wrong settings of blockWidth!';
  }

  blockHeight = parseInt(settings.blockHeight);
  if (isNaN(blockHeight)) {
    throw 'Wrong settings of blockHeight!';
  }

  intervalSize = parseInt(settings.intervalSize);
  if (isNaN(intervalSize)) {
    throw 'Wrong settings of intervalSize!';
  }

  boxWidth = col * blockWidth + (col + 1) * intervalSize;
  boxHeight = row * blockHeight + (row + 1) * intervalSize;

  initBlockNum = settings.initBlockNum;
  if (typeof initBlockNum !== 'number' || initBlockNum < 2) {
    throw 'InitBlockNum must be greeter than or equals to 2!';
  }

  return $.extend({}, settings, {
    boxWidth,
    boxHeight,
    blockWidth,
    blockHeight,
    col,
    row,
    initBlockNum,
    intervalSize
  });
}
