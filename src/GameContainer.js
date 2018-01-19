import React, { Component } from 'react';
import styled from 'styled-components';
import Box from './Box';
import Grid from './Grid';


import { GAME_SIZE, SCREEN_SIZE } from './constant';

import { flattenCells } from './util';


const Wrapper = styled.div`
  height: ${props => GAME_SIZE.width};
  padding-top: 3rem;
  @media (min-width: ${SCREEN_SIZE}) {
    height: ${props => GAME_SIZE.widerWidth};
  }
`;

const Fork = styled.a`
  font-size: 2rem;
`;

export class GameContainer extends Component {

  generateGridsFromCells(cells) {
    const { browserWidth } = this.props;
    return flattenCells(cells).map(cell => (
      <Grid
        key={`${cell.x}-${cell.y}`}
        x={cell.x}
        y={cell.y}
        entity={cell.entity}
        browserWidth={browserWidth}
      />
    ));
  }


  render() {
    const { cells } = this.props;
    return (
      <Wrapper>
        <Box browserWidth={this.props.browserWidth}>
          {this.generateGridsFromCells(cells)}
        </Box>
        <Fork href="https://github.com/jkest/2048" target="_blank">GIVE ME A STAR!</Fork>
      </Wrapper>
    );
  }
}



export default GameContainer;