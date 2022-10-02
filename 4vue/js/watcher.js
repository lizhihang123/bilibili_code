class Watch {
  /* 
    vm vue实例
    key 变量名
    cb 回调函数
    */
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    // !this指向的就是Watch实例(记住这个操作)
    Dep.target = this;
    this.cb = cb;
    // 访问了一次属性值 那么紧接着就清空target 防止重复添加
    this.oldValue = vm[key];
    Dep.target = null;
  }

  update() {
    // 这个时候去访问 vm的某个属性时，数据已经发生了修改了
    let newValue = this.vm[this.key];
    if (newValue === this.oldValue) {
      return;
    }
    this.cb(newValue);
  }
}
