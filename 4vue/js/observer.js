/* 
把vue实例里面的data转化为响应式
*/
class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    // 判空
    if (!data || typeof data !== "object") {
      return;
    }
    // 遍历每个属性
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(data, key, value) {
    // 转化为响应式
    this.walk(value);
    let context = this;
    let dep = new Dep();
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        // Dep.target就是 watcher实例
        // 如果存在Dep.taregt，代表存在新的依赖者，就添加到subs数组里面去
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        if (newValue === value) {
          return;
        }
        // 当newValue是一个对象时，打印出来的是[object object]
        // 对象转化为字符串时 也会出现这种情况
        // let a = { name: "123" };
        // a.toString();
        // ("[object Object]");
        console.log(`修改${key}为${newValue}`);
        value = newValue;
        // console.log(this === vm.$data);
        context.walk(value);
        // 属性改变，更新所有的依赖者
        dep.notify();
      },
    });
  }
}
