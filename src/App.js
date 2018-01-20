import React, { Component } from 'react';
import ReactModal from 'react-modal';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

import GameHeader from './GameHeader';
import GameContainer from './GameContainer';
import { GAME_SIZE, SCREEN_SIZE, INITIAL_CELL, ACTION_TYPES } from './constant';

import {
  isEmptyCells,
  canMoveByDirectionMap,
  canMove
} from './util';

import {
  TOUCH_FACTOR
} from './constant';

import service from './service';

injectGlobal`
  html {
    font-size: 10px;
    height: 100%;
    background-color: #ecf0f1;
  }
`;

const theme = {
  newGameBg: '#2980b9',
  darkBg: '#BDBDBD',
  lightBg: '#90CAF9',
  ctrText: '#ecf0f1'
};

const Wrapper = styled.div`
  margin: auto;
  width: ${props => GAME_SIZE.width};
  font-family: 'Consolas', 'monospaced', 'Ubuntu Mono';
  @media (min-width: ${SCREEN_SIZE}) {
    width: ${props => GAME_SIZE.widerWidth};
  }
`;

const Button = styled.button`
  border: none;
  cursor: pointer;
  padding: .85rem;
  border-radius: .85rem;
  background-color: ${props => props.theme.newGameBg};
  color: ${props => props.theme.ctrText};
`;

const keyDownMap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cells: [[]],
      score: 0,
      showModal: false,
      browserWidth: window.innerWidth
    }

    this.createGame = this.createGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.updateBrowserWidth = this.updateBrowserWidth.bind(this);
    this.restartAndHide = this.restartAndHide.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.touchStartCoor = { startX: 0, startY: 0 };
  }

  handleKeyDown(e) {
    const { keyCode } = e;
    if (keyDownMap.hasOwnProperty(keyCode)) {
      e.preventDefault();
      this.gameController(keyDownMap[keyCode]);
    }
  }
 
  gameController(direction) {
    const canMoveDirection = canMoveByDirectionMap[direction];
    const moveDirection = service.move(direction);
    const { cells, browserWidth } = this.state;
    if (canMoveDirection(cells)) {
      moveDirection(cells, browserWidth);
    }
  }

  generateCell() {
    service.generate(this.state.cells, 1, this.state.browserWidth);
  }
  
  generateCellIfNeeded(type) {
    const { MOVE_CELL } = ACTION_TYPES;
    if (type === MOVE_CELL) {
      this.generateCell();
    }
  }

  createGame() {
    service.generate(this.state.cells, INITIAL_CELL, this.state.browserWidth);
  }

  restartGame() {
    service.reset();
    // this.createGame();
    // 注意这里不需要再手动 create 了，因为在 componentDidUpdate 里面已经做了自动的处理
  }

  restartAndHide() {
    this.restartGame();
    this.setState({ showModal: false });
  }

  updateBrowserWidth(e) {
    this.setState({ browserWidth: window.innerWidth });
  }

  handleIsGameOver(cells) {
    if (!canMove(cells) && !isEmptyCells(cells)) {
      this.setState({ showModal: true });
    }
  }

  componentDidMount() {
    this.cellsSubscription = service.cells$.subscribe(({ value, type }) => {
      this.setState({ cells: value }, () => {
        this.generateCellIfNeeded(type);
        this.handleIsGameOver(value);
      });
    });
    this.scoreSubscription = service.score$.subscribe(({ value, type }) => {
      this.setState({ score: value });
    });

    document.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.updateBrowserWidth);
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
  }
  componentWillUnmount() {
    this.cellsSubscription.unsubscribe();
    this.scoreSubscription.unsubscribe();

    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.updateBrowserWidth);
    document.removeListener('touchstart', this.handleTouchStart);
    document.removeListener('touchend', this.handleTouchEnd);
  }
  
  componentDidUpdate() {
    if (isEmptyCells(this.state.cells)) {
      this.createGame();
    }
  }

  handleTouchStart(e) {
    const startX = e.touches[0].pageX;
    const startY = e.touches[0].pageY;
    Object.assign(this.touchStartCoor, { startX, startY });
  }
  handleTouchEnd(e) {
    const { startX, startY } = this.touchStartCoor;
    const { pageX: endX, pageY: endY } = e.changedTouches[0];
    const [ deltaX, deltaY ] = [endX - startX, endY - startY];

    // 避免抖动（click）
    const threshold = this.state.browserWidth * TOUCH_FACTOR;
    const [abDeltaX, abDeltaY] = [Math.abs(deltaX), Math.abs(deltaY)];
    if (abDeltaX < threshold && abDeltaY < threshold) {
      return;
    }

    if (abDeltaX > abDeltaY) {
      if (deltaX > 0) {
        this.gameController('right');
      } else {
        this.gameController('left');
      }
    } else {
      if (deltaY > 0) {
        this.gameController('down');
      } else {
        this.gameController('up');
      }
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <GameHeader
            restartGame={this.restartGame}
            score={this.state.score}
          />
          <GameContainer
            cells={this.state.cells}
            browserWidth={this.state.browserWidth}
          />
          <ReactModal 
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
            ariaHideApp={false}
            style={{
              overlay: {
                zIndex: 10
              },
              content: {
                top: '50%',
                left: '50%',
                width: '40rem',
                transform: 'translate(-50%, -50%)',
                color: 'lightsteelbluea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }
            }}
          >
            游戏结束！
            <Button onClick={this.restartAndHide}>重新玩</Button>
          </ReactModal>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

export default App;
