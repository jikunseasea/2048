//
// ─── BUSINESS LOGIC ─────────────────────────────────────────────────────────────
//

import {
  showupAnimation,
  moveAnimation,
  addScoreAnimation
} from './animation.js';

import {
  BOX_OPTION,
  SCREEN_SIZE,
  GAME_SIZE,
  INITIAL_SCORE
} from './constant';
import Entity from './Entity';
import Cell from './Cell';

const { ROW_SIZE, COL_SIZE, GUT } = BOX_OPTION;

const getAbsFromCoor = (x, y, gridWidth, gridHeight, gutWidth, gutHeight) => {
  const gridWidthSize = parseFloat(gridWidth);
  const gridHeightSize = parseFloat(gridHeight);
  const gutWidthSize = parseFloat(gutWidth);
  const gutHeightSize = parseFloat(gutHeight);
  const top = (y + 1) * gutHeightSize + y * gridHeightSize;
  const left = (x + 1) * gutWidthSize + x * gridWidthSize;
  return { top, left };
}

const getGridSizeFromGut = (totalSize, gut, gridCnt) => {
  const parsedTotalSize = parseFloat(totalSize);
  const parsedGut = parseFloat(gut);
  return (parsedTotalSize - (gridCnt + 1) * parsedGut) / gridCnt;
};

const thinWidth = getGridSizeFromGut(GAME_SIZE.width, GUT, COL_SIZE);
const thinHeight = getGridSizeFromGut(GAME_SIZE.width, GUT, ROW_SIZE);
const widerWidth = getGridSizeFromGut(GAME_SIZE.widerWidth, GUT, COL_SIZE);
const widerHeight = getGridSizeFromGut(GAME_SIZE.widerWidth, GUT, ROW_SIZE);

const getPositionAndSize = (x, y, browserWidth) => {
  if (browserWidth <= parseInt(SCREEN_SIZE, 10)) {
    const [width, height] = [thinWidth, thinHeight];
    return {
      width,
      height,
      ...getAbsFromCoor(x, y, width, height, GUT, GUT),
    }
  }
  const [width, height] = [widerWidth, widerHeight];
  return {
    width,
    height,
    ...getAbsFromCoor(x, y, width, height, GUT, GUT),
  }
}

const getCoorFromIndex = index => ({
  x: index % COL_SIZE,
  y: Math.floor(index / COL_SIZE)
});

const getIndexFromCoor = (x, y) => y * COL_SIZE + x;

const generateTwoOrFour = () => Math.random() > 0.5 ? 1 : 2;

const isValidCoor = (x, y) => {
  if (x !== 'number') return false;
  if (x < 0 || x > COL_SIZE) return false;
  if (y !== 'number') return false;
  if (y < 0 || y > ROW_SIZE) return false;
  return true;
}

const findEmpty = cells => {
  const cellArr = flattenCells(cells);
  const emptyArr = [];
  cellArr.forEach((cell, i) => {
    if (cell.entity.val === 1) {
      emptyArr.push(i);
    }
  });
  if (emptyArr.length === 0) {
    return -1;
  }
  const randomIndex = Math.floor(Math.random() * emptyArr.length);
  return getCoorFromIndex(emptyArr[randomIndex]);
}

const mergeCells = (cells, target) => {
  const targetRow = [...cells[target.y]];
  const mergedRow = [
    ...targetRow.slice(0, target.x),
    target,
    ...targetRow.slice(target.x + 1)
  ]
  return [
    ...cells.slice(0, target.y),
    mergedRow,
    ...cells.slice(target.y + 1)
  ];
};




const initCells = () => {
  const rows = Array.from({ length: ROW_SIZE });
  return rows.map((_, y) => 
    Array.from({ length: COL_SIZE }).map((_, x) => new Cell(x, y))
  );
}

const isEmptyCells = cells => {
  for (let row of cells) {
    for (let cell of row) {
      if (cell.entity.val !== 1)
        return false;
    }
  }
  return true;
}

const flattenCells = cellMatrix => {
  let cellArr = [];
  cellMatrix.forEach(cellRow => {
    cellArr = [...cellArr, ...cellRow];
  });
  return cellArr;
};

const generateCell = (cells, x, y, entityId) => {
  let emptyCoor = -1;
  if (isValidCoor(x, y)) {
    emptyCoor = { x, y };
  } else {
    emptyCoor = findEmpty(cells);
  }
  if (emptyCoor === -1) return null;
  const entityIndex = entityId !== undefined ? entityId : generateTwoOrFour();
  return new Cell(emptyCoor.x, emptyCoor.y, entityIndex);
}

const generateCellPromise = (cells, cellCount, browserWidth) => {
  const result = [];
  let temp = [...cells];
  for (let i = 0; i < cellCount; ++i) {
    const cell = generateCell(temp);
    if (cell === null) {
      throw new Error('Can not generate cell!')
    }
    temp = mergeCells(temp, cell);
    result.push(cell);
    // TODO: Refactor animation, here use jquery, which is a hack
    showupAnimation(cell, browserWidth);
  }
  // 等待动画执行完毕
  return result;
};

const generateCellResolve = generated => cells => {
  let result = [...cells];
  for (let g of generated) {
    result = mergeCells(result, g);
  }
  return result;
};

const canMoveByDirection = (
  START_Y, END_Y,
  START_X, END_X,
  OFFSET_X, OFFSET_Y,
  ...args
) => cells => {
  console.log(...args);
  for (let i = START_Y; i < END_Y; ++i) {
    for (let j = START_X; j < END_X; ++j) {
      if (cells[i][j].entity.val > 1) {
        const { val } = cells[i + OFFSET_Y][j + OFFSET_X].entity;
        if (val === 1 || val === cells[i][j].entity.val) {
          return true;
        }
      }
    }
  }
  return false;
}

const canMoveLeft = canMoveByDirection(
  0, ROW_SIZE,
  1, COL_SIZE,
  -1, 0
);

const canMoveRight = canMoveByDirection(
  0, ROW_SIZE,
  0, COL_SIZE - 1,
  1, 0
);

const canMoveUp = canMoveByDirection(
  1, ROW_SIZE,
  0, COL_SIZE,
  0, -1
);

const canMoveDown = canMoveByDirection(
  0, ROW_SIZE - 1,
  0, COL_SIZE,
  0, 1
);

const canMove = cells => (
  canMoveLeft(cells)
  || canMoveRight(cells)
  || canMoveUp(cells)
  || canMoveDown(cells)
);

const noBlockHorizontal = (rowIndex, x0, x1, cells) => {
  const [fromX, toX] = x0 <= x1 ? [x0, x1] : [x1, x0];
  for (let i = fromX + 1; i < toX; ++i) {
    if (cells[rowIndex][i].entity.val !== 1) {
      return false;
    }
  }
  return true;
};

const noBlockVertical = (colIndex, y0, y1, cells) => {
  const [fromY, toY] = y0 <= y1 ? [y0, y1] : [y1, y0];
  for (let i = fromY + 1; i < toY; ++i) {
    if (cells[i][colIndex].entity.val !== 1) {
      return false;
    }
  }
  return true;
};

const noBlockBetween = (fromX, fromY, toX, toY, cells) => {
  if (fromX === toX)
    return noBlockVertical(fromX, fromY, toY, cells);
  else if (fromY === toY)
    return noBlockHorizontal(fromY, fromX, toX, cells);
  
  throw new Error('FROM or TO either in the same col or row!');
};

const makeSimpleMatrix = (row, col, value) => (
  Array.from({ length: row }).map(r => Array.from({ length: col }).fill(value))
);

const movePromise = (
  START_Y, END_Y, STEP_Y,
  START_X, END_X, STEP_X,
  START_K,
  isMoveHorrizontal,
  ...args
) => (cells, browserWidth) => {
  const hasConflicted = makeSimpleMatrix(ROW_SIZE, COL_SIZE, false);
  let result = [...cells];
  const merged = [];
  for (let i = START_Y; i !== END_Y; i += STEP_Y) {
    for (let j = START_X; j !== END_X; j += STEP_X) {
      if (result[i][j].entity.val !== 1) {
        const [fromX, fromY] = [j, i];
        const endK = isMoveHorrizontal ? j : i;
        const stepK = START_K < endK ? 1 : -1;
        for (let k = START_K; k !== endK; k += stepK) {
          // 如果中途没有阻拦则可能可以到达
          const [toX, toY] = isMoveHorrizontal ? [k, i] : [j, k];
          if (noBlockBetween(fromX, fromY, toX, toY, result)) {
            const src = result[fromY][fromX];
            const des = result[toY][toX];
            // 如果当前位置没有数，则可以直接到达
            if (des.entity.val === 1) {
              moveAnimation(src, toX, toY, browserWidth);
              // 覆盖掉当前位置的 cell 的 entity
              Object.assign(des, { entity: src.entity, x: toX, y: toY });
              // 在原有位置生成一个新的初始 cell
              Cell.setEntityById(src, 0);
              break;
            }
            // 或者当前位置和 cells[i][j] 可以合并(值相等)
            // else if (des.entity.val === src.entity.val && !hasConflicted[toY][toX]) {
            else if (des.entity.val === src.entity.val) {
              moveAnimation(src, toX, toY, browserWidth);
              const curId = Entity.getIdByVal(src.entity.val);
              // 当前位置上生成新的 cell
              if (curId === -1) des.entity.val *= 2;
              else Cell.setEntityById(des, curId + 1);
              // 在原有位置生成一个新的初始 cell
              Cell.setEntityById(src, 0);
              merged.push({ x: toX, y: toY, value: des.entity.val });
              hasConflicted[toY][toX] = true;
              break;
            }
          }
        }
      }
    }
  }
  return { moved: result, merged };
};

const moveLeftPromise = movePromise(
  0, ROW_SIZE, 1,
  1, COL_SIZE, 1,
  0,
  true,
  'left'
);

const moveRightPromise = movePromise(
  0, ROW_SIZE, 1,
  COL_SIZE - 2, -1, -1,
  COL_SIZE - 1,
  true
);

const moveUpPromise = movePromise(
  1, ROW_SIZE, 1,
  0, COL_SIZE, 1,
  0,
  false
);

const moveDownPromise = movePromise(
  ROW_SIZE - 2, -1, -1,
  0, COL_SIZE, 1,
  ROW_SIZE - 1,
  false
);

const canMoveByDirectionMap = {
  'left': canMoveLeft,
  'up': canMoveUp,
  'right': canMoveRight,
  'down': canMoveDown
};

const movePromiseByDirectionMap = {
  'left': moveLeftPromise,
  'up': moveUpPromise,
  'right': moveRightPromise,
  'down': moveDownPromise
};

const addScore = scoreToBeAdded => {
  addScoreAnimation(scoreToBeAdded);
};

const getInitialFromStorage = storageName => {
  const local = localStorage.getItem(storageName);
  if (local) {
    const { cells, score } = JSON.parse(local);
    return { initialCells: cells, initialScore: score };
  }
  return { initialCells: initCells(), initialScore: INITIAL_SCORE };
};

export {
  getAbsFromCoor,
  getGridSizeFromGut,
  getCoorFromIndex,
  getIndexFromCoor,
  mergeCells,
  initCells,
  isEmptyCells,
  flattenCells,
  generateCellPromise,
  generateCellResolve,
  canMoveByDirectionMap,
  movePromiseByDirectionMap,
  getPositionAndSize,
  addScore,
  getInitialFromStorage,
  canMove
};