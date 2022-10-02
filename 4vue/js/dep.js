class Dep {
  constructor() {
    // 依赖者的数组
    this.subs = [];
  }
  // 添加/收集依赖者
  addSub(sub) {
    sub && this.subs.push(sub);
  }
  // 更新依赖者
  notify() {
    this.subs.forEach((sub) => {
      // 更新所有的依赖者
      sub.update();
    });
  }
}
