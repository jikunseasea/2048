const index2cor = function (settings, index) {
  const { col, row } = settings;
  const x = index % col;
  const y = parseInt(index / row);

  return { x, y };
};

const cor2index = function (settings, x, y) {
  const { col } = settings;

  return x + y * col;
};

export const toggleLocation = function (settings, ...args) {
  if (args.length === 1) {
    return index2cor(settings, args[0]);
  } else if (args.length === 2) {
    return cor2index(settings, ...args);
  }
  console.log('Wrong toggle location!');
};

export const location2absolute = function (settings, ...args) {
  let x = 0;
  let y = 0;
  if (args.length === 1) {
    const cor = toggleLocation(settings, args[0]);
    x = cor.x;
    y = cor.y;
  } else {
    [x, y] = args;
  }
  const { intervalSize, blockWidth, blockHeight } = settings;
  const left = intervalSize + (intervalSize + blockWidth) * x;
  const top = intervalSize + (intervalSize + blockHeight) * y;

  return { left, top };
};
