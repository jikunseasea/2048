import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/do';


import { 
  MOVE_THROTTLE_TIME,
  ACTION_TYPES,
  STORAGE_NAME,
  DEBOUNCE_TIME,
  INITIAL_SCORE,
  SHOW_UP_DURATION,
  MOVE_DURATION
} from './constant';


import {
  generateCellPromise,
  generateCellResolve,
  movePromiseByDirectionMap,
  initCells,
  addScore,
  getInitialFromStorage,
} from './util';

const {
  RESET_CELLS,
  GENERATE_CELL,
  MOVE_CELL,
  ADD_SCORE,
  RESET_SCORE
} = ACTION_TYPES;

const { initialCells, initialScore } = getInitialFromStorage(STORAGE_NAME);

const createUpdate = () => (
  new BehaviorSubject({
    operation: v => v,
    type: null
  })
);

const scanUpdate = (stream$, initial) => (
  stream$
    .scan(({ value }, { type, operation }) => ({
      value: operation(value),
      type
    }), { value: initial })
    .publishReplay(1)
    .refCount()
);

class Service {
  constructor() {
    this.updateCells$ = createUpdate();
    this.resetCells$ = new Subject();
    this.generateCell$ = new Subject();
    this.moveCell$ = new Subject();
    this.updateScore$ = createUpdate();
    this.resetScore$ = new Subject();

    // 创建输出到 App 的流
    this.cells$ = scanUpdate(this.updateCells$, initialCells);
    this.score$ = scanUpdate(this.updateScore$, initialScore);

    // 本地存储
    const local$ = Observable.combineLatest(this.cells$, this.score$, (cells, score) => ({
      cells: cells.value,
      score: score.value
    }));
    local$.subscribe(store => {
      // localStorage.setItem(STORAGE_NAME, JSON.stringify(store));
    });


    this.resetCells$
      .debounce(() => Observable.interval(SHOW_UP_DURATION * 2))
      .map(() => cells => initCells())
      .subscribe(operation => {
        this.updateCells$.next({
          operation,
          type: RESET_CELLS
        })
      });

    this.generateCell$
      .map(({ cells, cellCount,browserWidth }) => (
        generateCellPromise(cells, cellCount, browserWidth)
      ))
      // .map(() => ([new Cell(0,0,1), new Cell(2,0,2)]))
      .delay(SHOW_UP_DURATION)
      .map(generated => generateCellResolve(generated))
      .subscribe(operation => {
        this.updateCells$.next({
          operation,
          type: GENERATE_CELL
        })
      });

    // 移动之后会有多个操作
    const movePromise$ = this.moveCell$
      .throttleTime(MOVE_THROTTLE_TIME)
      .map(({ direction, cells, browserWidth }) => (
        movePromiseByDirectionMap[direction](cells, browserWidth)
      ))
      .delay(MOVE_DURATION)
      .publishReplay(1)
      .refCount();

    // 移动之后更新 cells
    movePromise$
      .subscribe(({ result }) => {
        this.updateCells$.next({
          operation: () => result,
          type: MOVE_CELL
        });
      });
    
    // 筛选合并之后的操作
    const merged$ = movePromise$
      .filter(({ merged }) => merged.length > 0)
      .publishReplay(1)
      .refCount();
    
    // 合并之后更新 score$
    merged$
      .map(({ merged }) => score => (
        merged.reduce((acc, merge) => acc + merge.value, score)
      ))
      .subscribe(operation => {
        this.score$.next({
          operation,
          type: ADD_SCORE
        });
      });
    
    // 加分动画
    merged$
      .debounce(() => Observable.interval(DEBOUNCE_TIME))
      .map(({ merged }) => (
        merged.reduce((acc, merge) => acc + merge.value, 0)
      ))
      .subscribe(addScore);

    this.resetScore$
      .map(() => score => INITIAL_SCORE)
      .subscribe(operation => {
        this.score$.next({
          operation,
          type: RESET_SCORE
        });
      });

  }

  reset() {
    this.resetCells$.next();
    this.resetScore$.next();
  }

  generate(cells,cellCount, browserWidth) {
    this.generateCell$.next({ cells, cellCount, browserWidth });
  }

  move(direction) {
    return (cells, browserWidth) => {
      this.moveCell$.next({ direction, cells, browserWidth });
    }
  }

}


export default new Service();