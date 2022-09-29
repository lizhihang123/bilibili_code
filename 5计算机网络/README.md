## 1.1 http缓存

#### 缓存的基本认知

为什么需要缓存？

```diff
 一个篮子里面，有苹果，去数，1 2 3 有三个苹果，数了有三个，我再问一次，你不需要再数不需要费力气了，直接说3.但是如果个数发生了变化，就要重新去数，然后再记住这个数字。
+ 一句话 - 能够更加省式省力
```

#### 缓存分类

`浏览器缓存`、服务器缓存[CDN缓存、代理服务器缓存]、数据库缓存

```diff
数据库缓存，浏览器 -> 请求给服务器 -> 服务器收到 去数据库查信息 -> 第一次查到了 -> 假设服务器拿到了，要进行处理, 服务器存住 -> 就给到了浏览器 -> 下一次客户端再发请求 -> 如果请求的内容一致，服务器不需要再次去数据库查了
```



#### 测试 

打开控制台，去浏览器删除缓存ctrl + F5,观察，第一次进入后再，第二次进入时，发现disk-cache，就是表明有些数据是从缓存里面读来的

>1. data:image 表示是base64的图片 是从css里面进来的
>2. webp是一种经过压缩的格式，流行的趋势，1MB -》 100kb, 能够直接把数据的体积降下来



#### `强缓存`

expires

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929174900964.png" alt="image-20220929174900964" style="zoom:50%;border: 1px solid black;" />



都有时

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929175632888.png" alt="image-20220929175632888" style="zoom:50%; border: 1px solid black;" />

**Cache-Control**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929173052989.png" alt="image-20220929173052989" style="zoom:50%; border: 1px solid black;" />

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929173205552.png" alt="image-20220929173205552" style="zoom:50%; border: 1px solid black; " />



**no-cache**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929174100924.png" alt="image-20220929174100924" style="zoom:50%; border: 1px solid black;" />





**no-store**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929174130975.png" alt="image-20220929174130975" style="zoom:67%; border: 1px solid black;" />





**no-store和no-cache的区别：**

![image-20220929174145481](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929174145481.png)



**max-age:**

绝对时间，缓存的相对时间

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929174225128.png" alt="image-20220929174225128" style="zoom:50%; border: 1px solid black;" />



图3

**must-reavalidate**

必须再次向服务器验证，该资源是否是有效的

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929173258271.png" alt="image-20220929173258271" style="zoom:50%;" />

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929174257525.png" alt="image-20220929174257525" style="zoom:50%; border: 1px solid black;" />



`强缓存`

1. 客户端第一次向服务器请求资源，资源缓存在本地。

下一次要使用时，判断资源是否在有效期内，

​	如果在，直接获取资源，不向服务器发送请求，

​	如果不在，就发请求

2. 例子：强缓存可以理解为，你去店里面买了一个食品，**食品上面有“有效期”**，只要在有效期里面，你就可以吃它。
3. 如果判断资源是否在有效期内呢？依靠字段
   **expires 和 cache-control**

`expires 绝对时间`
expires: Fri, 01 Jan 1980 00:00:00 GMT ，表示这个时间点会过期
**缺陷**：如果**客户端修改了本地的时间**，但是强缓存根据的服务器的时间，本地改为2012年 但是服务器还是2022年，很久都不会过期。
例子：服务端设置是2050年，图片过期；客户端把时间改成了2080年，导致服务端不管发什么资源，客户端这里都会过期。

`cache-control 相对时间`

相对于浏览器端的时间
cache-control: no-cache, max-age=300000s, must-revalidate 

根据**max-age**字段的时间，本地的时间，加上这个时间点，之后才会过期，那么即便修改了本地的时间很晚，也没关系。类似于2080年，加一个300000s。（如果出现混乱，也就是说，服务器时间和本地的时间相差很大时，就以cache-control为准）

可以多个字段存在
**max-age** 表示时间长度 单位s
**no-cache** 不是 不缓存 而是要 每次 问服务器能否读取缓存
**no-store** 表示是禁止缓存的意思

**must-revalidate**：和no-cache类似，每次要问服务器，能否读取缓存



#### `协商缓存`

**last-modified**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929175804724.png" alt="image-20220929175804724" style="zoom:50%;border: 1px solid black;" />



**if-modified-since**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929175903851.png" alt="image-20220929175903851" style="zoom:50%;border: 1px solid black;" />



**ETage**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929180021597.png" alt="image-20220929180021597" style="zoom:50%;border: 1px solid black;" />

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929180052986.png" alt="image-20220929180052986" style="zoom:50%;border: 1px solid black;" />

**ETage有强弱之分**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929180121174.png" alt="image-20220929180121174" style="zoom:50%;border: 1px solid black;" />



<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929180132415.png" alt="image-20220929180132415" style="zoom:50%;border: 1px solid black;" />









1. 概念：一个资源判定过期。**不是马上抛弃，还是拿着这个资源对应的一个标识去问问服务器，**这个资源有没有发生变化，如果没有发生变化，服务器会返回状态码304，不返回新的资源

为什么不返回新的资源？

​	**因为资源既然没有变化，就没有必要返回新的资源，不然就是浪费性能了**

2. 判断食品过期了嘛？如果没有过期，直接吃。

   如果过期了，不马上扔掉，而是问问专家，专家说没过期，还能吃，返回状态码**304**

   如果专家说，呀，过期了，我再给你发一个，就返回状态码**200**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929182100417.png" alt="image-20220929182100417" style="zoom:50%;" />





3. 浏览器和服务器是怎么判断

**Last-Modified/If-Modified-Since**

- 浏览器第一次请求资源，服务器响应，返回的数据的响应头，有**Last-Modified**,`Last-Modify: Thu,31 Dec 2037 23:59:59 GMT`

- 浏览器接受，下一次请求数据时，请求头携带，`If-Modified-Since`，

  之后，服务器的文件可能还是会发生修改，`Last-Modified`的时间可能还是发生变化

   如果时间和服务器实际最后修改的时间不一致，就判断过期了，返回新的资源，和状态码200

   如果没有过期，就返回状态码304，标识资源可以使用,不返回资源

- 因为是对比服务器资源的最后修改时间，和浏览器传递过来的时间，那么就不会有expires这样的问题。但是存在`精度问题`





**if-none-match和etag标识**

这里的逻辑和上面的一致，只是e-tag的**精度更高**。

如果if-None-Match和e-tag 与 if-Modified-Since和last-modified是同时存在的，**e-tag这组优先级更高**。工作中一般是配合使用的









### 总结

```
1 缓存：如果一个资源就缓存，就可以不用再次发请求，能够更省力和方便

2 缓存分为强缓存和协商缓存
  强缓存：客户端发请求时，携带标识，和服务器的对比。如果在缓存时间里面，就使用原有的缓存。如果不在，服务器会返回新的资源
  有expires和cach-control
  expires是绝对时间 如果客户端本地时间修改了 就会不准
  cach-control是相对时间，如果出现了混乱，就会以cache-control为准。拿客户端本地的时间和相对的时间
  
  
  
  协商缓存：
  强缓存不能使用 进入协商缓存
  发送http请求 服务器通过请求头中的last-modified-since【last—modified】 和 if-NONE-MATCH[e-tag]检查资源是否更新
如果更新 返回200状态码和资源
  如果没有更新。返回304，告诉浏览器直接从缓存中拿资源
```



整个流程

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929183056436.png" alt="image-20220929183056436" style="zoom:50%;" />

