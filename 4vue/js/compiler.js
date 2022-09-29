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
    return attrName.startsWith === "v-";
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
      console.log(arr);
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
    }
  }
  //解析元素节点
  compileElement() {}
}
