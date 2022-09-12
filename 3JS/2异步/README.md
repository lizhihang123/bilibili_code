# 1. promise

## 1.1 同步和异步有什么区别

1.单线程是什么：`阻塞`。JS请求资源，没请求好，就会卡住，下面的代码就不能够执行。同一个时间只能够做一件事情

2.我们希望网络请求，不能卡住，为了解决单线程单来的问题.**所以，需要异步**

```diff
console.log(10)
// 异步的特点
setTimeout(() => {
	console.log(3)
})
console.log(3)
```



```js
console.log(3)
alert(5)
console.log(4)
```



>3.JS和dom渲染共用一个线程 -》 JS执行，dom渲染挺会；dom渲染停止，js执行 -》JS可以修改dom结构？

## 1.2 异步的应用场景

1. 网络请求
2. 定时器

```js
$.get('./get', (data) => {
    img.src = data
})
```

```js
console.log(10)
// 异步的特点
setTimeout(() => {
	console.log(3)
})
console.log(3)
```

```js
console.log(10)
// 异步的特点
setInterval(() => {
	console.log(3)
})
console.log(3)
```

```js
const img = document.getElementById('img')
img.onload = function () {
    // onload是img的一个事件
    // 只有图片的src被赋值了，才会执行这里
    console.log(xxx)
}
img.onerror = function () {
    xxx
}
img.src = 'xxx'
```



## 1.3 promise概念

为了解决回调地狱的问题而出现

1. 能够解决d回调地狱的问题

回调地狱是什么

```javascript
function back() {
    setTimeout(() => {
        console.log(1);
        setTimeout(() => {
            console.log(2);
            setTimeout(() => {
                console.log(3);
            }, 3000);
        }, 2000);
    }, 1000);
}
back();
```

缺点：

```plain
1. 不利于维护，要修改一个，里面其他的全部都要修改。代码的耦合性太差
2. 嵌套太多，可读性差
```



1. Promise 大写的， 是一个构造函数，里面保存着异步操作
2. promise，小写的promise，从他身上可以获取异步操作的最终状态是成功或者是失败
3. Promsie，他的原型上有then和catch方法，自己身上有all race reject resolve方法
4. 三种状态 





## 1.4 promise请求图片

通过promise 调用图片

```diff
<div class="box"></div>
<script>
// 2. 这个案例想做的是
let imgUrl = 'https://img0.baidu.com/it/u=2112693830,2857591310&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
let imgUrl2 = 'https://img01.baidu.com/it/u=2112693830,2857591310&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
function imgPromise(imgUrl) {
    const promise = new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function () {
            reject(img)
        }
        img.src = imgUrl
    })
    return promise
}
imgPromise(imgUrl).then(img => {
    return img // 返回的是普通的img对象 下面的then也能够接受
}).then(img => {
    document.body.appendChild(img)
    return imgPromise(imgUrl2) // 返回的是一个 promise对象 下面的then能够接受这个promise返回的结果
}).then(img2 => {
	document.body.appendChild(img2)
}).catch(error => {
    document.querySelector('.box').innerHTML = error
})
```



<img src="C:/Users/huawei/AppData/Roaming/Typora/typora-user-images/image-20220909190158138.png" alt="image-20220909190158138" style="zoom:50%;" />





## 1.5 event loop(事件循环)

>就是异步回调的实现原理

```js
JS代码是一行一行执行，某一行报错，下面就不会执行。先把同步代码实现，再执行异步实现。异步怎么实现？回调来实现
● 先把所有的语句都放到主线程执行栈，都是同步
● 但是执行的时候，碰到了回调函数，是异步，交给“异步任务处理器”记录，等待时机，时机到了，再放到任务队列(浏览器进行判断)
● 主执行栈执行完毕，主执行栈为空时
● 再去看任务队列的异步任务，拿到主线程的底部来执行。
```

```js
console.log('first')
setTimeout(() => {
    console.log('second')
})
console.log('second')
```

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220909192937454.png" alt="image-20220909192937454" style="zoom:50%;" />



dom事件，也是基于event loop来实现的。代码执行到$('#btn1').click时，会把这个加载到浏览器中，让浏览器去判断什么时候放到任务队列。

dom事件，事件触发，那么任务加载到任务队列。等到主线程任务执行完毕，再执行任务队列里面的任务

```diff
<button id="btn1">提交</button>
<script>

console.log('Hi')
$('#btn1').click(function() {
	console.log('button clicked')
})
console.log('Bye')

</script>
```



## 小结

1. 定时器是异步，浏览器可以控制api，进而多少时间后，才会把任务放入任务队列
2. 图片加载，是请求加载到了以后，浏览器会把任务放到任务队列
3. dom事件不是异步，但是事件的回调的触发，也是基于event loop

## 1.6 promise的API



### 理解 resolve reject 与 then catch的关系

- resolve触发then
- reject触发catch
- 如果说then方法里面抛出错误，状态就是 rejected
- 如果说catch方法里面也抛出错误 状态就是 rejected
- 否则都是 fulfilled

```diff
const promise = Promise.resolve(100)
console.log(promise); // fulfilled
promise.then(res => {
    console.log(res);
})
const promise2 = Promise.reject('err')
promise2.then(res => {
    console.log(res);
}).catch(err => {
    console.log(err); // 触发
})
console.log(promise2); // rejected
```



```diff
 const p1 = Promise.resolve().then(res => {
            console.log(1); // 1 整个状态是 funfilled
        }).catch(() => {
            console.log(2);
        }).then(() => {
            console.log(3); // 3
        })
        console.log(p1);
```





```diff
  // const p2 = Promise.resolve().then(() => {
        //     console.log(2); // 2
        //     throw new Error('error1')
        // }).catch(() => {
        //     console.log(2); // 2
        // }).then(() => {
        //     console.log(3); // 3 这里尤其注意 只要catch里面没有报错 状态就是 resolved
        // })
```



```diff
  const p3 = Promise.resolve().then(() => {
            console.log(1); // 1
            throw new Error('error1')
        }).catch(() => {
            console.log(2); // 2
        }).catch(() => {
            console.log(3); // 下面这个3不会打印 因为上面的catch里面的没有抛出错误
        })
```





## 1.7 手写修正

重写第三次，`then方法的`错误示范

```diff
then(fn1, fn2) {
// 4.判断传进来的是否是回调函数
fn1 = typeof fn1 === 'function' ? fn1 : (v) => v
fn2 = typeof fn2 === 'function' ? fn2 : (v) => v
// 必须返回一个promise对象
let pro = new Promise((resolve, reject) => {
    // 区分三种不同的状态
    if (this.state === 'pending') {
        this.resolveCallback.push(() => {
            const newValue = fn(this.value)
            resolve(newValue)
        })
    }


+    if (this.state === 'fulfilled') {
        try {
            resolve(this.value)
        } catch (error) {
            reject(error)
        }
    }


+    if (this.state === 'rejected') {
        try {
            reject(this.reason)
        } catch (error) {
            reject(error)
        }
    }
})
return pro
}
```

then方法的正确示范



存在问题：

1.catch，如果有then的err，还是会进入catch

2.如果p2 = p1.then，p2还是false





### 1.初始化

```js
class myPromise {
    constructor(fn) {
        const resolveHandler = () => {

        }

        const rejectHandler = () => {

        }
        try {
            fn(resolveHandler, rejectHandler)
        } catch (error) {
            rejectHandler(error)
        }
    }
}
```



```diff
class myPromise {
    constructor(fn) {
+        this.state = 'pending'
+        this.value = undefined
+        this.reason = undefined
        const resolveHandler = (value) => {
+            if (this.state === 'pending') {
+                this.state = 'fulfilled'
+                this.value = value
            }
        }
        const rejectHandler = (reason) => {
+            if (this.state === 'pending') {
+                this.state = 'rejected'
+                this.value = reason
            }
        }
        try {
            fn(resolveHandler, rejectHandler)
        } catch (error) {
            rejectHandler(error)
        }
    }
}
```





```diff
const promise = new myPromise((resolve, reject) => {
    // resolve(100)
    reject('出错了')
})
console.log(promise);
```



### 2.then方法准备

明白，如果里面写定时器，刚开始控制台是pending状态，一段时间后是 fulfilled

```diff
const promise = new myPromise((resolve, reject) => {
    // resolve(100)
    // reject('出错了')
    setTimeout(() => {
+        resolve(100)
    })
})
console.log(promise);
```





下一步,假设要测试，有then方法，传入两个回调。then里面的回调什么触发很重要

```diff
const promise = new myPromise((resolve, reject) => {
    // resolve(100) => 执行then里面的成功回调
    // reject('出错了') =》执行then里面的失败回调
    setTimeout(() => {
        resolve(100) =》状态刚开始是pending 所以需要等待放到数组里面去
    })
})
 
 promise.then(() => { }, () => { })
```



先让callback里面的方法执行。至于什么时候数据放到callback，我们后面会说

为什么要声明这个resolveCallback数组 和 rejectCallback数组呢？

```diff
class myPromise {
    constructor(fn) {
        this.state = 'pending'
        this.value = undefined
        this.reason = undefined
        this.resolveCallback = []
        this.rejectCallback = []
        const resolveHandler = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled'
                this.value = value
+                this.resolveCallback.forEach(fn => fn())
            }
        }

        const rejectHandler = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected'
                this.reason = reason
+                this.rejectCallback.forEach(fn => fn())
            }
        }
        try {
            fn(resolveHandler, rejectHandler)
        } catch (error) {
            rejectHandler(error)
        }
    }
}
```



### 3.catch方法

catch函数本身没有啥内容，就直接是返回对`this.then的调用`，第一个参数是null，第二个参数注意

```diff
class myPromise {
    constructor(fn) {
        this.state = 'pending'
        this.value = undefined
        this.reason = undefined
        this.resolveCallback = []
        this.rejectCallback = []
        const resolveHandler = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled'
                this.value = value
                this.resolveCallback.forEach(fn => fn())
            }
        }

        const rejectHandler = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected'
                this.reason = reason
                this.rejectCallback.forEach(fn => fn())
            }
        }
        try {
            fn(resolveHandler, rejectHandler)
        } catch (error) {
            rejectHandler(error)
        }
    }

+    then(fn1, fn2) {

    }

    catch() {
+        return this.then(fn2)
    }
}
```



### 4.then方法继续

知道 then里面要区分3种状态

```diff
then(fn1, fn2) {
    // fn1如果是函数 就返回本身
    // 如果不是函数 就返回一个函数 => 这个函数的作用就是 传进来什么值 我就返回什么值
    fn1 = typeof fn1 === 'function' ? fn1 : (v) => v
    fn2 = typeof fn2 === 'function' ? fn2 : (err) => err
    if (this.state === 'pending') {
        
    }

    if (this.state === 'fulfilled') {
        
    }

    if (this.state === 'rejected') {
        
    }
}
```



fulfilled要做的事情

```diff
then(fn1, fn2) {
    // fn1如果是函数 就返回本身
    // 如果不是函数 就返回一个函数 => 这个函数的作用就是 传进来什么值 我就返回什么值
    fn1 = typeof fn1 === 'function' ? fn1 : (v) => v
    fn2 = typeof fn2 === 'function' ? fn2 : (err) => err
    if (this.state === 'pending') {
	
    }

    if (this.state === 'fulfilled') {
+        return new myPromise((resolve, reject) => {
            // 为什么是传入 this.value
            // 执行了resolve 会改变 this.value的值
            // 改变了这值 => 把这个值传递给 fn1() => {}
            try {
                const newValue = fn1(this.value)
                // 为什么这里要再执行一遍 resolve()
                resolve(newValue)
            } catch (error) {
                // 为什么这里执行的 reject 不是 fn2
                reject(error)
            }
        })
    }

    if (this.state === 'rejected') {

    }
}
```



reject要做的事情

```diff
class myPromise {
    constructor(fn) {
        this.state = 'pending'
        this.value = undefined
        this.reason = undefined
        this.resolveCallback = []
        this.rejectCallback = []
        const resolveHandler = (value) => {
            if (this.state === 'pending') {
                this.value = value
                this.state = 'fulfilled'
                this.resolveCallback.forEach(fn => fn())
            }
        }
        const rejectHandler = (reason) => {
            debugger
            if (this.state === 'pending') {
                this.reason = reason
                this.state = 'rejected'
                this.rejectCallback.forEach(fn => fn())
            }
        }
        try {
            fn(resolveHandler, rejectHandler)
        } catch (error) {
            console.log(error);
        }
    }

    then(fn1, fn2) {
        fn1 = typeof fn1 === 'function' ? fn1 : (v) => v
        fn2 = typeof fn2 === 'function' ? fn2 : (err) => err

        if (this.state === 'pending') {

        }
        if (this.state === 'fulfilled') {
            return new myPromise((resolve, reject) => {
                try {
                    const newValue = fn1(this.value)
                    resolve(newValue)
                } catch (error) {
                    reject(error)
                }
            })
        }

        if (this.state === 'rejected') {
+            return new myPromise((resolve, reject) => {
+                debugger
                try {
                    const newReason = fn2(this.reason)
                    reject(newReason)
                } catch (error) {
                    reject(error)
                }
            })
        }
    }

    catch(fn) {
        return this.then(null, fn)
    }
}
```



pending状态 then做的事情

```diff
then(fn1, fn2) {
    fn1 = typeof fn1 === 'function' ? fn1 : (v) => v
    fn2 = typeof fn2 === 'function' ? fn2 : (err) => err

    if (this.state === 'pending') {
+        return new myPromise((resolve, reject) => {
            this.resolveCallback.push(() => {
                try {
                    const newValue = fn1(this.value)
                    resolve(newValue)
                } catch (error) {
                    reject(error)
                }
            })

            this.rejectCallback.push(() => {
                try {
                    const newReason = fn2(this.reason)
                    reject(newReason)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    if (this.state === 'fulfilled') {
        return new myPromise((resolve, reject) => {
            try {
                const newValue = fn1(this.value)
                resolve(newValue)
            } catch (error) {
                reject(error)
            }
        })
    }

    if (this.state === 'rejected') {
        return new myPromise((resolve, reject) => {
            debugger
            try {
                const newReason = fn2(this.reason)
                reject(newReason)
            } catch (error) {
                reject(error)
            }
        })
    }
}
```

疑惑：

```diff
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(100)
    }, 2000)
})
let p2 = p1.then(res => {
    console.log(res);
    return res + 1
}, (err) => {
    console.log(err);
    return err + 1
})
console.log(p1);
console.log(p2);
```

控制台 浏览器如果时间没到，点开了promise查看状态，就是pending

时间到了，才点开查看promise的状态，就是正确的状态







### 5. resolve 和 reject方法

#### Promise.resolve()等价于

```diff
new Promise((resolve, reject) => {
	resolve()
})
```



#### Promise.reject()等价于

```diff
new Promise((resolve, reject) => {
	reject()
})
```





### 5.all



#### Promise.all()

```diff
Promise.all([promise1, promise2, promise3]).then(values => {
	// values是数组，里面存储了上面三个对象的结果
} )
```

使用场景：`如何解决，请求并发的问题？`

给页面添加loading效果，希望三个请求导航、头部、底部都好了，再去渲染数据，loading才关闭。

如果一个一个去发送，很占用时间，就用.all的方法去执行。

- 注意，返回的结果，也是和前面的promise的顺序一一对应

- 注意，只有所有的promise成功了，最后的状态才是resolve，只要有一个是reject，最终的结果就是失败的

![image-20220710104816399](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4575/image-20220710104816399.png)



```diff
//买作业本
function cutUp(){
    console.log('挑作业本');
    var p = new Promise(function(resolve, reject){ //做一些异步操作
        setTimeout(function(){
            console.log('挑好购买作业本');
            resolve('新的作业本');
        }, 1000);
    });
    return p;
}

//买笔
function boil() {
    console.log('挑笔芯');
    var p = new Promise(function(resolve, reject){ //做一些异步操作
        setTimeout(function(){
            console.log('挑好购买笔芯');
            resolve('新的笔芯');
        }, 1000);
    });
    return p;
}

+        Promise.all([cutUp(),boil()]).then(function(results){
    console.log("写作业的工具都买好了");
    console.log(results);
});

// 上面的结果
挑作业本
挑笔芯
挑好购买的作业本
调好购买笔芯
写作业的工具都好了
[新的作业本， 新的笔芯] // resolve的结果会放在这个里面

```



https://juejin.cn/post/6941194115392634888#heading-15 里面写的finally方法

```diff
myPromise.all = function (promiseList) {
    return new myPromise((resolve, reject) => {
        let count = 0 // 计数器
        let result = [] // 结果数组
        let length = promiseList.length
        promiseList.forEach(pro => {
            pro.then(data => {
                result.push(data)
                count++
                if (count === promiseList.length) {
                    resolve(result)
                }
            }).catch(err => {
                // 如果出错了 该怎么处理
                reject(err)
            })
        })
    })
}
```



### 6.race

#### Promise.race()

是赛跑原则，里面只要有一个promise的结果出来了，就会进行下一步then

>其他没有执行完毕的异步操作依然会执行，不会停止。只是，一个promise好了，就会立马执行.then
>
>注意，只要最先的一个promise是成功的，最先的结果就是成功的。否则就是失败的。

使用场景：缓存的读取，读的是服务器的，还是读的是本地的。哪个更快，就读哪个。做一件事情，超过5s，就不做了，就使用这个方法。

```diff
var promiseArr = [
    thenfs.readFile('./txt/2.txt', 'utf8'),
    thenfs.readFile('./txt/3.txt', 'utf8'),
    thenfs.readFile('./txt/1.txt', 'utf8'),
]
Promise.race([promise1, promise2, promise3]).then(values => {
	//
}) 
```



另一个race应用

```diff
function requestImg(){
    var p = new Promise(function(resolve, reject){
    var img = new Image();
    img.onload = function(){
       resolve(img);
    }
    img.src = 'xxxxxx';
    });
    return p;
}

//延时函数，用于给请求计时
function timeout(){
    var p = new Promise(function(resolve, reject){
        setTimeout(function(){
            reject('图片请求超时');
        }, 5000);
    });
    return p;
}

+        Promise.race([requestImg(), timeout()]).then(function(results){
    console.log(results);
}).catch(function(reason){
    console.log(reason);
});
//上面代码 requestImg 函数异步请求一张图片，timeout 函数是一个延时 5 秒的异步操作。我们将它们一起放在 race 中赛跑。
//如果 5 秒内图片请求成功那么便进入 then 方法，执行正常的流程。
//如果 5 秒钟图片还未成功返回，那么则进入 catch，报“图片请求超时”的信息。

```





```diff
myPromise.race = function (promiseList) {
    return new myPromise((resolve, reject) => {
        let flag = false
        promiseList.forEach(pro => {
        	// 不管第一个是true还是false 都会只根据第一个promise的结果
        	// 如果第一个是fulfilled -> resolved
        	// rejected -> reject
            if (!flag) {
                pro.then(data => {
                    resolve(data)
                }).catch((err) => {
                    reject(err)
                    console.log(err);
                })
                // 所以flag放在这里
                flag = true
            }
        })
    })
}
```



### 7.allSeltted



### 8.finally