# 第一部分

## 1. 作用域

**作用域**：var a = 2; 这个变量a，存到哪里，我们要用到这个变量的时候，去哪里找他呢？需要一套**规则**，这套规则就是作用域。

### 1.1 编译原理 

**JS是什么类型的语言？**

1. JS通常被归类为 动态语言或者是解释语言。但事实上，它是一门**编译语言**。又和传统的编译语言不同，JS不是提前编译的。 --存在疑惑

   在《JS权威指南里面》把JS归类为`解释语言`

   1. 动态语言 vs 静态语言

      **静态语言(强类型语言)**，指程序在编译时，就要确定，变量的数据类型，运行的时候是不能修改的。

      **动态语言(弱类型语言）**，指程序在运行时，确定变量的数据类型，过程中是可以修改的。

   2. 解释语言 vs 编译语言

      **编译语言**，指程序先编译成代码值，转化为机器语言，中间文件，在运行的时候，能够让计算机直接执行。

      **解释语言**，在运行的过程中，才翻译程序为机器语言，那么都叫做解释语言。只要不是直接“翻译成机器指令并且直接运行机器指令”的编译语言，都是解释语言。

      **区别：**编译语言语言把代码编译好，生成一个中间文件，后面可以直接机器执行。解释语言，执行的时候，进行翻译转化。解释语言，需要一个解释器。【`没有一个标准，都是概念，我们可以去进行讨论`】

      JS：有执行前的性能优化，比如JIT（及时编译器），一个代码执行超过一次，就成为**warm**，JIT就会把这个代码送给编译器，进行保存，下一次执行时，直接跳过“翻译的过程”，这样性能就能够提升很多。后来才加入的

      ```js
      for(i=0; i <= 1000; i++){
          sum += i;
      }
      ```

      https://juejin.cn/post/6844903559536836616

2. 在传统的编译语言的流程中，程序中的一段源代码在执行前会经历三个步骤。统称为编译

   1. **分词/词法分析**。var a = 2; -> var、a 、=、2

   2. 解析/语法分析。将词法单元流，转化为一个 “元素逐级嵌套”所组成的代表程序语法的树。=> **抽象语法树**

   https://astexplorer.net/

   3. 代码生成。将AST转化为**可以执行的的代码**，让**机器**能够识别。

   4. JS要更加**复杂**， 在语法分析和代码生成阶段有特定的步骤，对性能进行优化。**JS的编译通常发生在执行前的几微秒**，JS引擎用尽了各种办法，比如（JIT），来保持性能的最佳。





### 1.2 理解作用域

#### 1.2.1 演员表

1. 引擎
2. 编译器
3. 作用域



#### 1.2.2 对话

代码生成，第三步时，**var a = 2**是如何生成的

1. 遇到var a; 编译器会问，作用域，是否当前的作用域里面已经有和a同名的。
   - 如果有，这个var a就会被忽略。
   - 否则会要求作用域，在当前作用域的集合中**声明一个新的变量**
2. 接下来，编译器会为引擎生成运行时所需要的**代码**。这个代码能够处理a = 2的操作。
   - **引擎**来啦~先问作用域，当前作用域集合里面是否有一个名字是a的变量。
   - 如果有，引擎就使用这个变量。如果没有，引擎就继续去查找。
   - 如果最终找到啦，**就把2赋值给a**，否则引擎就会举手示意，抛出错误。



#### 1.2.3  编译器有话说

编译器进行代码生成时，**引擎**要查找变量a判断是否已经用过时，需要作用域协助。

引擎是怎么找到变量的呢？

**LHS查询和RHS查询**：其实就是赋值操作的左侧和右侧

```js
function foo(a) {
    console.log(a)
}
foo(2)
```

1. foo(a)我们需要找到a的值，是2，找到“找到赋值的目标”，是RHS
2. 2会给到a，有一个赋值操作，所以是LHS查询
3. 对console对象也有一个RHS查询，因为console本身也是一个对象，要找到这个**目标值**
4. console.log(a)找到a的值是什么，有一个RHS操作。如果console.log()函数原生实现里面也有一个赋值操作，那么就有一个LHS查询
5. var a = 2





#### 1.2.4 引擎和作用域的对话

```js
function foo(a) {
    console.log(a)
}
foo(2)
```



1. 引擎 （我需要给foo进行**RHS**引用，你见过他吗） -> 作用域。函数声明是一个RHS查询，我要找到这个声明的函数值

2. 作用域 （别说，我还真的见过，编译器那小子刚刚声明而来他，是一个函数），给你 -> 引擎(不理解 函数是RHS查询)

3. 引擎 （哥们太够意思了，我么执行foo）
4. 应该还有一个RHS查询的 引擎 （哥们，我要为a进行**LHS**查询，这个你见过不）-> 作用域
5. 作用域 （这个我也见过，编译器刚刚把他声明为foo的一个形参了，拿去）
6. 引擎 （大恩不言谢，你总是这么棒，我要把2给到a） -> 作用域
7. 引擎 （哥们，不好意思，我要来麻烦你了，我要给console进行一个**RHS**查询，你见过不） -> 作用域
8. 作用域 （咱俩谁跟谁啊，再说我就是干这个的。这个我也有，**console是一个内置对象**，给你）-> 引擎
9. 引擎 （么么哒，我得看看这个里面是不是有一个log，太好了，找到了是一个函数）
10. 引擎 (哥们，能帮我再找一下对a的**RHS**引用吗，虽然我记得它，但想再确认一次)
11. 作用域 （放心吧，这个变量没有动过，拿走，不谢）
12. 引擎 （真棒，我来把a的值传递给log）



#### 1.2.5 小测验

```js
function foo(a) {
    let b = a
    return b  + a
}
var c = foo(2)
```



LHS查询几个？

RHS查询有几个？

LHS查询有3个：c、a、b

RHS查询有4个：2赋值给a、a赋值给b、查找b、查找a



1.先讲到作用域的查找，var a = 2；这样一句代码，他涉及两个步骤，第一个就是var a; a = 2;

2.var a 就是一个LHS查询 | a = 2就是一个RHS查询

3.编译器会去问作用域变量声明了没，没声明，编译器就声明它 + 引擎会和作用域配合，问变量声明好了嘛，声明好了话，我们就把2赋值给a吧



### 1.3 作用域嵌套

当一个块或者函数作用域，嵌套在另一个块或者函数中时，就发生了作用域的嵌套。

因此，在当前作用域中无法找到某个变量时，引擎就会去外层作用域查找，找到全局没有，无论如何都会停止



```js
function foo(a) {
    console.log(a + b)
}
var b = 2
foo(2)
```

引擎：你见过b变量嘛，我要为其进行RHS查找。

作用域：见都没见过，走开

引擎：foo的上级作用域兄弟，咦？有眼不识泰山，原来你是全局作用域大哥，太好了。你见过b吗？我需要对它进行RHS引用。

作用域：当然了，给你吧



![image-20221029150801662](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221029150801662.png)



### 1.4 异常

**你知道 TypeError和ReferenceError两种错误的区别是什么嘛**

```js
function foo(a) {
    console.log(a + b)
    b = a
}
foo(2)
```

1. 因为找不到b赋值，所以RHS查询失败，报错**ReferenceError**,作用域查找失败
2. 如果是有 b = 2,尽管没有let b = 2，LHS查询失败，那么全局会自动创建一个b变量（非严格模式下面的）
3. 如果是对非函数类型的值进行函数调用，或者是null.a这样，就是**TypeError**（作用域判断能成功，找到变量，但是操作是不合法的）



### 1.5 小结

1. 编译原理：编译原理有三个步骤，先是分词(var a = 2 -> var、a、=、2),然后是转化为AST,最后是转化为机器可以执行的代码。JS事实上是编译语言，和传统的不太一样，编译时会做很多性能优化，一般编译完，代码就会立即的执行。
2. 作用域：就是变量存到哪里，存好后续要用的时候，如何使用的问题
   1. 作用域的整个规则，有引擎、编译器、作用域的参与
   2. （var a = 2时）编译器在分词和转化为AST之后，会问作用域是否有a这个变量，有就忽略，没有就声明。接着是引擎来了，引擎会问作用域，a变量是否声明好了，当前作用域没有就会去上一层作用域查找。
3. LHS查询和RHS查询：
   1. LHS查询，就是查找a变量这个来源；RHS查询就是查找值，var a = 2 先LHS再RHS
   2. 这两个查询都在当前作用域先查询，如果查不到，就升级到上一层作用域。到全局没有就停止
4. 两种错误
   1. TypeError是指类型错误，比如 let a = 1; a.name 就是类型错误
   2. Reference，如果是没有声明变量，LHS查询错误，就是Reference Error



## 2. 词法作用域

### 2.1 词法阶段

**词法作用域：**你的代码写在哪里，词法作用域就在哪里。

```js
function foo(a) {
    let b = a * 2
    function bar (c) {
        console.log(a, b, c)
    }
    bar (b * 3)
}
foo(2) // 2, 4, 12
```



<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221031153229216.png" alt="image-20221031153229216" style="zoom:50%;" />



1. 全局作用域，只有foo

2. foo里面的一层作用域，有a, bar, b

3. bar里面的作用域也有b，引擎就不需要冒到foo的作用域里面去查找了
4. 作用域的查找会在找到第一个标识符就停止。
5. 多层的嵌套的作用域，可以定义同名的变量，最近的会遮蔽最远的，就是遮蔽效应。



注意点：

1. **全局变量，自动成为全局对象的属性。**直接通过，window.a访问a，可以访问被遮蔽的变量。但是，非全局变量被遮蔽了，无论如何也访问不到。但是从ES6中，let和const和class声明的变量就与全局对象失去挂钩。
   1. 没法在编译的时候就报出这个错误，只有在运行的时候才能知道。因为全局变量很可能是顶层对象的属性，对象的属性是动态的
   2. 程序员很容易一不小心就创建全局变量
   3. 顶层对象的属性到处可以读写，不利于模块化编程
   4. window对象是有实体含义的，浏览器的窗口对象。**var和function的依旧还是**

```js
// let a = 123
var a = 123
function fn() {
    console.log(window.a);
}
fn()
```



2. **函数的词法作用域，只由它被声明时所处的位置决定**。无论函数在哪里被调用，也无论它如何被调用。

```js
function foo() {
    var a = 10
    function baz() {
        console.log(a)
        console.log('baz')
    }
    bar(baz)
}
function bar(fn) {
    fn() // 闭包函数 作用域还是在上面
}
foo()
```



### 2.1 查找

**引擎如何查找**

1.作用域之间的结构和位置关系是**信息**，引擎依赖这个**信息**，去查找标识符的位置

2.console.log()查找a、b、c三个变量的引用。先从最内部，bar的气泡开始查找，再到foo的气泡里面找，找到了，就停止

3.如果bar里面也有c，

### 2.2 欺骗词法

#### 2.2.1 eval

1. 可以接受一个字符串作为参数，执行字符串里面的代码，不仅仅是字符串
2. 修改当前词法作用域的内容，覆盖上一层作用域的b
3. 对性能带来的损耗很大，不太能够接受

```js
// let不行 var可以
function foo(str, a) {
    eval(str) // 原本作用域只有1，但是现在多了b，var b = 3也被执行了
    console.log(a, b);
}
var b = 2
foo('var b = 3', 1)
```



声明函数也可以

```js
function foo2(fn) {
    eval(fn)
    console.log(sing);
}
foo2('function sing() {}')
```



严格模式并不能行

```js
function foo3(str, a) {
    "use strict"
    eval(str) // 原本作用域只有1，但是现在多了b，var b = 3也被执行了
    console.log(a, c);
}
foo3('var c = 3', 1)
```



1.setTimeout和setInterval第一个参数也可以是字符串，但是千万不要使用它们，过时了

2.new Function('', '')第二个参数也可以写一些函数体，尽量不要使用



```js
// setTimeout--------------------------------
setTimeout('console.log(100)', 1000) // 100

// new Function--------------------------------
let foo4 = new Function('a,b', 'console.log(`new Function`)')
console.log(foo4);
```





#### 2.2.2 with



1. 比起一个一个的修改obj，我们直接用with就能够不用频繁的修改

```js
var obj = {
    a: 1,
    b: 2,
    c: 3
}
// obj.a = 2
// obj.b = 3
// obj.c = 4
with (obj) {
    a = 3
    b = 4
    c = 5
}
console.log(obj); // 成功修改
```



```js
function foo(obj) {
    with (obj) {
        a = 2
    }
}
var o1 = {
    a: 3
}
var o2 = {
    b: 3
}
foo(o1)
console.log(o1.a); // 2
foo(o2)
console.log(o2.a); // undefined
console.log(a); // 2 发生了变量泄露到了全局作用域
```

1. o1传进去，找到o1作用域里面的属性a，能够进行修改
2. o2传进去，o2里面没有属性a，无法进行修改
3. 同时，非严格模式，o2.a访问不到a属性，就会去全局作用域，隐式的创建a变量，就会有内存泄露



小结：

1. eval是直接修改 **自己所处的作用域**

2. with是修改**传进来的变量，里面的作用域**，能够影响里面的作用域的内容，和他进行交互。换种说法，传进来一个对象时，那么就包含了对这个对象的“作用域”里面的引用，就可以修改这个作用域里面的内容

3. 都不建议使用



#### 2.2.3 性能

1.JS引擎会在编译阶段进行很多的性能优化。一些优化，依赖代码的词法进行静态分析。（如果词法作用域在优化时已经确定好了，更有利于JS引擎的分析，找到变量速度更快）

2.发现eval/with，引擎只会简单假设关于标识符的判断都是`无效的`，因为词法分析时，无法明确知道eval里面会接受到什么，会怎么修改

3.所有优化可能都是无意义的。不要使用eval和with





### 2.3 小结

1.**词法作用域**：在变量定义时，就已经确定好了。不管函数在哪里调用

2.**词法作用域查找**：依据，变量之间的结构和位置关系（是标识符），去查找变量。先从最里面的变量开始查找，往外面找

3.**欺骗词法**：**eval可以修改当前作用域的内容**，with可以修改传入对象的作用域的内容。这两个都会破坏标识符的查找机制，让引擎变得笨笨的，降低性能。索性不要使用



## 3. 函数作用域和块作用域

1. 作用域里面包含了一系列的气泡，每一个都可以作为**容器**，**容器里面**包含了标识符（**变量，函数**）的定义，这些气泡相互嵌套。
2. 什么生成了气泡，只有函数会生成气泡嘛？其实不是这样

### 3.1 函数中的作用域

```js
function foo(a) {
    var b = 2
    function bar () {
        
    }
    var c = 3
}
bar() // 失败
console.log(a, b, c) //失败
```

1. 全局作用域的气泡包含foo，foo作用域气泡包含，a/b/bar/c， bar作用域气泡又会有自己的内容

2. 无法从外部（全局）访问a b bar c；**但是foo里面和bar里面都是可以访问**
3. **函数作用域：**属于这个函数的全部变量都可以在整个函数的范围里面被使用，包括嵌套作用域 => 这个设计很有用，JS的动态特性，能够需要改变变量的类型

```js
function foo(a) {
    var b = 2
    function bar () {
        // 又重新改为false
        b = false
    }
    var c = 3
}
bar() // 失败
console.log(a, b, c) //失败
```





### 3.2 隐藏内部实现

```js
function doSomething(a) {
    b = a + doSomethingElse(a * 2)
    console.log(b * 3)
}
function doSomethingElse(a) {
    return a - 1
}
var b
doSomething(2)
```

1. b和doSomethingElse都是为了给doSomething使用的
2. 但是b和doSomethingElse都放在全局，可能全局的其它地方都有意无意的使用它们两个，就不好。更好的做法如下面所示，全局不能够轻易的访问`b`和`doSomethingElse`

```js
function doSomething(a) {
    b = a + doSomethingElse(a * 2)
    console.log(b * 3)
    function doSomethingElse(a) {
    	return a - 1
    }
    var b
    doSomething(2)
}

```



1. **隐藏内部实现**：一般对于函数的思路是，声明一个function fn() {}, 然后写代码；但是也可以反过来，就是把程序的一段代码，塞到一个函数里面去，藏起来，这样只有这个里面的作用域，或者里面的嵌套作用域，能够访问里面的变量。
2. **最小特权原则**：最小限度的暴露必要的内容，而将其它内容都隐藏起来，模块、API的设计。 => 延伸到如何选择作用域来包含变量和函数。变量和函数都在全局，那么就会破坏这个原则。
3. **减少命名冲突**: 假设全局下面，也要设置一个函数`doSomethingElse`，这个函数的操作比如是return a - 2，现在就能够使用了。我们有`遮蔽效应`.

   **全局引入包**，比如import axios from 'axios', axios.instance为什么是要以对象的形式访问呢？假设以另一个包里面也是有instance变量，没有锁在一个对象里面，岂不就是冲突

   **vuex里面的模块机制**，多个模块，变量名字一样也没关系。访问变量state的时候，store.state.a.name，变量注入到了一个特定的区域



### 3.3 函数作用域

```js
var a = 2
function foo() {
    var a = 3
}
foo()
console.log(a) // 2
```

1. foo函数能够包装 隐藏一个变量a
2. 但是foo函数会污染全局的作用域
3. 并且foo()手动调用，多了一行代码。如果foo不污染全局，并且能够自动而不是手动调用，就更好



```js
var a = 2
(function foo() {
    var a = 3
})()
console.log(a) // 2
```

1. (function foo() {})()里面的function不是一个函数声明，而是一个函数表达式。

   **区别**：第一个字是function还是其它。

2. 函数会自己执行

3. foo变量在全局是访问不到的，在()里面被包裹住了

   

#### 3.3.1 具名和匿名

>函数到底是有名字的好，还是没有名字的好

```js
setTimeout(function() {
    
})
```

1. 函数表达式没有函数名，就是匿名函数表达式
2. 没有函数名的缺陷：
   1. 在栈追踪中，不会显示出有意义的名字，调试会很困难
   2. 如果函数在递归中，要使用自身时，也会变得有限制。(不理解)
   3. 代码变得不那么可读了
3. `函数表达式有名字是最佳实践`

```js
setTimeout(function timeoutHandler() {
    
})
```



#### 3.3.2 立即执行函数表达式

1. 立即执行函数表达式，也叫**IIFE(Immediately Invoked Function Expression)**

   能够创建一块作用域

```js
var a = 2
(function ()) {
    var a = 3
})()
console.log(a) // 2
```

2. 添加函数名也是一个值得推广的实践

```js
var a = 2
(function foo() {
    var a = 3
})()
console.log(a) // 2
```



3. 传递参数进去,global可以取任意你想取的名字

```js
var a = 2
(function foo(global) {
    var a = 3 
    console.log(a)
    console.log(global)
})(window)
console.log(a)
```



4. 另一种冗长的方式，但是有的朋友认为他容易理解
   1. 打印global的函数，被作为参数，传递到第一个函数里面去，然后执行，输出window

```js
(function (def) {
    def(window)
})(
	function(global) {
        console.log(global)
    }
)
```







### 3.4 块作用域

查看下面的两段代码，都不是块作用域的体现

```js
// 1. 这段代码里面的i会泄露到全局
for (var i = 0; i < 10; i++) {
    console.log(i);
}
console.log(i);
// 2. 下面代码的bar也是会泄露到全局的
let foo = true
if (foo) {
    var bar = foo * 2
    bar = something(bar)
    console.log(bar);
}
function something(a) {
    return a * 2
}
console.log(bar);
```





让变量在一个作用域里面才能生效，不会被混乱的使用，是能够提升代码的可维护性的



#### 3.4.1 with

我们曾经学习过的with关键字，里面就是创建了一块单独的作用域，外部是不能使用到a、b、c

```js
var obj = {
    a: 1,
    b: 2,
    c: 3
}
// obj.a = 2
// obj.b = 3
// obj.c = 4
with (obj) {
    a = 3
    b = 4
    c = 5
}
console.log(obj); // 成功修改
```





#### 3.4.2 try/catch

catch里面的变量，也会和{}里面的变量进行绑定

```js
try {
    undefined()
} catch(err) {
    console.log(err) // 打印的err 只在 catch这个作用域里面是有效的
}
console.log(err) // ReferenceError
```



3.4.3 小结

1. 在ES3的时候就是有块级作用域了，就是with和try / catch语法

2. 后来我们才会有let关键字



```js
{
    let a = 10
    console.log(a)
}
console.log(a) // Reference Error
```



```js
try {
    throw 2
} catch(err) {
    console.log(err)
}
console.log(err)
```



3. 我们写的ES6代码，如何在ES6之前的环境里面运行呢。就是在代码运行前，进行构建，需要工具来帮我们进行构建。我们可以写的爽，享受块级作用域。
   - 谷歌的一个项目，Traceur，就是将ES6代码转化为ES6之前的环境，大部分是ES5
   - 这个项目会把代码转化成什么样子？let -> catch
   - try / catch的从ES3就开始存在了



#### 3.4.3 let

我们来观察一段代码

```js
let foo = true
if (foo) {
	let bar = foo * 2
    bar = something(bar)
    console.log(bar)
}
function something(a) {
	return a * 2
}
console.log(bar)
```

1. 上面的bar变量，只能在if语句里面进行访问
2. 这是隐式的使用let，让变量和这个作用域进行绑定，我们马上就会介绍一个显示的
3. 隐式的绑定，不利于开发



我们看下面的一个代码

```js
var foo = true
if (foo) {
    { <-- 这个就是一个显示的块
        let bar = foo * 2
        bar = something(bar)
        console.log(bar)
    }
}
function something(a) {
	return a * 2
}
```

1. 正是因为有了这个花括号的存在，我们称他为显示的创建一个块级作用域
2. 只要声明有效，在声明中的任意位置都是可以使用{..}来进行创建的
3. 如果要重构代码，直接移动这个{}就好了



```js
{
    console.log(bar) // ReferenceError
    let bar = 2
}
```

1. 上面代码，先打印bar是报错，因为let声明的变量，是不会有变量的提前声明的，var是会有的





```js
function process(data) {
    // 搞点事情
}

{
    let someReallyBigData = {...}
	process(someReallyBigData)
}
var btn = document.getElementById('my_button')
btn.addEventListener('click', function() {
    ....
})
```



1. 我们发现，因为{}的存在。someReallyBigData变量是let声明的，在process函数执行完毕后，因为btn的点击事件并不会使用到someReallyBigData这个变量，那么这个变量就会被垃圾回收机制给回收掉
2. 如果是没有那层{}怎么办呢？那么这个变量就不会被垃圾回收，可能会一直占用着内存





我们来看一段很常见的代码

```js
for (let i = 0; i < 10; i++) {
    console.log(i)
}
console.log(i) // ReferenceError
```

1. 正是因为使用了let，全局就访问不到i。如果不是let而是var呢，就会有全局变量污染



```js
{
    let j;
    for (let j = 0; j < 10; j++) {
        let i = j
        console.log(i)
    }
}
```

1. 上面的循环中，每一次迭代，都会重新进行绑定，每次绑定时，j都是新的值，而不是始终10



```js
var foo = true,
    bar = 10
if (foo) {
    var tub = 20
    if (tub > bar) {
        // 执行一些操作
    }
}
// ---如果进行重构
```



var可以直接进行很轻松的移动，上面在if里面声明的变量就相当于是全局的。

但是let呢，不行

```js
var foo = true,
    bar = 10
if (foo) {
  	// let tub = 20
   
}
let tub = 20 // let变量也要移动过来
if (tub > bar) {
    // 执行一些操作
}
```



#### 3.4.4 const

1. const声明的必须是一个常量；初始值；没有变量提升，暂时性死区
2. 实质：保存的是地址。简单（值本身）；复杂（指针），指针指向的区域不变。但是该区域里面的值，不能保证

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105193929361.png" alt="image-20221105193929361" style="zoom:50%;" />

```js
const obj = {name: 123}
obj.age = 45
obj = {height: 111} // 是错的
```



#### 小结：

1. 我们讲了with和try / catch是最早的块级作用域，不兼容的情况时，我们需要一些工具，把我们写的ES6代码转化为ES5或者更年轻的，其就是 try / catch
2. 我们讲了let变量
   1. 存在块级作用域。并且有显示和隐式两种绑定方式。显示就是直接套一个{},这个对于以后的代码重构是很好的。
   2. 我们讲了let的显示绑定作用域，垃圾回收机制也有关系，显示绑定能够明确告诉引擎，这段代码执行完毕，就回收
3. 我们讲了const变量，的本质。很多和let一致，还有常量的地方要尤其注意。





### 3.5 大结

1. 我们讲了函数作用域，一个函数里面的变量，在这个范围内都可以被使用，包括嵌套作用域，这个是一个很好的设计
2. 我们讲了隐藏内部实现，就是可以把一段代码隐藏到函数里面，这样不仅可以避免变量的命名冲突；还符合最小特权原则，把必要的代码尽量封装到函数里面
3. 我们分析了具名和匿名的两种情况，具名更有利于引擎的查找。而IIFE，立即执行函数，也最好是具名的形式。立即执行函数也是创建了一块独立的作用域
4. 块级作用域，有早期的with和catch的实践，还有let和const的新的实现。以及显示的声明变量，对于代码维护的好处。





## 4. 提升

### 4.1 先有鸡还是先有蛋



查看下面的代码

```js
a = 2
var a
console.log(a)
```

1.输出是2

2.变量不声明，直接赋值，可以这样使用，但是我们不推荐这样去做



查看下面的代码

```js
console.log(a)
var a = 2
```

1.输出的是undefined

2.变量提升会被提前，但是赋值并不会被提前



### 4.2 编译器再度来袭

1. JS引擎解释代码之前，先对代码进行编译，其中一部分工作，就是找到所有的声明。(嘿作用域哥们，你见过变量a嘛？如果见过，就会把这个作用域和变量a关联起来)。等执行完这一步，在处理下一步
2. 正是因为查找变量声明，所以，变量和函数的声明会在代码执行前，先被处理
3. var a = 2; -> var a、a = 2； 第一个变量声明是在编译阶段运行的，第二个变量声明是在原地等待着被执行。(只有声明本身会被提升，赋值等其它操作都会被留在原地)



```js
var a 
a = 2
console.log(a)
---
var a 
console.log(a)
a = 2
```



4. 变量声明的概念就是：变量和函数声明从它们在代码中出现的位置，被移动到了最上面，这个过程就是提升。



```js
foo() 
function foo() {
	console.log(a) // undefined
    var a = 2
}
----
注意，var a只会提升到foo作用域的顶部
```





5. 函数提升，但是函数表达式不会提升.

```js
foo2() // foo2 is not defined TypeError
var foo2 = function bar() {
    ...
} 
    
---
var foo2
foo2()
foo2 = function bar() {}
```



6. 即使是具名的函数表达式，也无法使用

```js
foo2() // foo2 is not defined TypeError
bar() // ReferenceError
var foo2 = function bar() {
    ...
} 
   
```

### 4.3 函数优先















# 第二部分

### 3.1 对象的语法

**如何创建一个对象**

```js
// 字面量(文字语法)
let obj = {
    name: 'li',
    age: 20
}
// 构造函数形式的创建
let obj2 = new Object()
obj2.name = 'zhi'
obj2.age = 'hang'
```

>两种方式的区别？
>
>第二种创建对象的方式，必须一个一个添加对象的属性;
>
>第一个更加方便，一次性添加多个





### 3.2 JS有哪些基本数据类型

```js
number
string
boolean
null
undefined
(bigInt)
(symbol)

```

**null是一个bug，为什么？**

是语言的一个bug，虽然typeof null是object 但是它是基本数据类型。

**为什么typeof null 是object呢？**

在JS中，不同的对象在底层，都表示为二进制。在JS中，**二进制前三位为0**的都会被typeof 判定为object。null的二进制所有都是0，所以他的typeof的结果也是object

`以上本身并不是对象，而是基本数据类型.JS中万物皆对象的说法是错误的`



### 3.2 object及其子类型

object是复杂数据类型，对象、数组Array、正则RegExp、日期Date、错误Error

JS中还有很多内置对象

```js
String 
Number
Boolean


Object
Function
Array
Date
RegExp
Error
```



**String、Number、Boolean这三个和基本数据类型一致不？**

  他们看起来和基本数据类型一致，但是其实不一致，实现起来更加的复杂，他们是构造函数。

```js
let str = 'I am a string'
console.log(typeof str); // string
console.log(str instanceof String); // false

let strObject = new String('I am a stringObject')
console.log(typeof strObject); // object 因为strObject是由String构造函数创建的对象
console.log(strObject instanceof String); // true

console.log(Object.prototype.toString.call(strObject)); // [object String]
```



**str访问索引和length是如何访问的？**

​	I am a string 并不是一个对象 而是一个字面量 -> 如果要在字面量上进行 str[0]访问，str.length -> 需要转化为String对象 -> 但是JS**引擎会在使用的时候 自动将其转化为对象**

```js
console.log(str[0]); // I
console.log(str.length); // 13

// 数值字面量和布尔字面量也是这样 -> 转化为Number 才能使用上面的方法
console.log(123.123.toFixed(2)); // 123.12
```



**注意点：**

1. null和undefined没有构造函数形式 只有字面量形式
2. date只有构造函数形式 没有字面量形式
3. Object、Array、RegExp、Function无论用文字还是构造函数的形式都是对象，使用字面量形式更加方便一些，使用构造函数的形式可以提供额外的选项(特殊需要的时候再使用)





### 3.3 内容

**1.对象的内容存储在哪里？存储在容器本身？**

- 存储在容器本身的是属性的名字
- 属性名是指针 -> 指向内容空间，值存储在空间里面
- 为什么要这么设计呢？性能的问题，对象的数据量大，不确定的，放在堆里面是更好的。

```js
{
    result: [x,x,x,x,x,x,,x]
}
```





**2.对象的访问的方式有哪些？**

属性访问和键访问。

```js
obj = {
    a: 123
}
```



比如`obj.a是属性访问和obj['a']是键访问`。访问的是同一个位置，返回的是同一个值



**3.两种访问方式有什么区别？**

obj.name必须满足`标识符的命名规范`。（必须是变量）

obj["name"],原话是name必须符合`符合UTF-8/Unicode”字符串`,(跟的是字符串或者**变量**)



```js
let myObject = {
    a: 2
}
let idx
if (wantA) {
    idx = 2
}
console.log(myObject[idx])
```



**4.键值对访问的注意点**

```js
let myObject = {
    
}
myObject[true] = 'foo'
myObject[3] = 'bar'
myObject[myObject] = 'baz'

myObject['true'] // 'foo'
myObject['3'] // bar
myObject[myObject] // 其实被转化为 -> myObject["[object object]"] baz
```

**说明**:对象的键值访问时，如果是布尔、数字、对象，最终都被转化为字符串。**除了字符串以外的数据类型**，都会被这么转化。





#### 3.3.1 可计算属性名

```js
let prefix = 'foo'
var myObject = {
    [prefix + 'bar']: 'hello bar',
    [prefix + 'baz']: 'hello baz'
}
console.log(myObject['foobar'])
console.log(myObject['foobaz'])
```

说明：对象的属性名复杂，涉及运算，“字符串拼接”



**还可以和Symbol的结合**

```js
let symbol = Symbol(10)
console.log(symbol.description);
let obj = {
    [symbol.description]: 123
}
console.log(obj['10']); // 123
```



#### 3.3.2 属性和方法

```js
let obj = {
    foo: function () {
        console.log(10)
    }
}
```

**function() {console.log(10)}这个函数是否属于obj这个对象？**

1. 某个函数，属于对象，就被称为方法。那么访问obj.foo就会被称为方法访问
2. 但是从`技术角度`来说，函数永远不会属于一个对象 => 把对象内部引用的函数称为方法，有点不妥 => 因为没有函数属于某个对象，函数和对象的关系是间接的关系

```js
function foo () {
    console.log('foo')
}
let someFoo = foo // 让一个变量引用这个函数
let obj = {
    myObject: foo // 对象里面的一个属性引用的了这个函数
}
console.log(foo)
console.log(someFoo)
console.log(obj.myObject)
```

3. someFoo和obj.myObject是不同的方式引用了foo函数，不能说foo属于obj对象
4. 唯一区别就是，函数打印this。那么someFoo和obj.myObject会有很大的区别
5. 保险的说法：JS中的“函数”和“方法”是可以互换的

>我认为没有必要去纠结这个



#### 3.3.3 数组

1.可以访问数组的下标和length

2.也可以直接给数组添加属性,不推荐这样做

3.给数组添加内容，采用 myArr['3'] 会被自动转化为数组

```js
// 1.可以访问数组的下标和length
var myArr = ['foo', 42, 'bar']
console.log(myArr[0])
console.log(myArr.length)
console.log(myArr[2])

// 2.也可以直接给数组添加属性,不推荐这样做
myArr.baz = 'baz'
console.log(myArr.baz) // baz
console.log(myArr.length) // 3

// 3. 
myArr['3'] = 'three'
console.log(myArr[3]) // three
```





#### 3.3.4 复制对象

**案例1**

```js
function anotherFunction() {
    /*  */
}
let anotherObject = {
    c: true
}
let anotherArray = []

let myObject = {
    a: 2,
    b: anotherObject,
    c: anotherArray,
    d: anotherFunction
}
anotherArray.push(anotherObject, myObject)
console.log(anotherArray);
```

1. 如果是**浅拷贝**呢，就没有问题，赋值a，就是a的值；赋值bcd，就是复制指针，内容是一样的。
2. 但是如果是**深拷贝**呢？复制的就是值本身了，就会造成循环引用。let obj2 = JSON.parse(JSON.stringify(myObject)) 就不适合转化 循环引用的对象



**json安全的意思**：也就是说，可以被序列化为一个JSON字符串并且根据这个字符串解析出一个结构和值完全一样的对象。才适合`JSON.parse(JSON.stringify(myObject))`

- 该API的缺陷，无法解决循环引用的问题
- 无法序列化函数
- 无法拷贝 set map regExp



**案例2** **Object.assign**

```js
let obj = {
    name: '123',
    age: '456',
    info: {
        height: 190
    }
}
let obj2 = Object.assign({}, obj)
console.log(obj);
console.log(obj2);
obj.name = '8888888'
obj.info.height = '99999999'
console.log(obj); // name是8888888 info两个对象都会发生变化
console.log(obj2); // name还是123
```



**书上的案例**

Object.assign是浅拷贝，引用数据类型，拷贝的是指针，

```js
let newObj = Object.assign({}, myObject)
console.log(newObj.a); // 2
console.log(newObj.b === anotherObject); // true
console.log(newObj.c === anotherArray); // true
console.log(newObj.d === anotherFunction); // true
```





**for in 也是 浅拷贝**

```js
let obj3 = {}
for (let key in obj) {
    obj3[key] = obj[key]
}
console.log(obj3);
obj3.name = '888'
obj3.info.height = 200
console.log(obj3); // name是 '888'
console.log(obj); // name是 '123'
```





#### 3.3.5 属性描述符

**1.每个属性身上都有属性描述符**

```js
var myObject = {
    a: 2
}
console.log(Object.getOwnPropertyDescriptor(myObject, 'a'));
// 打印出来是 value writable enumerable configurable
```



**2.修改值 value**

```diff
// writable 能否修改
let obj = {
    name: 'hangge',
    age: 20
}
obj.name = 'xiaobai'
console.log(obj); // xiaobai
Object.defineProperty(obj, 'name', {
    writable: false
})
+obj.name = 'hangge'
+console.log(obj); // xiaobai 修改失败
```



**3.是否可以再次配置属性描述符 configurable**

```js
// configurable
Object.defineProperty(obj, 'name', {
    configurable: false
})

// TypeError
Object.defineProperty(obj, 'name', {
    configurable: true
})
// 这个是能够修改成功的 但是writable 由 false -> true是不行的
Object.defineProperty(obj, 'name', {
    writable: false
})
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
```



**不能够删除这个属性**

```js
console.log(Reflect.deleteProperty(obj, 'name')); // false
console.log(obj);
```





**4.enumerable 能够遍历枚举** **可枚举性**

```js
Object.defineProperty(obj, 'age', {
    enumerable: false
})
for (let key in obj) {
    console.log(key, obj[key]); // 只有name xiaobai 因为age已经是不可以枚举的了
}
```



#### 3.3.6 不可变性

目标：希望对象不可变，或者是对象的属性不可变

##### **对象常量**

1. 对象常量，通过Object.defineProperty()API的writable和configurable两个属性，

- 不可以修改已有属性值
- 不可以重新定义
- 不可以删除属性
- 针对的是一个属性。可以添加新的属性



```js
		var myObject = {}
        Object.defineProperty(myObject, 'FAVOURITE_NUMBER', {
            value: 42,
            // 不可以修改
            writable: false,
            // 不可以删除
            configurable: false
        })
        console.log(myObject);
        // 修改
        myObject.FAVOURITE_NUMBER = 43
        console.log(myObject);
        // 删除
        Reflect.deleteProperty(myObject, 'FAVOURITE_NUMBER')
        console.log(myObject);
        // 可以增加新的属性
        myObject.a = 3
        console.log(myObject);
        // 重新定义
        // Object.defineProperty(myObject, 'FAVOURITE_NUMBER', {
        //     value: 43,
        //     // 不可以修改
        //     writable: false,
        //     // 不可以删除
        //     configurable: false
        // })
```





##### **禁止扩展**

2. 禁止扩展，通过Object.preventExtensions()的API

- 可以修改已有属性的值

- 可以重新定义已有的属性

- 可以删除已有的属性

- 不能添加新的属性

```js
let myObject2 = {
    a: 2
}
myObject2.a = 3
console.log(myObject2); // 修改
Reflect.deleteProperty(myObject2, 'a')
console.log(myObject2); // 可以删除
Object.preventExtensions(myObject2)
myObject2.b = 3
console.log(myObject2); // {a: 2} 创建b属性静默失败了
```



##### **密封 Object.seal()**

3. 密封对象

- 可以修改属性的值

- 删除新属性失败

- 添加新属性失败

```js
let myObject3 = {
    a: 2
}
Object.seal(myObject3);
// 可以修改属性的值
myObject3.a = 3
console.log(myObject3.a); // 3
// 添加新属性失败
myObject3.b = 4
console.log(myObject3); // 没有b
// 删除现有属性失败
Reflect.deleteProperty(myObject3, 'a')
```





##### **冻结：Object.freeze(myObject4)**

4. 冻结对象

修改、添加、删除新的属性都失败

```js
let myObject4 = {
    a: 2
}
Object.freeze(myObject4)
// 修改属性的值失败
myObject4.a = 3
console.log(myObject4.a); // 2
// 添加新属性失败
myObject4.b = 4
console.log(myObject4); // 没有b
// 删除现有属性失败
Reflect.deleteProperty(myObject4, 'a')
console.log(myObject4); // 没有b
```







##### 深度冻结所有的对象

- 先freeze 整个对象
- 遍历对象的所有属性 单独调用Object.freeze()

```js
let obj6 = {
    age: 20
}
let obj5 = {
    name: '123',
    foo: obj6
}
Object.freeze(obj5)
console.log(obj5);
obj5.foo.age = 30
console.log(obj5); // age是能被修改
Object.keys(obj5).forEach(key => {
    Object.freeze(obj5[key])
})
obj5.foo.age = 40
```





#### 3.3.7 [[Get]]

> 访问一个对象的属性时，有一个细节。

```js
var myObject = {
    a: 2
}
console.log(myObject.a);
```



1. 在对象中查找是否有名称相同的属性，找打就会返回这个值
2. [[Get]]算法会执行另外一种非常重要的行为。遍历可能存在的原型链。[[Prototype]]
3. 如果无论如何都没有找到名称相同的属性，[[Get]]操作会返回值undefined





>区分，对象的属性值是undefined | 对象压根没有这个属性

```js
// 访问时，[[Get]]是怎么操作的？
var myObject = {
    a: 2
}
console.log(myObject.a);
console.log('-----------------------------------------');

let myObject2 = {
    a: undefined
}
console.log(myObject2.a); // undefined
console.log(myObject2.b); // undefined
```

1. 底层[[Get]]对myObject2.b的返回值的操作更加的复杂
2. 通过返回值 无法区分这两种情况，稍后会介绍





#### 3.3.8 [[Put]]

>给对象的某个属性赋值是，触发Put，到底是什么个机制呢？

如果已经存在这个属性，[[Put]]算法会做下面的检查

1. 属性是否是**访问描述符**[Getter和Setter],如果是并且存在就调用setter

2. 属性的**数据描述符**[value/writable/enumerable/configurable]种的writable是否是false呢？如果是的话，修改就会失败。严格模式，TypeError
3. 如果都不是，就直接将该值设置为属性的值。
4. 如果对象中，**没有这个属性**，[[Put]]操作会更加的复杂，我们后续会继续讨论。

```js
let obj = {
    name: 123
}
Object.defineProperty(obj, 'name', {
    writable: false
})
obj.name = '455'
console.log(obj); // 失败
```



```js
"use strict";
let obj = {
    name: 123
}
Object.defineProperty(obj, 'name', {
    writable: false
})
obj.name = '455'
console.log(obj); // type error
```





#### 3.3.9 Getter和Setter

1. getter和setter的操作 都只能应用到单个属性上面，无法应用到整个对象上。
2. getter和setter都是隐藏的函数



当给一个属性定义getter/setter/或者两者都有时，JavaScript会忽略他们的value和writable属性，取而代之的是getter和setter特性 + configurable + enumerable



**给a属性定义值为2，给b属性定义的值是 a * 2**

```js
let myObject = {
    get a() {
        return 2
    }
}
Object.defineProperty(myObject, 'b', {
    // 描述符
    get: function () {
        // 使得b属性的值是4
        return this.a * 2
    },
    // b属性能够被访问的到
    enumerable: true
})
console.log(myObject.a); // 2
console.log(myObject.b); // 4
```





**定义了getter但是没有setter会怎么样**

```js
let myObject2 = {
    get a() {
        return 2
    }
}
console.log(myObject2.a); // 2
myObject2.a = 3
console.log(myObject2.a); // 2 上面的赋值是不管用
```



**但是为了操作合理，我们还是希望能够 getter和setter一起去设置**

```js
let myObject3 = {
    get a() {
        return this._a_
    },
    set a(val) {
        this._a_ = val * 2
    }
}
myObject3.a = 3
console.log(myObject3.a); // 6
```



小结：

1. getter和setter的出现，会覆盖数据描述符value和writable

2. 定义了getter但是咩有定义setter，就会出现一个问题，赋值失效

3. 如果同时有getter和setter，是极好的







#### 3.3.10 存在性

**in判断的是属性是否在这个对象+它的原型链上**

```js
let obj = {
    a: 2
}
// obj.__proto__.b = '3'
console.log('a' in obj); // true
console.log('b' in obj); // false

// hasOwnProperty('')判断是仅仅是对象里面有无这个属性
console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('b')); // false
```



**in能够判断原型 但是hasOwnProperty不能**

```js
let obj = {
    a: 2
}
obj.__proto__.b = '3'
console.log('a' in obj); // true
console.log('b' in obj); // true

// hasOwnProperty('')判断是仅仅是对象里面有无这个属性
console.log(obj.hasOwnProperty('a')); // true
console.log(obj.hasOwnProperty('b')); // false
```



如果是**Object.create(null)**创建的对象 那么 hasOwnProperty()就会失效呢 **而且报错**

- 对象没有连接到Object.prototype上，这个时候就会不具备hasOwnProperty方法

```js
let obj2 = Object.create(null)
obj2.c = '123'
// console.log(obj2.hasOwnProperty('c')); // obj2.hasOwnProperty is not a function
// 更加强硬的方法
```



此时使用 调用**强行绑定**

```js
// 更加强硬的方法
console.log(Object.prototype.hasOwnProperty.call(obj2, 'c')); // true
```





**数组也可以使用 in**

数组的 2 in [2, 4, 6] 为什么是错的呢？

​	因为 [2，4，6]包含的属性名是0 1 2 没有4







**enumerable 可枚举性 就是 可以出现在对象属性的遍历中**

```js
var myObject = {}
Object.defineProperty(myObject, 'a', {
    enumerable: true,
    value: 2
})
Object.defineProperty(myObject, 'b', {
    enumerable: false,
    value: '3'
})
console.log(myObject.b); // 3
console.log(myObject.hasOwnProperty('b')); // true
for (let k in myObject) {
    console.log(k, myObject[k]); // a 2 没有b
}
```



数组也是可以枚举的，但是最好不要用 for in 

![image-20221027145125405](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221027145125405.png)



 **另一种方式 来判断对象是否是可以枚举的**

1. Object.keys返回数组，只有可以枚举的

2. propertyIsEnumerable，返回一个数组，无论是否可以枚举

3. in和hasOwnProperty区别在于是否会去查找原型链

4. Object.keys和propertyIsEnumerable都只会查找自身，不会去查找原型链
5. propertyIsEnumerable 检查给定的元素是否在对象中，并且满足enumerable: true

```js
var myObject3 = {}
Object.defineProperty(myObject3, 'a', {
    enumerable: true,
    value: 2
})
Object.defineProperty(myObject3, 'b', {
    enumerable: false,
    value: '3'
})
console.log(myObject3.propertyIsEnumerable('a')); // true
console.log(myObject3.propertyIsEnumerable('b')); // false
console.log(Object.keys(myObject3)); // 'a'
console.log(Object.getOwnPropertyNames(myObject3))['a', 'b']
```

