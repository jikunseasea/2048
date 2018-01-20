import * as $ from 'jquery';
import buildBox from './box';
import configSettings from './settings';
import defaults from './defaults';
import { buildBlocks, createBlock } from './blocks';
import { initStates } from './states';
import { launchListener } from './gameControl';

import { move } from './moving';

$.fn.make2048 = function (options) {
  const $this = $(this);

  const settings = configSettings(defaults, options);

  buildBox($this, settings);

  buildBlocks($this, settings);

  const states = initStates(settings);

  createBlock($this, states, settings);
  createBlock($this, states, settings);


  launchListener($this, states, settings);


  const test = function () {
    createBlock($this, states, settings, 0, 0, 0);
    createBlock($this, states, settings, 0, 2, 0);
    createBlock($this, states, settings, 1, 1, 1);
    createBlock($this, states, settings, 0, 0, 2);
    createBlock($this, states, settings, 0, 2, 2);

    // const moveMiddle = curry(move)(states, settings);
    const movePromise = function (direction) {
      const delay = new Promise(resolve => {
        setTimeout(resolve, 2000, direction);
      });
      return delay.then(d => {
        console.log(`Move to ${d}`);
        move($this, states, settings, d);
      });
    };

    movePromise('right')
        .then(() => movePromise('right'))
        .then(() => movePromise('left'))
        .then(() => movePromise('up'))
        .then(() => movePromise('down'))
        .then(() => movePromise('down'))
        .then(() => movePromise('up'))
        .then(() => movePromise('left'))
        .then(() => movePromise('right'))
        .then(msg => console.log(msg));
  }
  // test();

};

export { $ };