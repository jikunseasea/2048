import React, { Component } from 'react';
import styled from 'styled-components';

import { BOX_OPTION } from './constant';

import { getPositionAndSize } from './util';

const Div = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${props => props.bgColor || props.theme.lightBg };
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  z-index: ${props => props.zIndex};
`;

export class StaticGrid extends Component {
  render() {
    const { x, y, browserWidth } = this.props;
    const { top, left, width, height } = getPositionAndSize(x, y, browserWidth);
    return (
      <Div
        top={`${top}rem`}
        left={`${left}rem`}
        width={`${width}rem`}
        height={`${height}rem`}
        zIndex={1}
      />
    );
  }
}

class StaticGrids extends Component {
  renderGrids() {
    const grids = [];
    const { ROW_SIZE, COL_SIZE } = BOX_OPTION;
    for (let y = 0; y < ROW_SIZE; ++y) {
      for (let x = 0; x < COL_SIZE; ++x) {
        grids.push(
          <StaticGrid
            key={`static-${x}-${y}`}
            x={x}
            y={y}
            browserWidth={this.props.browserWidth}
          />
        );
      }
    }

    return grids;
  }

  render() {
    return (
      <React.Fragment>
        {this.renderGrids()}
      </React.Fragment>
    )
  }
}


export default StaticGrids;