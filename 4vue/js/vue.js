class Vue {
  constructor(options) {
    // 1.初始化变量
    this.$options = options;
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    this.$data = options.data;
    this._proxyData(this.$data);
    new Observer(this.$data);
  }
  // 2.defineProperty API 转化属性为getter和setter
  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) {
            return;
          }
          data[key] = newValue;
          console.log(`${key}的值修改为${newValue}`);
        },
      });
    });
  }
}
