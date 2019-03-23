import React from 'react';
import PropTypes from 'prop-types';
import { Loop, Stage } from 'react-game-kit';
import Scene from '../../assets/Scene';
// import styled from 'styled-components';

const Root = () => (
  <Loop>
    <Stage>
      <Scene />
    </Stage>
  </Loop>
);

Root.propTypes = {};

export default React.memo(Root);
