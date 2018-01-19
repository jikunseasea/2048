import React, { Component } from 'react';
import styled from 'styled-components';

import StaticGrids from './StaticGrids';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.darkBg};
  border-radius: 1rem;
  position: relative;
`;

class Box extends Component {

  render() {
    const { children, browserWidth } = this.props;
    return (
      <Wrapper>
        <StaticGrids browserWidth={browserWidth}/>
        {children}
      </Wrapper>
    );
  }
}


export default Box;