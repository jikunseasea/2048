## TODO

- 动画的解决方案实现不理想，没有使用 react-move 等 lib，而是沿用了 jquery，这是一种 hack， 需要重构

- 为了使用 localStorage，放弃了 `Cell` 和 `Entity` 作为 `class` 的特性，妥协的将应该作为实例方法的函数变成了 `static` 方法，正确的做法是为 `class` 对象添加 `serialize` 和 `unserialize` 方法



左移的逻辑有问题
成功的处理有问题
合并之后的新方块没有动画