# 1.HTTP协议

## 1.1 http缓存

#### 1.1.1 缓存的基本认知

为什么需要缓存？

```diff
 一个篮子里面，有苹果，去数，1 2 3 有三个苹果，数了有三个，我再问一次，你不需要再数不需要费力气了，直接说3.但是如果个数发生了变化，就要重新去数，然后再记住这个数字。
+ 一句话 - 能够更加省式省力
```

#### 1.1.2 缓存分类

`浏览器缓存`、服务器缓存[CDN缓存、代理服务器缓存]、数据库缓存

```diff
数据库缓存，浏览器 -> 请求给服务器 -> 服务器收到 去数据库查信息 -> 第一次查到了 -> 假设服务器拿到了，要进行处理, 服务器存住 -> 就给到了浏览器 -> 下一次客户端再发请求 -> 如果请求的内容一致，服务器不需要再次去数据库查了
```



#### 测试 

打开控制台，去浏览器删除缓存ctrl + F5,观察，第一次进入后再，第二次进入时，发现disk-cache，就是表明有些数据是从缓存里面读来的

>1. data:image 表示是base64的图片 是从css里面进来的
>2. webp是一种经过压缩的格式，流行的趋势，1MB -》 100kb, 能够直接把数据的体积降下来



#### 1.1.3 `强缓存`

**expires**

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

缓存的相对时间

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
expires: Fri, 01 Jan 2022 00:00:00 GMT ，表示这个时间点会过期
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



#### `1.1.4 协商缓存`

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



**if-none-match**







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









### 1.1.5 总结

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



## 1.2 HTTPS

###  1.2.1 什么是HTTPS+为什么需要

1.**安全性差：**HTTP传输，传输的报文都是明文的，很容易就被别人看到从传输的内容。

2.**认证：**无法确认，通信双方，服务器是真的服务器。客户端是真的客户端而不是黑客

3.**数据的完整性：**无法保证传输过程中的内容不会被篡改

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191233536.png" alt="image-20220929191233536" style="zoom:50%;border: 1px solid black;" />

**HTTPS**是超文本传输安全协议，采用http进行信息的传输，多了的这个S，就是**Secure**，就是SSL/TLS，对信息进行加密、身份验证、完整性验证的功能。【但是SSL是TLS的前身。绝大多数浏览器现在支持的都是TLS】
常见的加密算法：对称加密 非对称加密 hash算法



<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191247044.png" alt="image-20220929191247044" style="zoom:50%;border: 1px solid black;" />

数据 -> http -> 安全层SSL -> tcp -> ip -> 数据链路层

安全层，对上面来的数据进行加密，对返回的数据进行解密

### 1.2.2 TLS/SLS的工作原理

### 1.2.3  对称加密 DES

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191301118.png" alt="image-20220929191301118" style="zoom:50%;border: 1px solid black;" />

**概念：****加密和解密用的是同一个密钥**是一对一

**例子：**信息倒着念，这个暗号

**优点：**

1. 计算量小 

2. 加密速度快，加密效率高

**缺点：**

1. 有可能“倒着念”这个方法中间被黑客截获了 => 一开始传输密钥的过程

**应用：**
1 本地数据加密 https 网络通信

**常见的算法：**

1. AES DES 3DES DESX Blowfish、IDEA、RC4、RC5、
   **RC6(全球公开, 通过了层层筛选, 层层检验)  没有被破解**
2. 经过公开检验 才是算安全 很多公开的算法 虽然可以用撞库的方式破解，但是成本很高







### 1.2.4 非对称加密 RSA

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191318924.png" alt="image-20220929191318924" style="zoom:50%;border: 1px solid black;" />

**传统的TLS就是RSA来加解密的**

1. **概念：**
   有一对公钥和私钥。公钥是公开的，私钥是保密的。
   用私钥加密的数据，只有用对应公钥才能够解密 => **签名**
   用公钥加密的数据，只有私钥才能够解密 => **加密数据**
   我们可以把公钥公布出去，任何想要和我们通信的用户 都可以使用公钥加密，只有我们才能够用私钥解密

2. **优点：**安全
   **缺点：****加密速度慢** 只适合少量的数据，不然等待时间很长 跟非对称加密的算法有关系

3. 如果一开始 公钥被中间人拿到，他本来就可以拿到 他也有一对公钥和私钥，发送给客户端，
   客户端加密，中间人就可以用自己的私钥解密，再修改信息，用之前的公钥加密，发送给服务端

4 **场景：**
https会话前期
CA认证证书
信息加密
登录认证

5 **常见算法：**
RSA ECC(移动设备用) DSA(数字签名用)





### 1.2.5 hash算法

**MD5 SHA1 SHA256**

**概念：**根据一段内容 生成一段唯一的标识  用于验证数据是否被篡改，验证数据完整性
**特点：**
1 对输入非常的敏感
2 函数不可逆
3 输出的长度固定

### 1.2.6 数字证书+数字签名

一、对称加密不是完全安全 因为中间人可以截获对方发给我们的公钥，然后把自己的公钥发给我们。我们使用他的公钥加密信息，他能用自己的私钥解密。能够用同样的方法，去跟服务器进行沟通对话。

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929192255854.png" alt="image-20220929192255854" style="zoom:50%;" />

二、数字证书
是为了证明公钥是真实可靠权威的。
CA机构颁发数字证书，对你的网站的公钥、域名地址、证书到期时间加密，签发数字证书，保证网站的安全性。
当客户端收到消息，查看证书：

1. 看证书记载的网址，和现有的网址是否一致
2. CA机构是否权威可靠
3. 证书一旦过期，浏览器也会发出警告

三、如何防止证书被篡改
需要数字**签名和数字签名结合起来** => **能够根据数字签名的内容，生成一个唯一的标识**

服务端向CA认证中心，申请SSL证书。
这里是SSL证书，原因是因为他的名气是更大的。

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191418148.png" alt="image-20220929191418148" style="zoom:50%;border: 1px solid black;" />

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220930160134471.png" alt="image-20220930160134471" style="zoom:50%;" />



**安全版本**

1.服务器拿着公开密钥和其他信息，交给CA机构

2.2.用hash算法，把信息变成摘要1,用CA机构的私钥，对摘要1生成数字签名

3.签名后，把数字签名和服务器给的信息，**生成CA证书**，**并利用对称密钥，进行加密**，生成 加密后的信息

4.使用接收方的公钥，加密 **对称密钥**，生成数字信封

5.把加密后的信息和数字信封，都给浏览器

6.浏览器拿着自己的私钥，**解密“数字信封”**，得到对称密钥

7.浏览器利用对称密钥，去解密CA证书，拿到数字签名、摘要1、信息

8.把信息利用hash算法，生成摘要2，可以和上一步得来的摘要1进行对比，判断信息是否被篡改

9.得到的数字签名，可以用事先存储在浏览器的公钥，进行解密，得出结论，看看服务器的公钥是否是可信度的

10.如果是可信的，就拿着服务器的公钥加密信息，服务器用自己的私钥解密信息

![image-20220930161935320](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220930161935320.png)



### 1.2.7 **协议的握手总结**

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220930163154709.png" alt="image-20220930163154709" style="zoom:50%;" />

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191533489.png" alt="image-20220929191533489" style="zoom:50%;border: 1px solid black;" />

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191551385.png" alt="image-20220929191551385" style="zoom:50%;border: 1px solid black;" />

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20220929191608824.png" alt="image-20220929191608824" style="zoom:50%;border: 1px solid black;" />



### 总结：

```diff
1. 为什么需要https?
   因为http是明文传输+信息公开不安全
   https在http基础上, 基于SSL/TSL协议，对信息加密
2. https是如何保证安全
   用非对称算法 加密 对称加密的密钥
   用对称密钥进行后续的沟通
   
   为什么前面要使用非对称加密的算法?
     非对称加密安全 =》能够一定程度上保障私钥的安全
   为什么后续不能使用非对称加密的密钥?
     因为计算机网络传输 信息量很大 => 耗费资源 + 非对称加密算法很慢 + 大树幂 大数算法
3. 这样也不一定安全，为什么？
   因为 公钥也有可能被进行伪造，中间人接受到信息
4. 我们可以用CA机构办法的证书 证明公钥是正规的
   看到证书：1 证书上的域名和我访问的域名是否一致 2 证书是否在有效期 3 CA机构是否是权威的
   
5. 如果证书也被篡改了？
   需要数字签名
   原始信息+公钥 hash加密 =》摘要1
   CA用私钥加密摘要1 =》数字签名
   数字签名+原始信息 =》数字证书
   ----
   接受方拿到数字证书
   把原始信息 =》hash =》摘要2
   用CA公钥解密数字签名=》摘要1
   摘要1和摘要2进行比较
6. 
   
```





