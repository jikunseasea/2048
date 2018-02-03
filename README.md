## 2048

A game of 2048, created by react and rxjs.

Mobile device is supported.

## TODO

- 动画的解决方案实现不理想，没有使用 react-move 等 lib，而是沿用了 jquery，这是一种 hack， 需要重构，由此带来的另外一个 trick 是 Grid 里面的 Key 使用的是 随机数，这是 react 不提倡的

- 为了使用 localStorage，放弃了 `Cell` 和 `Entity` 作为 `class` 的特性，妥协的将应该作为实例方法的函数变成了 `static` 方法，正确的做法是为 `class` 对象添加 `serialize` 和 `unserialize` 方法
