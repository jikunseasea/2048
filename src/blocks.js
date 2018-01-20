import * as $ from 'jquery';
import { resetGame } from './gameControl';

import { toggleLocation, location2absolute } from './util';

import { findEmpty } from './states';

const buildBlocks = function ($box, settings) {
  const { row, col } = settings;
  const corBlocks = [];
  for (let y = 0; y < row; ++y) {
    for (let x = 0; x < col; ++x) {
      const $block = $('<div></div>');
      $block.css({
        width: settings.blockWidth,
        height: settings.blockHeight,
        borderRadius: settings.blockRadius,
        backgroundColor: settings.blockColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      });
      $.extend($block, { x, y });
      corBlocks.push($block);
    }
  }
  $box.append(corBlocks);

  return corBlocks;
};
export { buildBlocks };

const createBlock = function ($box, states, settings, ...configs) {
  return new Promise(resolve => {
    const [level, x, y] = configs;
    const { col, row, blockKinds, blockWidth, blockHeight, showUpTime } = settings;


    let emptyIndex = -1;
    // let $emptyBlock = null;
    if (typeof x === 'number' && 0 <= x < col && typeof y === 'number' && 0 <= y < row) {
      emptyIndex = toggleLocation(settings, x, y);
    } else if (typeof x === 'number' && 0 <= x < col * row) {
      emptyIndex = x;
    } else {
      emptyIndex = findEmpty(states);
    }
    if (emptyIndex === -1) {
      if (confirm('游戏结束，是否重新开始？')) {
        resetGame($box, states, settings);
      }
    }

    let initBlockKind = null;
    if (typeof level === 'number') {
      initBlockKind = settings.blockKinds[level];
    } else {
      initBlockKind = Math.random() > 0.5 ? blockKinds[0] : blockKinds[1];
    }

    const $contentBlock = $('<div></div>');
    const { left, top } = location2absolute(settings, emptyIndex);

    const initialAnimate = {
      height: blockHeight * 0.1,
      width: blockWidth * 0.1,
      opacity: 0,
      left: left + blockWidth / 2,
      top: top + blockHeight / 2,
      position: 'absolute',
      zIndex: 100
    };
    const initialCss = $.extend({}, initBlockKind.style, initialAnimate);

    const finalAnimate = {
      height: blockHeight,
      width: blockWidth,
      opacity: 1,
      left,
      top
    };
    const finalCss = $.extend({}, initialCss, finalAnimate);

    $contentBlock.css(initialCss);
    $contentBlock.html(initBlockKind.value);
    $contentBlock.animate(finalCss, showUpTime, resolve);
    states[emptyIndex] = {
      kind: initBlockKind,
      dom: $contentBlock
    };
    $contentBlock.addClass('content');
    $box.append($contentBlock);
  });
};

export { createBlock };

export const initBlocks = function ($box, states, settings) {
  createBlock($box, states, settings);
  createBlock($box, states, settings);
};
