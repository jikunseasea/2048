import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  border: none;
  cursor: pointer;
  font-size: 2rem;
  padding: .5rem;
  border-radius: .5rem;
  background-color: ${props => props.theme.newGameBg};
  color: ${props => props.theme.ctrText};
`;

class Restart extends Component {
  render() {
    const { restartGame } = this.props;
    return (
      <Wrapper>
        
        <Button onClick={restartGame}>重新玩</Button>
      </Wrapper>
    );
  }
}

export default Restart;
