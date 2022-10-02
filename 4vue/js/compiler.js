/* 
1. 解析模板指令 触发视图更新(是大的目标)
2. 构建出基本的解析结构
   需要函数
   - 判断是否是文本节点
   - 判断是否是元素节点
   - 判断元素是否为指令
   - compiler
   - 解析文本节点
   - 解析元素节点
*/

class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.compiler(this.el);
  }
  //判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  //判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
  //判断元素是否为指令
  isDirectiveNode(attrName) {
    return attrName.startsWith("v-");
  }
  //解析方法
  compiler(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 判断文本节点
      if (this.isTextNode(node)) {
        this.compileText(node);
        // 判断元素节点
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }
      // 递归遍历子节点
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node);
      }
    });
  }
  // 解析文本节点
  compileText(node) {
    // {{ name }} -> 变量值
    // 1.匹配到插值表达式
    //   正则表达式
    //   \{匹配大括号
    //   \s表示空白字符 *表示0个或者多个
    //   \S表示的非空白字符 +表示至少1个，可以多个
    //   exec方法 arr = reg.exec(str)
    let value = node.nodeValue;
    let reg = /\{\{\s*(\S+)\s*\}\}/;
    let arr_result = reg.exec(value);
    if (arr_result) {
      let arr = arr_result[1].split(".");
      // replace方法
      // str.replace(reg, target)
      // reduce
      // arr[1,2,3]
      // value = arr.recude((prev, cur) => prev + cur, 0)
      // ['info', 'height']
      // this.vm[info]
      // this.vm['info'][height]
      let finalValue = arr.reduce((prev, cur) => prev[cur], this.vm);
      node.nodeValue = node.nodeValue.replace(reg, finalValue);
      // 为什么在这个地方 new实例呢？
      // 因为页面一进来就会访问这里，解析文本节点，然后访问get函数，就会去判断有没有依赖者
      // 如果使用了属性，这个if分支才能够进来，说明有依赖者
      new Watch(this.vm, arr[0], (newValue) => {
        node.nodeValue = newValue;
      });
    }
  }
  // 解析元素节点
  compileElement(node) {
    // 1.获取所有属性节点
    // 2.获取属性的name值
    // 3.判断是否是指令
    // 4.调用update方法 传入节点 变量名 属性名的截取
    Array.from(node.attributes).forEach((attr) => {
      if (this.isDirectiveNode(attr.name)) {
        // age name 目的就是 this.vm[age]
        let key = attr.value;
        // v-model => model
        let attrName = attr.name.substr(2);
        this.update(node, key, attrName);
      }
    });
  }
  // 分析指令 调用指令的方法
  update(node, key, attrName) {
    // model + 'Updater' => modelUpdater
    // text + 'Updater' => textUpdater
    let updateFn = this[attrName + "Updater"];
    // 注意！如果是 info.height this.vm[info.height] 访问不到
    // reduce
    let value = this.vm[key];
    // 调用更新的方法
    updateFn && updateFn.call(this, node, value, key);
  }
  // 声明更新的具体的方法
  // input框绑定v-model 修改的是value属性
  modelUpdater(node, value, key) {
    node.value = value;
    new Watch(this.vm, key, (newValue) => {
      node.value = newValue;
    });
    node.addEventListener("input", () => {
      this.vm[key] = node.value;
    });
  }
  // p标签绑定v-text 修改的是textContent属性
  textUpdater(node, value, key) {
    node.textContent = value;
    new Watch(this.vm, key, (newValue) => {
      node.textContent = newValue;
    });
  }
}
