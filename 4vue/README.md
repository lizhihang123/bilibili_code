## 1. 第一步，传入数据 getter和setter转化
测试目标：输入vm这个Vue实例，能够访问数据和修改数据成功
```js
class Vue {
    constructor(options) {
        // 大量数据
        this.$options = options || {}
        // el属性
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        // data
        this.$data = options.data || {}
        // 转化为getter 和 setter
        this._proxyData(this.$data)
    }

    _proxyData(data) {
        Object.keys(data).forEach(key => {
            //使用this而不是用data 用data会无限递归
            //用this 直接给vue实例上面挂载属性
            Object.defineProperty(this, key, {
                enumerable: true, // 可以遍历
                configurable: true, // 可以枚举
                get() {
                    console.log(`访问了属性${key}值是${data[key]}`);
                    return data[key]
                },
                set(newValue) {
                    if (newValue === data[key]) {
                        return
                    }
                    console.log(`修改了属性${key}从${data[key]}变成了${newValue}`);
                    data[key] = newValue
                }
            })
        })
    }
}
```

```html
<body>
    <div id="app">
        <h1>{{插值表达式}}</h1>
        <p>v-model</p>
    </div>
    <script src="./vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#app',
            data: {
                name: 'xiaohangge',
                age: '19'
            }
        })
    </script>
</body>

```


## 2. 第二步，把data中的数据单独转化为 get和set
创建文件 observer.js
```js
/* 
    把vue实例里面的data数据本身 转化为响应式的
*/

class Observer {
  constructor(data) {
    this.walk(data);
  }
  // 判断data数据是不是对象
  // 是的话 把data数据中的每个属性都“输送”到defineReactive方法中
  walk(data) {
    // 判断是不是对象 判断是不是空
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  // 把data中的每个属性单独的转化为响应式 | 区别开 在vue.js里面对vue实例的转化 那个转化是为了使用方便而做的
  defineReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`访问了属性${key}值是${value}`);
        return value;
      },
      set(newValue) {
        // 数据相同 不更新
        if (value === newValue) {
          return;
        }
        console.log(`修改了属性${key}从${value}变成了${newValue}`);
        value = newValue;
      },
    });
  }
}

```

```diff
class Vue {
  constructor(options) {
    // 大量数据
    this.$options = options || {};
    // el属性
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    // data
    this.$data = options.data || {};
    // 转化为getter 和 setter
    this._proxyData(this.$data);
    // 使用observer这个实例
+    new Observer(this.$data);
  }

```

```diff
    <div id="app">
        <h1>{{插值表达式}}</h1>
        <p>v-model</p>
    </div>
+    <script src="./observer.js"></script>
    <script src="./vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#app',
            data: {
                name: 'xiaohangge',
                age: '19'
            }
        })
    </script>
```


## 3. 第三步，defineReactive方法的完善
1. 目标1：让data数据里面对象的对象也是响应式
2. 目标2：把data数据的值 修改为 另一个对象 里面的属性是不是响应式？
```diff
/* 
    把vue实例里面的data数据本身 转化为响应式的
*/

class Observer {
  constructor(data) {
    this.walk(data);
  }
  // 判断data数据是不是对象
  // 是的话 把data数据中的每个属性都“输送”到defineReactive方法中
  walk(data) {
    // 判断是不是对象 判断是不是空
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  // 把data中的每个属性单独的转化为响应式 | 区别开 在vue.js里面对vue实例的转化 那个转化是为了使用方便而做的
  defineReactive(obj, key, value) {
    // 让data数据里面对象的值也是响应式
+    this.walk(value);
    let that = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`访问了属性${key}值是${value}`);
        return value;
      },
      set(newValue) {
        // 数据相同 不更新
        if (value === newValue) {
          return;
        }
        // 把data数据的值 修改为 另一个对象 里面的属性是不是响应式？
        // console.log(this);
        // console.log(this === obj); // 等于obj对象 因为是obj对象调用了自己的set方法
+        that.walk(newValue);
        console.log(`修改了属性${key}从${value}变成了${newValue}`);
        value = newValue;
      },
    });
  }
}
```


## 4. 第四步
目标：创建新的compiler.js文件，写出基本的结构
```js
/* 
1. 解析模板指令 触发视图更新(是大的目标)
2. 构建出基本的解析结构
   需要函数
   - 解析文本节点
   - 解析元素节点
   - 判断是否是文本节点
   - 判断是否是元素节点
   - 判断元素是否为指令
*/
class Compiler {
  constructor(vm) {
    // 选择器
    this.el = vm.$el;
    // vue实例
    this.vm = vm;
  }
  // 编译模板
  compile() {}
  // 解析文本节点
  compilerText(node) {}
  // 解析元素节点
  compilerElement(node) {}
  // 判断是否是文本节点 === 3
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断是否是元素节点 - nodeType === 1
  isElementNode() {
    return node.nodeType === 1;
  }
  // 判断元素属性是否为指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
}
```


## 5. 第五步，compiler函数执行 编译模板函数
目标：对当前的el容器里面的每个子节点进行类型的判断 到底是文本还是元素节点

判断容器里面的子节点，转化真实的数组

判断它是否是文本节点，是的话进行相应的操作

判断是否是元素节点，是的话进行相应的操作

判断是否子节点里面嵌套字节点，是的话进行递归

```js
  compiler(el) {
    // el是整个 div#app
    let childNodes = el.childNodes;
    // el的子节点转化为真正的数组
    Array.from(childNodes).forEach((node) => {
      // 对每个子节点做判断
      if (this.isTextNode(node)) {
        this.compilerText(node);
      } else if (this.isElementNode(node)) {
        this.compilerElement(node);
      }
      //子节点可能还是有子节点要递归处理
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node);
      }
    });
  }
```



## 6. 第六步 解析文本节点

目标：

1.把插值表达式替换为变量的值

2.深层次的对象也能够替换



前置知识：

1.理解正则表达式的写法：如何匹配一个插值表达式

```js
    // +号表示至少一个
    // .表示单个任意字符 .和+合并起来，就是求若干个任意字符，至少一个
    // \{ 就是用转义字符 匹配大括号
    // \{匹配大括号
    // \s匹配 0个或者多个空白字符 *表示匹配0个或者多个
    // \S匹配 匹配1个或者多个非空白字符 +表示匹配0个或者多个
    // ()表示要分组去捕获 -> 缺陷 只能捕获一个
    let reg = /\{\{\s*(\S+)\s*\}\}/g;
```

2.理解，如何去循环遍历 获取一个对象的属性

```js
let value = arr.reduce((total, key) => {
        return total[key];
}, this.vm);
```

```diff
this.vm[info]
this.vm[info][height]
```



3.reg.exec(要匹配的值) 返回的是一个数组

exec里面的运行机制,返回数组，里面有匹配的值，如果有()分组，数组里还会有单独的值

{{name}} name

```diff
let reg = /\{\{\s*(\S+)\s*\}\}/g;
let value = node.nodeValue; // 值是 "{{name}}"
const arr_result = reg.exec(value);
```



```js
compilerText(node) {
    let reg = /\{\{\s*(\S+)\s*\}\}/g;
    let value = node.nodeValue; // 值是 "{{name}}"
    const arr_result = reg.exec(value); // 结果是数组 ['{{name}}', 'name'] 我们要的是name这个值
    if (arr_result) {
      // 从插值表达式中取出变量
      let arr = arr_result[1].split("."); // 我们取出name值 因为这个结果有可能是info.height 所以我们要用 split区分开来
      console.log("arr", arr);
      let value = arr.reduce((total, key) => {
        return total[key];
      }, this.vm); // value值是xiaohangge 如果是 this.vm.info.height那么这里 利用reduce方法累计 this.vm.info -> this.vm.info.height
      if (value) {
        node.nodeValue = node.nodeValue.replace(reg, value);
        // 我们使用replace方法来进行替换 用reg正则去匹配到 {{name}} --> 整个替换为value
        // 或者把 {{info.height}} -> 替换为 value值
      }
    }
  }
```



## 7. 解析元素节点

目标：把节点上面的指令转化对应的变量，解析出来，转化为对应的值显示在页面。

实现：首次页面加载，数据响应视图



**解析元素节点**

```js
// 解析元素节点
  compilerElement(node) {
    // 判断是否是指令
    // 把该节点的所有属性转化为真实的数组
    Array.from(node.attributes).forEach((attr) => {
      console.log(attr);
      // 某一个节点的name值 v-text v-model
      debugger;
      let attrName = attr.name;
      // console.log(attrName); // v-text
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2); //截取2后面的字符 model或者是text
        let key = attr.value; // 拿到值 v-model="age" 也可能是 v-text="age"
        // node - 节点
        // key - 属性对应的值
        // attrName - text
        this.update(node, key, attrName);
      }
    });
  }
```



update方法：

针对不同的指令 v-text v-model，使用不同的方法

不用if语句判断

```js
update(node, key, attrName) {
    let updateFn = this[attrName + "Updater"];
    let arr = key.split(".");
    // 利用reduce进行数组的滚动求解
    let value = arr.reduce((total, key) => {
      return total[key];
    }, this.vm);
    // updateFn可能是textUpdater 也可能是 modelUpdater
    updateFn && updateFn(node, value);
  }
```



textUpdater解析 v-text指令

modelUpdater解析 v-model指令

```js
textUpdater(node, value) {
	// 这个是div 所以修改的是textContent
	node.textContent = value;
}
modelUpdater(node, value) {
	// 因为v-model绑定给了input输入框 所以修改value
	node.value = value;
}
```



## 8. 创建dep类

1.收集依赖，收集所有的观察者，-》在getter里面收集

2.通知所有的观察者，什么时候通知 -》setter的时候通知



```js
class Dep {
  constructor(sub) {
    this.sub = sub;
  }
  //收集依赖
  addSub(sub) {
    // 判断sub不为空 并且有update方法时 才添加到this.sub方法里面去
    if (sub && sub.update) {
      this.sub.push(sub);
    }
  }
  //发送通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
```





observe.js文件里面

```diff
/* 
    把vue实例里面的data数据本身 转化为响应式的
*/

class Observer {
  constructor(data) {
    this.walk(data);
  }
  // 判断data数据是不是对象
  // 是的话 把data数据中的每个属性都“输送”到defineReactive方法中
  walk(data) {
    // 判断是不是对象 判断是不是空
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  // 把data中的每个属性单独的转化为响应式 | 区别开 在vue.js里面对vue实例的转化 那个转化是为了使用方便而做的
  defineReactive(obj, key, value) {
    // 让data数据里面对象的值也是响应式
    this.walk(value);
    let that = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`访问了属性${key}值是${value}`);
        // 注意 这里return的是 value 如果return的是obj[value] 就会造成无限循环
        // return obj[key];

        // 在此时收集依赖 添加观察者s
+        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        // 数据相同 不更新
        if (value === newValue) {
          return;
        }
        // 把data数据的值 修改为 另一个对象 里面的属性是不是响应式？
        // console.log(this);
        // console.log(this === obj); // 等于obj对象 因为是obj对象调用了自己的set方法
        that.walk(newValue);
        console.log(`修改了属性${key}从${value}变成了${newValue}`);
        value = newValue;
        // 在这里通知观察者们 更新数据
+        dep.notify();
      },
    });
  }
}
```





## 9. 创建watch类



```js
class Watch {
  // vm - 实例
  // key - 新的属性
  // cb - 执行的回调函数
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    this.oldValue = vm[this.key];
  }

  update() {
    // 这里通过 this.vm[this.key] 获取到的是新值
    let newValue = this.vm[this.key];
    // 如果新值和旧的盒子一致 就不用再更新了
    if (newValue === oldValue) {
      return;
    }
    // 通过cb回调函数进行更新
    this.cb(newValue);
  }
}
```





## 10. Watch类完善

目标：数据修改 -> 视图能够发生响应，vm.name = 'xiaohagnge'



1.target属性添加

```diff
class Watch {
  // vm - 实例
  // key - 新的属性
  // cb - 执行的回调函数
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中属性的名称
    this.key = key;
    // 添加target属性 后续可以根据target属性来添加观察者
+    Dep.target = this; // 让Dep的target值改为当前的观察者实例
    // 回调函数负责更新视图
    this.cb = cb;
    // 获取更新前的旧值 先存储起来
    this.oldValue = vm[key]; // 访问了数据 触发了observer.js里面的getter 执行了Dep.sub()方法 target已经添加到subs数组里面去了
    // 清空防止重复更新
+    Dep.target = null;
  }
```





2.new Watch这个到底何处安放？

Watch这个类，就是在数据发生变化的时候去更新视图。

什么时候数据发生变化呢？



**compileText**

```diff
compilerText(node) {
    let reg = /\{\{\s*(\S+)\s*\}\}/g;
    // debugger;
    let value = node.nodeValue; // 值是 "{{name}}"
    const arr_result = reg.exec(value); // 结果是数组 ['{{name}}', 'name'] 我们要的是name这个值

    // 替换插值表达式 正式
    if (arr_result) {
      // 从插值表达式中取出变量
      let arr = arr_result[1].split("."); // 我们取出name值 因为这个结果有可能是info.height 所以我们要用 split区分开来
      // console.log("arr", arr);
      let value = arr.reduce((total, key) => {
        // debugger;
        return total[key];
      }, this.vm); // value值是xiaohangge 如果是 this.vm.info.height那么这里 利用reduce方法累计 this.vm.info -> this.vm.info.height
      if (value) {
        node.nodeValue = node.nodeValue.replace(reg, value);
        // 我们使用replace方法来进行替换 用reg正则去匹配到 {{name}} --> 整个替换为value
        // 或者把 {{info.height}} -> 替换为 value值
      }
+      new Watch(this.vm, arr, (newValue) => {
+        node.textContent = newValue;
+      });
    }
    // 创建一个观察者对象
  }
```

因为compileText页面第一次加载时，就会触发，去替换文本节点里面的内容，比如插值表达式，所以在这里创建watch类，传入 Vue实例**this.vm**,传入**arr**，这个数据是**['name'] ['age'] ['info', 'height']**





**Watch类**

修改key为arr的原因是，可能是一个对象里面的数据，如果仅仅是 this.vm[key] 可能就无法获取到对象里面的数据了

```diff
class Watch {
  // vm - 实例
  // key - 新的属性
  // cb - 执行的回调函数
  constructor(vm, arr, cb) {
    this.vm = vm;
    // data中属性的名称
+    this.arr = arr;
    // 添加target属性 后续可以根据target属性来添加观察者
    Dep.target = this; // 让Dep的target值改为当前的观察者实例
    // 回调函数负责更新视图
    this.cb = cb;
+    // 获取更新前的旧值 先存储起来
+    let value = arr.reduce((total, key) => {
      // debugger;
      return total[key];
    }, vm);
+    this.oldValue = value; // 访问了数据 执行了Dep.sub()方法
    // 清空防止重复更新
    Dep.target = null;
  }

  update() {
    // 这里通过 this.vm[this.key] 获取到的是新值
    // 为什么？因为 只要update方法调用时，获取到的值就是新值，因为当数据发生改变的时候，才会调用这个方法
+ 	 这里也要修改成 reduce递归遍历的形式
+    let value = this.arr.reduce((total, key) => {
      // debugger;
      return total[key];
    }, this.vm);
+    let newValue = value;
    // 如果新值和旧的值一致 就不用再更新了
+    if (newValue === this.oldValue) {
      return;
    }
    // 通过cb回调函数进行更新
    this.cb(newValue);
  }
}
```





## 11. 解析元素时添加watch类

目标：

1.v-text或者v-model的数据变化时，能够响应视图

```diff
update(node, key, attrName) {
    let updateFn = this[attrName + "Updater"];
    let arr = key.split(".");
    // 利用reduce进行数组的滚动求解
    let value = arr.reduce((total, key) => {
      return total[key];
    }, this.vm);
    // updateFn可能是textUpdater 也可能是 modelUpdater
    // 通过.call来修改当前的this指向为 compiler类
    updateFn && updateFn.call(this, node, value, arr);
  }
  textUpdater(node, value, arr) {
    // 这个是div 所以修改的是textContent
    node.textContent = value;
    // 下面的this指向的是undefined
    // 之所以传递的是arr 在前面的Watch类里面已经说过
+    new Watch(this.vm, arr, (newValue) => {
+      node.textContent = newValue;
+    });
  }
  modelUpdater(node, value, arr) {
    // 因为v-model绑定给了input输入框 所以修改value
    node.value = value;
+    new Watch(this.vm, arr, (newValue) => {
+      node.textContent = newValue;
+    });
  }
```





## 12. 视图变化，能够响应数据

compiler.js文件

目标：当输入框输入数据时，表明视图更改，数据层的数据也能够发生更改

```diff
  modelUpdater(node, value, arr) {
    // 因为v-model绑定给了input输入框 所以修改value
    node.value = value;
    new Watch(this.vm, arr, (newValue) => {
      node.textContent = newValue;
    });
+    node.addEventListener("input", () => {
      this.vm[arr[0]] = node.value;
    });
  }
```



遗留的问题：

1.输入框的name好像没有发生变化



## 13. 遗留问题

1.嵌套对象的数据发生更改时，是否是响应式的？是的

2.当新增一个对象，是否是响应式的？不是.

Vue的解决方式如下。里面也包含了对数组的处理

```js
https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E5%A6%82%E4%BD%95%E8%BF%BD%E8%B8%AA%E5%8F%98%E5%8C%96
```

3.当数据是对象时，该如何去处理？
