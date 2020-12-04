---
title: Webpack 5.0 新特性
date: 2020-11-23
categories:
 - 前端
 - 工程化
tags:
 - webpack
---

# Webpack 5 新特性

webpack 5 中引入了 experiments 选项，以使用户能够激活和试用实验功能。

## topLevelAwait

顶级 Await Stage 3 提案：使模块能够充当大型异步函数。例如：

`ES2017`

``` js { 8 }
// lazy.js
let output;
async function main() {
  await import('./data');
  output = '🏮';
}
main();
export { output };
```

很遗憾，导出的 `output` 一直是 `undefined`。当然可以有其他的方式去实现这样的需求，比如 轮询，订阅状态等，但这并不是很优雅。

```js
import { output } from './lazy';
console.log(output); //undefined
```

在 webpack.config.js 中添加以下配置

```js { 4,6 }
module.exports = {
  experiments: {
    // import 导入异步模块，webpack会提示你打开这个属性
    importAsync: true,
    // 全靠它了topLevelAwait
    topLevelAwait: true,
  },
};
```

现在可以这么写

``` js
// import 导入异步模块
const myToy = await import('./toy');
```

甚至这样写

``` js
// lazy.js
const isLazy = async () => {
  const data = await Promise.resolve('ydeng');
  return data;
};

const result = await isLazy();
let output = `${result}🍊`;
export { output };
```
那么，在 import 的时候，就可以直接 await 获取 output 的值了。

```js
// index.js
import await { output } from './lazy';
```

这时候， webpack 会提示你添加 `importAwait` 这个属性。

``` js {6}
module.exports = {
  experiments: {
    importAsync: true,
    topLevelAwait: true,
    // 支持import await
    importAwait: true,
  },
};
```


## asset

原先处理图片、静态文件用的 file-loader 或 url-loader，现在直接在 loadder 规则下配置 type:'asset'，让 webpack 自动帮我们选择使用哪种方式构建：

``` js {3,8,12}
module.exports = {
    output: {
        assetModuleFilename: 'images/[name].[hash:5][ext]',
    },
    module: {
        rules: [{
          test: /\.(png|jpg|svg)$/,
          type: 'asset',
        }]
    },
    experiments: {
        asset: true,
    }
};
```

> 大型真香现场

## WebAssembly

``` c
//一段非常简单的 C, 把它编译成 program.wasm
int add (int x, int y) {
  return x + y;
}
```

webpack4 只能用 import('./program.wasm')去加载 program.wasm，然后在 then 里去操作 add 方法。如果同步去加载会报错，不能把 wasm 当成主chunk。

但 webpack 5 可以，只需要添加以下配置

``` js { 3,4 }
module.exports = {
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  }
};
```

``` js
import { add } from './program.wasm';
console.log(add(4, 6));
```

同样对 [mJS](https://github.com/cesanta/mjs) 也是支持的

> mJS 是ES6的子集，为了 Microcontrollers 而设计的。体积小，与 C/C++ 互操作性简单。

``` js { 3 }
module.exports = {
  experiments: {
     mjs: true
  }
};
```
## outputModule

这个属性在编写类库的时候会经常使用，来生成的代码的模块标准。允许将 JS 文件输出为模块类型，但需要多项目属性配置共同配合生效。

``` js { 10 }
module.exports = {
    output:{
        module: true,
        iife: false, // 取消 iife 包裹代码
        libraryTarget: 'module',
        // scriptType 属性会在 module:true 时，默认为 'module'，所以可以不设置
        scriptType: 'module' 
    },
    experiments: {
        outputModule: true
    }
};
```

当配置完成后，webpack 将会丢掉了闭包，把自己变成了一个 module。



