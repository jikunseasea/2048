import * as $ from 'jquery';
import { move } from './moving';
import { resetState } from './states';
import { initBlocks } from './blocks';

export const launchListener = function ($box, states, settings) {
  $(document).keydown(e => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        move($box, states, settings, 'left');
        break;
      case 'ArrowUp':
        e.preventDefault();
        move($box, states, settings, 'up');
        break;
      case 'ArrowRight':
        e.preventDefault();
        move($box, states, settings, 'right');
        break;
      case 'ArrowDown':
        e.preventDefault();
        move($box, states, settings, 'down');
        break;
      default:
        console.log('Nothing to do...');
    }
  });

  const mouseBeginPosition = { x: 0, y: 0 };
  $(document).mousedown(e => {
    e.preventDefault();
    mouseBeginPosition.x = e.pageX;
    mouseBeginPosition.y = e.pageY;
  });
  $(document).mouseup(e => {
    e.preventDefault();
    const { pageX: endX, pageY: endY } = e;
    const { x: beginX, y: beginY } = mouseBeginPosition;
    const diffX = endX - beginX;
    const diffY = endY - beginY;
    if (Math.abs(diffX) + Math.abs(diffY) < 20) {
      return false;
    }
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        move($box, states, settings, 'right');
      } else {
        move($box, states, settings, 'left');
      }
      return true;
    } else if (diffY > 0) {
      move($box, states, settings, 'down');
      return true;
    }
    move($box, states, settings, 'up');
    return true;
  });
};

export const resetGame = function ($box, states, settings) {
  $box.find('.content').remove();
  resetState(...states);
  initBlocks($box, states, settings);
};