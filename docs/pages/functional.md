---
title: 函数式编程
date: 2019-04-09
categories:
 - 前端
 - 编程
tags:
 - 基础
---

## 前言

函数式编程是一种编程思想，不只是用函数来编程，将复杂的函数转化成简单的、尽量写成一系列嵌套的函数调用, 因为 react redux 掀起热潮。纯函数没有副作用，对单元测试友好，不用考虑业务逻辑的影响，从而更有效的去开发。

## 定义

找出事物之间的关系、概念、对象等等抽象出一个范筹，通过箭头表示成员的关系，叫“态射”，是一种变形关系，这种变形关系通常用函数来表示；假设图中的小红点代表每个人，人与人之前因某种关系而聚在一起产生了某种关系，称为集合，每个人则是集合的成员。


## 基础理论

函数是”第一等公民”, 就是说和其他数据类型一样，可以赋值给变量，也做传参，或者作为返回值
引用透明，只定义常量即不可修改的变量，或者某个表达式，函数运行所用的值都只靠传参。

- 没有”副作用"，可靠的，不修改状态，不依赖外部的变量
- 传入的参数不会被修改，同一个参数只会得到相同的输出
- map && reduce 

示例：

``` js
//bad
var min =18;
var checkage = age=> age>min;
//good
var checkage = age=> age>18;
//better
var checkage = min =>(age=> age>min);
```

## 核心概念

### 纯函数 

对于固定的输入，输出总是固定的，不依赖外部环境的状态。可以降低系统的复杂度，以及可缓存性

### 偏应用函数、柯里化
传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。而柯里化是一种“预加载”，先传部分参数，得到一个新函数，对参数缓存。

``` js
function foo(p1,p2){
    this.val = p1+p2;
}
var bar = foo.bind(null, 'p1' );
var bar2 = new bar('p2'); // bar2.val: p1p2 
```

### 函数组合

解决函数(柯里化)嵌套问题
``` js
const compose = (f, g) => ( x => f(g(x)));
```

### Point Free  

将自带的方法(Array.push)转化成纯函数,不命名中间变量，保持简洁和通用

``` js
//bad
const split = str=> str.toUpperCase().split(' ');
//good
const toUpperCase = word=>word.toUpperCase();
const split = x=>(str=>str.split(x));
//use
const fn = compose(split(' '), toUpperCase);
```

### 惰性求值、惰性函数、惰性链

在需要时才进行求值，在变量第一次被使用时才进行计算

``` js
// bad
function foo(){
    if(bool) return foo2();
    else return foo3();
}
//good
function foo(){
    foo = bool? foo2():foo3();
}
```

### 高阶函数 

以函数作为参数，以函数作为返回结果，达到更高程度的抽象

### 容器、函子Functor 、IO、Monad

函子, 函数式编程里面最重要的数据类型，是基本的运算单位和功能单位。它是一种范畴，也是一个容 器，包含了值和变形关系。比较特殊的是，它的变形关系可以依次作用于每一个值，将当前容器变形成另一个容器

``` js
//函数式编程一般约定，函子有一个of方法,生成新的容器
Functor.of = x => new Functor(x);
//一般约定，函子的标志就是容器具有map方法。
//该方法将容器 里面的每一个值，映射到另一个容器。 
Functor.prototype.map = function(fun){
    return Container.of(fun(this.__value)) 
}
 // Maybe 函子
 class Maybe extends Functor {
     map(f) {
        return this.val ? Maybe.of(f(this.val)) : Maybe.of(null);
    } 
}
```

IO是惰性求值，包含的是被包裹的操作的返回值, 即“脏”的操作；


``` js
var IO = function(f) { this.__value = f; }
IO.of = x => new IO(x);
IO.prototype.map = function(f) { 
    return new IO(compose(f, this.__value)) 
};
```

Monad将一个运算过程，通过 函数拆解成互相连接的多个步骤,  避免了深度嵌套

``` js
class Monad extends Functor {
  join() {
    return this.val;
  }
  flatMap(f) {
    return this.map(f).join();
  } 
}
//monad().flatMap(first) .flatMap(second)
```

### 错误处理、Either、AP

`try/catch/throw` 并不是 “纯”的。使用 Either 函子处理异常代替 `try...catch`，或者条件运算 `if...else`。 Either 函子内部有两个值:左值(默认值)和右值(实际使用的值）

``` js
var Left = function(x) { this.__value = x;}
var Right = function(x) { this.__value = x; }
Left.of = function(x) { return new Left(x); }
Right.of = function(x) { return new Right(x); }
// 这里不同!!! 
Left.prototype.map = function(f) { return this; }
Right.prototype.map = function(f) { return Right.of(f(this.__value)); }
//Left 和 Right 唯一的区别就在于 map 方法的实现，
//Right.map 的行为和我们之前提到的 map 函数一样。
//但是 Left.map 就很不同了:它不会对容器做任何事情
//只是很简单地把这个容器拿进来又扔出去。 
//这个特性意味着，Left 可以用来传递一个错误消息。
```

## 尾调用优化

传统递归的方式，由于内存需要记录调用的堆栈深度和位置信息，在最底层返回计算的值，再根据记录的信息跳 回上一层计算，直到最外层的调用函数，当深度和位置过大会造成堆栈溢出。

``` js
//bad
function sum(n){
    if( n===1 ) return 1;
    else return n+sum(n-1);
}
//good
function sum(x,s){
    if( x===1)return x+s;
    else return sum(x-1,x+s);
}
```

函数内部的最后一个动作是函数调用，而不仅是最后一行。这个尾递归调用栈永远只更新当前栈，这样就能避免会爆栈的风险。但目前浏览器未支持，因为堆栈信息丢失，代码出错后很难维护，如果担心的话，不如改成while。

> 有些浏览器可以通过 #function、 !return 强制使用优化，但兼容性差。

## JS库

<!-- 调试、热部署、并发、单元测试 -->

- RxJS
- cycleJS 
- lodashJS
- lazy(惰性求值) 
- underscoreJS
- ramdajs

## 总结补充

只要记住『函数对于外部依赖会造成系统复杂性提高』以及 『让函数尽可能地纯净』。
『容器』 Maybe、Either、IO 这三个强大的 Functor，大多数人或许都没有机会在生产环境中去实现，但通过了 解它们的特性会让你产生对于函数式编程的意识。

> 函数式编程同样也不是万能的，它与烂大街的 OOP 一样，只是一种编程范式而已。

很多实际应用中是很难用函数式去表达的，选择 OOP 亦或是其它编程范式或许会更简单。
函数式编程就是通过纯函数以及它们的组合、柯里化、Functor 等技术来降低系统复 杂度，而 React、Rxjs、Cycle.js 正是这种理念的代言。