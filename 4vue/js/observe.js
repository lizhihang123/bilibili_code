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
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        console.log(`访问了${value}`);
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
        this.walk(value);
      },
    });
  }
}
