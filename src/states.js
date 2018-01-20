export const initStates = function (settings) {
  const { col, row } = settings;
  const states = [];
  for (let i = 0; i++ < col * row;) {
    states.push({ kind: null, dom: null });
  }

  return states;
};

export const findEmpty = function (states) {
  const emptyArr = [];
  states.forEach((state, i) => {
    if (state.kind === null) {
      emptyArr.push(i);
    }
  });
  if (emptyArr.length === 0) {
    return -1;
  }
  const randomIndex = Math.floor(Math.random() * emptyArr.length);
  const emptyIndex = emptyArr[randomIndex];

  return emptyIndex;
};

export const resetState = function (...states) {
  if (states.length > 0) {
    states.forEach(s => {
      s.kind = null;
      s.dom = null;
    });
  }
};

export const updateState = function (dest, src) {
  if (dest && src) {
    Object.keys(src).forEach(k => {
      dest[k] = src[k];
    });
  } else {
    throw 'Wrong value for updateState!';
  }
};

export const isNullState = function (state) {
  return !(state && state.kind);
};

export const isEqualState = function (stateA, stateB) {
  if (stateA && stateB && stateA.kind && stateB.kind) {
    return stateA.kind.value === stateB.kind.value;
  }
  return false;
};