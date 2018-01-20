import $ from 'jquery';

import {
  SHOW_UP_DURATION,
  MOVE_DURATION,
  FADE_IN,
  FADE_OUT
} from './constant';
import { getPositionAndSize } from './util';

const showupAnimation = (cell, browserWidth) => {
  const { x, y, entity } = cell;
  const $cell = $(`.jquery-animate-showup-${x}-${y}`);

  const { top, left, width, height } = getPositionAndSize(x, y, browserWidth);

  $cell
    .css('background-color', entity.bgColor)
    .css('color', entity.fgColor)
    .text(entity.val);

  $cell.animate({
    width: `${width}rem`,
    height: `${height}rem`,
    top: `${top}rem`,
    left: `${left}rem`,
    opacity: 1
  }, SHOW_UP_DURATION);
}

const moveAnimation = (fromX, fromY, toX, toY, browserWidth) => {
  // const { x: fromX, y: fromY } = src;
  const $cell = $(`.jquery-animate-move-${fromX}-${fromY}`);
  const { top: toTop, left: toLeft } = getPositionAndSize(toX, toY, browserWidth);
  console.log(fromX, fromY, toX, toY)
  console.log(toLeft)

  $cell.animate({
    top: `${toTop}rem`,
    left: `${toLeft}rem`
  }, MOVE_DURATION
  // , () => {
  //   $cell.removeAttr('style')
  // }
);
  
}

const addScoreAnimation = scoreToBeAdded => {
  const $scoreAdded = $('.jquery-animate-score');
  $scoreAdded.text('+' + scoreToBeAdded);
  $scoreAdded.fadeIn(FADE_IN);
  $scoreAdded.fadeOut(FADE_OUT);
};



export {
  showupAnimation,
  moveAnimation,
  addScoreAnimation
};