---
title: 你应该知道的HTML和CSS
date: 2019-05-16
categories:
 - 前端
tags:
 - 基础
---

# 你应该知道的HTML和CSS

## HTML

### 前端跨域的几种方案


::: tip 什么是同源策略？
协议相同、域名相同、端口相同
:::

什么是跨域？

> 跨域是指出于浏览器安全的同源策略限制，非同源策略下不能访问数据

- 协议不同源 `http` 和 `https` 不同源； 
- 域名不同源 一级域名 `www.a.com` 和二级域名 `img.a.com` 不同源；
- 端口不同源 `80` 和 `8081` 不同源；


当浏览器执行一个脚本的时候会检查是否同源，只有同源的脚本才会被执行。现在所有支持 JavaScript 的浏览器都会使用这个策略保证用户信息安全，防止其他网站窃取数据。

同源策略限制（无法读取/请求）
- Cookie
- LocalStorage
- IndexDB
- Dom
- Ajax （除了 get 请求）

不受同源策略限制 （解决方案）
- `<form>` 表单 action 提交
- `<img>` `<script>` `<link>` 的文件请求
- css 中的 background 
- `<iframe>` 的链接请求
- PostMessage 和 document.domain = a.com (必须是相同的一级域名)
- Jsonp
- web  Socket

`<img>` 是一个神奇的标签。除了跨域，还可以用来网络测速测试网速，根据网速给出一些网速慢的解决方案。把 javascript 转成 base64 压缩进图片，进行跨域。

``` js
//测速示例
var speed = new Image();
var st = Date.now();
speed.src= "s.gif"; //s.gif => size:1kb
speed.onload=function(){
    var end = Date.now();
    var t = end - st;
    var v = 1/t; // kb/s
}
```

## 语义化

语义化对 seo 友好，不仅方便搜索引擎爬虫、客户端更好的解析内容，也为了视听用户更方便的阅读和使用。使用 `<div>` 进行布局， `<div>` 本身没有任何语义，就只是一个容器而已。
- 用 `<p>`  对特殊终端兼容有利
- 用 css 代替 纯样式的标签  `<b>` `<font>` `<i>`
- 用 `<table>` 时应该是标准格式，表头和单元格区分开 
- 使用 `<input>` 时需要用 `<label>` 说明文本，并通过 for="input-id"来关联
- 使用 `<h1> <h2> <h3> ... <dd> <dt> <article> <section> <aside> ` 等语义化标签 
- 提高 `<div>` 使用效率 , 使用 伪元素/ border/ shadow 代替空白Dom

## CSS布局

### 早期的布局

- 双飞翼布局/圣杯布局（兼容早期IE、html:xt文档类型）、box-flex、-webkit-box;
- 目前的布局: flex布局、grid-layout 布局

### 盒子模型 (box)

css布局的基本单位，一个页面是由很多个box组成。元素的类型和display属性，决定box的类型。Formattion context是w3c css2.1规范中的一个概念，是页面的渲染规，决定子元素的位置、元素间的关系和相互作用。

::: tip 最常见的有Block
Fomattion context (BFC)和 Inline Formatting context(IFC)。
:::

#### BFC

Block Fomattion context 规定根元素(html)、float元素、position:absolute|fixed、display:inline-block|table-cell|table-caption|flex|inline-flex、overflow不为visible的元素，会生成BFC。

同个BFC之间，margin会先择较大的值重叠；但每个BFC之间互相独立不重叠，以及同个BFC的高度包括了子元素的高度，如内部有float:left的子元素box，也参与计算；

#### IFC

Inline Formatting Context直译为"内联格式化上下文"，IFC的line box(线框)高度由其包含行内元素中最高的实际高度计算而来(不 受到竖直方向的padding/margin影响)

#### FFC
Flex Formatting Context直译为"自适应格式化上下文"，display值 为flex或者inline-flex的元素将会生成自适应容器(flex container)

#### GFC 

GridLayout Formatting Context直译为"网格布局格式化上下文"， 当为一个元素设置display值为grid的时候，此元素将会获得一个独立 的渲染区域，我们可以通过在网格容器(grid container)上定义网格 定义行(grid definition rows)和网格定义列(grid definition columns) 属性各在网格项目(grid item)上定义网格行(grid row)和网格列 (grid columns)为每一个网格项目(grid item)定义位置和空间。

### CSS 分层 

#### 什么是分层？（OO CSS 面向对象）
结构、皮肤、容器、内容相互分离

#### 为什么要分层？
为了加强代码复用和维护，减少CSS体积，提升渲染效果，即组件库思想：共用性、扩展性。开发时面向对象，抽象化重用的元素，保持独立性，不依赖。并且不要直接定义子节点，扩展对象时只增加class，不修改原有class。尽量避免使用ID选择器 (权重高无法重用)，保证选择器相同的权重。

### 面向对象思想
#### SMACss
一种OOCss, 分五个层次来划分css带来结构化的方法，用 - 连接单词，  -- 代表修饰符， _ _  代表子模块。
- base: 设置标签元素的预设值 如：`html{ } ` `input[type=text]{}`
- layout：整个网站大架构的外观 如：.header{ margin:30px; }
- module：应用在不同页面的公用模块 如：.button{  }
- state：定义元素的不同状态 如：.nav--main{ .active{ } }
- theme：定义所有主视觉 如： border-color    background-color 
#### BEM
一种命名方式，一个简单的命名更容易促进团队协作。用 - 连接单词， _ 代表修饰符， _ _ 代表子模块。
- .block 代表高级别的抽象组件
- .block__element 代表 .block 的后代
- .block_modifier 代表 .block 的不同状态或版本
#### SUIT
起源于 BEM ，使用驼峰式和连字符命名，来区分修饰符和子模块。用 - 连接单词， -- 代表修饰符， _ _ 代表子模块。 如 `.ProductDetail`  `.ProductDetail-title--sale`

#### ACSS
使用原子和分子的概念，原子是一个区块的最基本特质，如表单按钮或输入框。分子是原子的组合物，如表单等。生物是分子的组合物，如网页的标题导航。模版则是生物的结合体。
``` css
.m-10{ margin: 10px;} 
.p-10{ padding:10px;}
```

#### ITCSS

ITCSS是SMAcss的重大革新，以下是分层概念：

- Settings 全局可用配置，设置开关 ( 全局变量 $color-ui:#fff;)
- Tools 通用工具 （函数 @mixin font-color(){} ）
- Generic 通用基础样式  
- Base 未归类的HTML元素 如 ul li 
- Object 设计一些专用类 
- Componets 业务需求用组件, 通过include，然后再重写部分样式
- Trumps 重写，只影响部分样式

#### 工具

- resetcss
- 重置所有的样式为0
- normalize.css
- 增加和补充，但只对body
- NeatCss 结合了 resetcss 和 normalize , 但不追求全部重置为0, 比较推荐
- hint.css
- 后处理器: autoprefixer 是自动兼容所有的浏览器，补充前缀，可以在node下使用（依赖于postcss）也可以直接在开发时使用。

## GPU硬件加速

### 什么是硬件加速（GPU加速）
由于 GPU 计算单元多，吞吐量大，所以处理显示相关的操作会快于 CPU，当 Cpu 传输 BitMap(位图) 到 GPU ，GPU能快速对其进行偏移、缩放、旋转、透明度等操作，称为硬件加速。于是有一种元素操作：当修改 Layers 时，从 compoite Layers 将 Texture 直接传输到 GPU ，跳过 Layout和 Paint 阶段 , 即由 GPU 直接参与。

但不是所有的元素都能直接触发，Layers 有一个标准：
- 拥有 transform 样式属性
- 使用 animation / transition 实现 opacity、transform 的动画
- video
- canvas
- Flash
- 使用 css filter
- z-index 大于某个相邻节点

[高性能动画](http://jankfree.org/)

### 浏览器加载Html时发生了什么

- 解析 Dom 树和 Css 树，生成渲染树 (Render Tree)，对应 Performance - Rendering - - Recalculate Style  
- layout :记录 Dom 元素结构排列位置等，对应 Performance - Rendering - Layout
- paint 绘制样式等，对应 Performance - Rendering - Paint
- composite layers 将 BitMap 传输到 GPU，再输出到屏幕， 对应 Performance - 
Rendering - Composite Layers

### 哪些属性和操作是否会触发重排

改变width 、height、margin等，与大小、位置相关的读取和操作，使用 requestAnimationFrame 将元素操作延迟到下一帧（相关库：fastdom.js）
参考：https//csstriggers.com/

### 哪些会触发重绘

- 触发重排，重排一定会重绘
- 修改颜色，阴影等
- git 图即使不可见也会触发重绘
- 绘制 Layers 相同，比如和轮播图相同的 Layers

## CSS矩阵

在数学中，矩阵(Matrix)是一个 按照长方阵列排列的复数或实数集合， 最早来自于方程组的系数及常数所构成 的方阵。计算机中的矩阵运算，是数值分析领域的重要问题，也有三维动画制作中使用。
由 m x n 个数组成的m行n列数组称为 m 行 n 列矩阵， 其中 m x n 个数称为矩阵的元素，简称元。

矩阵乘法：矩阵第m行与第n列交叉位置的那个值，等于第一个矩阵第m行与第二个矩阵第n 列，对应位置的每个值的乘积之和。

线性代数是向量计算的基础，很多重要的数学模型都要用到向量计算。矩阵的本质就是线性方程式，两者是一一对应关系。如果从线性方程式的角度，理解矩阵乘法就毫无难度。

## CSS 3D 应用 (h5doo)


### 3D基础

- 调整视距：-webkit-perspective: 100px;
- 视距方向：-webkit-perspective-origin: center;
- 转换为3D视觉效果：-webkit-transform-style:preserve-3d;
- 3D旋转的中心点：-webkit-transform-orgin:80px 80px 0;
- 3D库: css3d-engine

### 3D世界
- 加速度计 G-sensor
- 检测轴向的线性动作，但无法构建完整的3D动作
- 陀螺仪
- 角度传感器，用来测量偏转、倾斜的转动角速度，获取转动的动作（摇一摇）

### 相关API

deviceorientation 设备的物理方向信息，表示为⼀系列本地坐标系的旋转⻆度。
- alpha：围着Z轴转动的角度(0˚ ~ 360˚)；
- beta：围着X轴转动的角度(-180˚ ~ 180˚)；
- gamma：围着Y轴转动的角度(-90˚ ~ 90˚)；

``` js
window.addEventListener("deviceorientation", function(event){
// 获取event.alpha/beta/gamma的值。
}, true);
```

devicemotion  提供设备的加速信息。（重力加速度：g=9.80665 m/s²）

``` js
window.addEventListener("devicemotion", function(event) {
// event.acceleration  设备在(x,y,z)⽅方向上的加速度
// event.accelerationIncludingGravity  在(x,y,z)的加速度上增加了重力加速度
// event.rotationRate  设备绕x,y,z轴旋转的⻆度
}, true);
```

compassneedscalibration ⽤于通知Web站点使用罗盘信息校准上述事件
``` js
window.addEventListener("compassneedscalibration", function(event) {
    console.log("罗盘需要校准");
    event.preventDefault();
}, true);
```

示例

``` js
//摇一摇
var speed = 30;//speed
var x = y = z = lastX = lastY = lastZ = 0; 
function deviceMotionHandler(event) {
    var acceleration = event.accelerationIncludingGravity; 
    var x = acceleration.x,
        y = acceleration.y,
        z = acceleration.z;
        if( Math.abs(x-lastX) > speed 
        || Math.abs(y-lastY) > speed 
        || Math.abs(z-lastZ) > speed) {
            //简单的摇一摇触发代码
            alert(1); 
       }
}
```

### 如何构建3D模型


先将图片切成 n 份，图片的宽度为 L，然后旋转一定角度 ∂，再向外推出一定的距离 r , 构成一个球体或立方体。
- 角度：∂ = 2π / n 
- 半径：r  = L ÷ tan( π/n ); 

### 构成一个球体或立方体

- 球面投影：每个3D模型都等同于一个多面体(即 3D 模型只能由2D平面组成)。只能以一个正多边形表示圆:  边越多，圆就越“完美”。
- 立方体投影：把图片切成6个面，再重新拼成一个立方体。

## CSS 妙用小技巧

CSS 图标

- [CSS icon](http://cssicon.space/#): 比svg绘制还快 
- [阿里 icon font](https://www.iconfont.cn)

图片裁剪

``` css
.clip-path-img{ clip-path:( 50% 0,100% 50%, 50% 100%, 0 50% )}
.clip-path-img:hover{ clip-path:( 0 0,100% 0,100% 100%, 0 100% )}
``` 

将背景裁剪到文字
``` css
.clip-path-text{ 
    background-clip: text; 
    text-fill-color: transparent;
}
```

色相调度

``` css
.hue-rotate{
    fiter: hue-rotate( 360deg );
}
```
可拖动Div
``` css
.resize-bar { resize:horizontal }
.resize-bar :: --webkit-scrollbar { }
```

更改滚动条样式
``` css
html :: -webkit-scrollbar { width:10px; height: 10px;}
html :: -webkit-scrollbar-thumb { background: blue }
html :: -webkit-scroller-track { background: red }
```
遮罩

``` css
-webkit-mask-image:url( './img.png' )
```

混合模式 `mix-blend-mode: hue;`

背景混合模式+滤镱

``` css 
.mix-blend-mode{
    background-blend-mode: darken;
    filter:brightness( 80%) grayscale(20%) contrast(1.2);
}
```
滚动临界点

``` css
.container{ width:400px; margin: auto;  overflow-x:auto; overflow-y: hidden; scroll-snap-align: x mandatory; }
.container img{ scroll-snap-align: start }
```

边界形状 `shap-outside: polygon( 0%, 20%);`

响应式
- vw fr 单位
- repeat() 
- minimax()
- auto-fill / auto-fit
- grid-auto-flow
- max-content / min-content

<!-- 
课外
文件夹命名使用全小写或者是全大写，linux 系统区分字母大小写
使用清爽的字体包Comic Sans MS和主题包material-theme
Css Houdini ( js in css) : Css.paintWorklet.addModule
Css Next -->
