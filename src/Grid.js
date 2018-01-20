import React, { Component } from 'react';
import styled from 'styled-components';

import Entity from './Entity';
import { SCREEN_SIZE, FONT_SIZE } from './constant';
import { getPositionAndSize } from './util';

const InitialDiv = styled.div`
  position: absolute;
  height: 0;
  width: 0;
  left: ${props => props.left};
  top: ${props => props.top};
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.fontSize};
  z-index: ${props => props.zIndex};
  font-weight: bolder;
`;

const Div = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${props => props.bgColor || props.theme.lightBg };
  color: ${props => props.fgColor || props.theme.darkBg };
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  z-index: ${props => props.zIndex};
  font-size: ${props => props.fontSize};
  display: flex;
  justify-content: center;
  align-items: center;
`;

class Grid extends Component {
  getEntityDetail(entity) {
    const emptyEntity = Entity.createEmpty();
    return entity.val === 1 ? emptyEntity : entity;
  }

  getFontSize() {
    return this.props.browserWidth <= parseInt(SCREEN_SIZE, 10)
      ? FONT_SIZE.thinFontSize
      : FONT_SIZE.widerFontSize;
  }

  render() {
    const { x, y, entity, browserWidth } = this.props;
    const fontSize = this.getFontSize();
    const { top, left, width, height } = getPositionAndSize(x, y, browserWidth);

    // 当x、y是负数时，证明是初始化还没有值的小方块
    if (entity.val === 1) {
      const initialLeft = left + width / 2;
      const initialTop = top + height / 2;
      // console.log('(' + x + ', ' + y + '), initialLeft: ' + initialLeft)
      // console.log('(' + x + ', ' + y + '), initialTop: ' + initialTop)
      return (
        <InitialDiv
          className={`jquery-animate-showup-${x}-${y}`}
          left={`${initialLeft}rem`}
          top={`${initialTop}rem`}
          fontSize={`${fontSize}rem`}
          zIndex={5}
        />
      );
    }

    // 生成了值
    const { val, bgColor, fgColor } = this.getEntityDetail(entity);
    return (
      <Div
        className={`jquery-animate-move-${x}-${y}`}
        top={`${top}rem`}
        left={`${left}rem`}
        width={`${width}rem`}
        height={`${height}rem`}
        zIndex={2}
        bgColor={bgColor}
        fgColor={fgColor}
        fontSize={`${fontSize}rem`}
      >
        {val}
      </Div>
    );
  }
}

export default Grid;