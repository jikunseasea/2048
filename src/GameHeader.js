import React, { Component } from 'react';
import styled from 'styled-components';

import Score from './Score';
import Restart from './Restart';

const Wrapper = styled.div`
  position: relative;
`;

const H1 = styled.div`
  color: ${props => props.theme.newGameBg};
  font-size: 5rem;
  padding: 3rem 0 1rem;
  @media (max-height: 500px) {
    padding-top: 1rem;
  }
`;


class GameHeader extends Component {
  render() {
    const { restartGame } = this.props;
    return (
      <Wrapper>
        <H1>2048</H1>
        <Score score={this.props.score}/>
        <Restart restartGame={restartGame}/>
      </Wrapper>
    );
  }
}


export default GameHeader;