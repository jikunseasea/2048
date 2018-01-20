import * as $ from 'jquery';
import { toggleLocation, location2absolute } from './util';
import { resetState, updateState, isNullState, isEqualState } from './states';
import { createBlock } from './blocks';
import { resetGame } from './gameControl';

const findTargetByStep = function (states, curIndex, step, boundary) {
  let targetIndex = -1;
  let ptr = curIndex - step;
  while (isNullState(states[ptr]) && ptr !== boundary - step) {
    ptr -= step;
  }
  if (ptr !== boundary - step
      && isEqualState(states[ptr], states[curIndex])) {
    targetIndex = ptr;
  } else {
    targetIndex = ptr + step
  }
  return targetIndex;
}


const findTarget = function (states, configs) {
  const {
    direction,
    startX,
    startY,
    stepX,
    stepY,
    x,
    y,
    col,
    row
  } = configs;

  let targetIndex = -1;

  const curIndex = toggleLocation({ col, row }, x, y);
  let step = 0;
  let boundary = 0;
  if (direction === 'horrizon') {
    step = stepX;
    boundary = y * col + startX - step;
  } else {
    step = stepY * col;
    boundary = (startY - stepY) * col + x;
  }
  targetIndex = findTargetByStep(states, curIndex, step, boundary);

  return targetIndex;

};

const isAlreadyWon = function (states, settings) {
  const { winLevel: WIN_LEVEL, blockKinds: BLOCK_KINDS } = settings;
  return states.some(s => {
    if (s.kind) {
      return s.kind.value >= BLOCK_KINDS[WIN_LEVEL].value;
    }
    return false;
  });
};

const moveAgent = function ($box, states, settings, moveConfigs) {
  return new Promise(resolve => {
    const {
      col,
      row,
      blockKinds: BLOCK_KINDS,
      winLevel: WIN_LEVEL
    } = settings;
    const {
      startX,
      startY,
      endX,
      endY,
      stepX,
      stepY
    } = moveConfigs;
    let validDirection = false;
    for (let x = startX; x !== endX + stepX; x += stepX) {
      for (let y = startY; y !== endY + stepY; y += stepY) {
        const curIndex = toggleLocation({ col, row }, x, y);
        if (!isNullState(states[curIndex])) {
          validDirection = true;
          const findConfigs = $.extend({}, moveConfigs, { x, y, col, row });
          const targetIndex = findTarget(states, findConfigs);
          if (curIndex !== targetIndex) {
            const $curContent = states[curIndex].dom;
            const $targetContent = states[targetIndex].dom;
            const targetLocation = location2absolute(settings, targetIndex);
            if (isNullState(states[targetIndex])) {
              updateState(states[targetIndex], states[curIndex]);
              resetState(states[curIndex]);
              $curContent.animate(targetLocation, () => {
                resolve();
              });
            } else {
              // Merge
              const preLevel = states[targetIndex].kind.level;
              // const postBlockKind = BLOCK_KINDS[preLevel + 1];
              let postBlockKind = {};
              if (preLevel < BLOCK_KINDS.length - 1) {
                postBlockKind = BLOCK_KINDS[preLevel + 1];
              } else {
                postBlockKind.value = states[targetIndex].kind.value * 2;
              }
              const won = isAlreadyWon(states, settings);
              updateState(states[curIndex], { kind: null });
              updateState(states[targetIndex], { kind: postBlockKind });
              $curContent.animate(targetLocation, () => {
                $curContent.remove();
                $targetContent.css(postBlockKind.style);
                $targetContent.html(postBlockKind.value);
                if (!won
                    && postBlockKind.level === WIN_LEVEL
                    && !confirm('你赢了，是否继续玩耍？')) {
                    resetGame($box, states, settings);
                }
                resolve();
              });
              // const mergePromise = new Promise(mergeResolve => {
              //   $curContent.animate(targetLocation, () => {
              //     $curContent.remove();
              //     $targetContent.css(postBlockKind.style);
              //     $targetContent.html(postBlockKind.value);
              //     if (postBlockKind.level === WIN_LEVEL) {
              //       alert('You win!!');
              //     }
              //     mergeResolve();
              //   });
              // }).then(() => {
              //   return new Promise(mergeResolve => {
              //     $curContent.animate({
              //       transform: 'scale(1.2, 1.2)',
              //       opacity: 0.3
              //     }, mergeResolve);
              //   });
              // }).then(() => {
              //   $curContent.animate({
              //     transform: 'scale(1, 1)',
              //     opacity: 1
              //   }, resolve);
              // });
            }
          }
        }
      }
    }
    // validDirection || resolve();
    if (!validDirection) {
      resolve();
    }
  });
};

const moveTo = function ($box, states, settings, direction) {
  let moveConfigs = {};
  const { col, row } = settings;
  switch (direction) {
    case 'up':
      moveConfigs = {
        direction: 'vertical',
        startX: 0,
        startY: 1,
        endX: col - 1,
        endY: row - 1,
        stepX: 1,
        stepY: 1
      };
      break;
    case 'down':
      moveConfigs = {
        direction: 'vertical',
        startX: 0,
        startY: row - 2,
        endX: col - 1,
        endY: 0,
        stepX: 1,
        stepY: -1
      };
      break;
    case 'left':
      moveConfigs = {
        direction: 'horrizon',
        startX: 1,
        startY: 0,
        endX: col - 1,
        endY: row - 1,
        stepX: 1,
        stepY: 1
      };
      break;
    default:
      // right
      moveConfigs = {
        direction: 'horrizon',
        startX: col - 2,
        startY: 0,
        endX: 0,
        endY: row - 1,
        stepX: -1,
        stepY: 1
      };
  }
  return moveAgent($box, states, settings, moveConfigs);
};

export const move = function ($box, states, settings, direction) {
  moveTo($box, states, settings, direction);
  createBlock($box, states, settings);
}
