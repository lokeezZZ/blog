---
title: Webpack 5.0 配置篇
date: 2020-11-27
categories:
 - 前端
 - 工程化
tags:
 - webpack
---

# Webpack 5.0 配置篇

## 生命周期

webpack 运行流程是一个串行的过程，从启动到结束会依次执行：
- **初始化参数** 从配置文件中和 shell 语句读取与合并参数，得到最终参数

## 目录说明

```
├── components                  React 组件目录
├── config                      环境配置
├── dist                        打包后的输出目录
├── scripts                     npm 启动脚本
│   ├── server
│   └── client
├── src                         源代码
│   ├── server
│   └── web
├── typings
├── package.json                npm 配置文件
├── tsconfig.json               TypeScript 配置文件
└── webpack.config.js           webpack 配置文件总入口
```

## 安装依赖

`webpack 5` 启动服务的还是依赖于 `webpack-dev-server`，只是对应的启动命令有所改变，所以还是要安装以下 4件套：

``` shell
npm install --save-dev webpack webpack-dev-server webpack-cli webpack-merge
```

## 入口 entry

`entry` 是应用程序，或者说一个页面的起点入口，如果传递一个数组，那么数组的每一项都会执行，并且一个html页面对应一个入口。

* 如果 `entry` 的值是一个字符串，那么打包之后的 `chunk` 名即为默认的 `main`。
* 如果 `entry` 的值是一个对象，则每个 `key` 都会是 `chunk` 的名字，每个 `key` 对应的值都是入口起点。

首先，在 `src/web` 目录下新建一个 `index.tsx` 文件，在 `config` 目录下新建 `webpack.development.js` 和 `webpack.production.js` 2个文件。于是最原始的 `webpack.config.js` 应该是这样的：

``` js
const { resolve } = require('path');
const { merge } = require('webpack-merge');
const baseConfig = {
    entry: {
        app: resolve(__dirname, './src/web/index.tsx'),
    }
}
module.exports  = merge(envConfig, baseConfig)
```

你会注意到 `envConfig` 还没有声明。是的，此时需要从 `webpack` 启动参数中，获取对应环境的配置文件。这里需要借助 `yargs-parser` 这个库，来帮我们格式化参数:

``` js
const yargs = require('yargs-parser');
// 获取 webpack serve --mode development 中的 development
const mode = yargs(process.argv.slice(2)).mode;
const envConfig = require(`./config/webpack.${mode}.js`);
```

这样，我们就能拿到相应的文件 `./config/webpack.development.js`，关于这个 `mode` 变量的值是什么，后续可以自行通过控制台打印查看。

## 输出 output

output 的值必须为一个对象，以下是参数说明：
 * path: webpack 打包之后输出文件的路径，为空时，则默认打包到 `dist` 目录下；
 * assetModuleFilename: 决定了每个输出的 `bundle` 的名称，即打包后的文件名字，并写入到指定的目录下；在 webpack 4 中只能用 filename。
 * publicPath: 配置 `html` 中引用的静态资源的目录

在 `webpack.config.js` 中的 `baseConfig` 添加以下内容：

``` js
output: {
    path: join(__dirname, './dist/assets/'),
    publicPath: '/assets/',
    assetModuleFilename: 'images/[name][ext]',
    filename: 'js/[name].bundule.js',
}
```

注意，在生产环境下的文件应该配置 hash，否则所有文件会被浏览器强缓。

``` js
// filename: 'js/[name].[contenthash:5].bundule.js',
assetModuleFilename: 'js/[name].[contenthash:5].bundule[ext]',
```

一个比较难理解的配置：`publicPath`，在多数情况下，此选项的值为 `'/'`。它并不会对打包文件后存放的目录结构造成影响，只是对生成的 html 中应用的静态资源，比如：图片、css、js 文件的引用路径做对应的补充。

对于按需加载或者加载外部资源来说，如果 `publicPath` 设置错误，加载资源会返回 `404`。

## 模块加载器 loader

`loader` 可以说是各种模块的转换器，可以用来解析、打包、预处理文件，在 `webpack` 中，万物皆模块。最常用的就是 `babel-loader` 等等，需要在 `module` 中通过 `rules` 正则匹配规则来使用。

在 `webpack.config.js` 中的 `baseConfig` 添加以下内容：

```js
module: {
    rules: [{
      test: /\.(ts|js|tsx)$/,
      use: 'babel-loader'
    },
    {
      test: /\.(png|jpg|jpeg|gif|eot|woff|woff2|ttf|svg|otf)$/,
      type: 'asset',
    }]
},
experiments: {
    asset: true,
}
```

这里我们要用到 `webpack 5` 一个实验性特性 `asset`，并通过 `experiments` 开启，否则不会生效。

> 以下内容来自 webpack 中文网

在 webpack 5 之前，通常使用：

- raw-loader 将文件导入为字符串
- url-loader 将文件作为 data URI 内联到 bundle 中
- file-loader 将文件发送到输出目录

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

- asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
- asset/inline   导出一个资源的 data URI。之前通过使用 url-loader 实现。
- asset/source   导出资源的源代码。之前通过使用 raw-loader 实现。
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。

> [摘自 webpack 中文网](https://webpack.docschina.org/guides/asset-modules/)

以前用 webpack 4 是通过 url-loader 来处理图片。也就是对于 10k 以内的图片都转换成 base64 ，以此减少 http 请求数量。如果大于 10k 就没有必要了，因为base64 转换后的文件大小增加了33%。

> Base64 采用64个基本的 ASCII 码字符对数据重新编码。它将数据转换成二进制字节数组，3个字节为一组(8位/组)，再重新分为 4组(6位/组)。在每组最高位补足两个0重新凑成一个字节(8位/组)，最后一组不足3个字节的补充1~2个0字节，并用 "=" 做标记。


## 插件 plugins

plugins 用于自定义webpack的构建过程, 比如自定义打包之后的html模板，自定义js和样式文件是否打包等等。

在 `webpack 4` 中取消了四个常用的用于性能优化的 `pluginUglifyjs`，`CommonsChunk`，`ModuleConcatenation`，`NoEmitOnErrors`
转而提供了一个名为 `optimization` 的配置项，用于替代以上四个插件。并不是说以上插件不能使用了，只是 `webpack 4` 本身有替代的方案，可以不用插件。

**注意**: 在 `confing/webpack.development.js` 中的添加以下内容，同时在 `src/web/index-dev.html` 创建一个空的 html 模板页。

``` js
module.exports = {
  plugins:[{
    new htmlWebpackPlugin({
        title: 'Demo',
        template: path.resolve(__dirname, '../src', './web/index-dev.html'),
        filename: "index.html",
        inject: true
    })
  }]
}
```

## devServer

这个选项主要配置开发时的 hot reload，在 webpack 5 中把 `webpack-dev-server` 集成了，所以启动命令改成了 `webpack serve`。dev-server 实际上是一个 Http 服务器，可以做静态资源的访问和代理。wbpack 构建输出 bundle 到内存，然后 Http 服务从内存中读取文件，并且监听文件变化。

**注意**: 在 `confing/webpack.development.js` 中的添加以下内容：

``` js
devServer: {
    contentBase: "./", // 指定本地服务器搭建页面的位置
    host: "127.0.0.1",
    port: "8089", // 默认为 8080, 可能与 Tomcat 冲突
    https: false,
    stats: "errors-only",
    hot: true,  // 启用热更新
    open: false, // 自动打开浏览器
    quiet: true,  // 移除打包时在控制输出细节
    disableHostCheck: true,
    historyApiFallback: true, // 当 SPA 应用的路由使用 History 模式时，把 404 指向 index.html
    inline: true, //改动后是否自动刷新
    proxy: { // 代理服务
        "/api": {
            target: "127.0.0.1:8080",
            pathRewrite: {},
            changeOrigin: true,
            secure: false
        }
    }
}
```

通常为了避免 webpack 大量的文本输出，所以设置了 `quiet:true`。然后通过 friendly-errors-webpack-plugin 来美化控制台输出的内容，以及在打包后自定义输出显示的内容等等。

## 优化 optimization

这个选项也是wepack4新增的，主要用来自定义一些优化打包的策略

### minimizer

在 production 模式下，该配置会默认为我们压缩混淆代码，但配置项过于少导致无法满足我们对于优化代码的诉求，下面是一套比较灵活的优化配置。

**注意**: 应该在 `confing/webpack.production.js` 中的添加以下内容：

```js
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  optimization: {
    minimizer: [
      // 自定义js优化配置，将会覆盖默认配置
      new UglifyJsPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"文件，没必要进行二次压缩
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: false, // 移除注释
        uglifyOptions: {
          compress: {
            unused: true,  // 移除未使用的代码
            warnings: false,  // 警告
            drop_debugger: true  // 移除 debugger
          },
          output: {
            comments: false
          }
        }
      }),
      // 用于优化css文件
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true }, //这里注意下!!!!!
          mergeLonghand: false,
          discardComments: {
            removeAll: true // 移除注释
          }
        },
        canPrint: true
      })
    ]
  }
}
```
* UglifyJsPlugin: 是大家经常使用的插件，这里比较亮的地方是可以过滤本身已经压缩的js，可以提升打包速度，并且避免二次混淆压缩造成的未知bug
* OptimizeCssAssetsPlugin: 用来优化 `css` 文件的输出，优化策略包括：摈弃重复的样式定义、砍掉样式规则中多余的参数、移除不需要的浏览器前缀等
* 这里注意插件的参数 `autoprefixer: { disable: true }` ，一定要指定为 `true` 。否则的话该插件会把我们用 `autoprefix` 加好的前缀都移除掉

### runtimeChunk

分离出webpack编译出来的运行时代码，也就是我们之前成为manifest的代码块，方便我们做文件的持久缓存

这个参数项（runtimeChunk）有多种类型的值，其中:
* `single` 即将所有的chunk的运行时代码打包到一个文件中
* `multiple` 即针对每个chunk的运行时代码分别打包出一个runtime文件

**注意**: 应该在 `confing/webpack.production.js` 中的添加以下内容

``` js
var { resolve } = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  optimization: {
    runtimeChunk: 'single'
    // 等价于
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  plugins: [
     new HtmlWebpackPlugin({
       template: resolve(__dirname, '../src', './web/index-prod.html'),
       filename: "index.html",
       inject: true
     })
  ]
}
```

### splitChunks

webpack4 移除了 CommonsChunkPlugin 插件，取而代之的是 splitChunks。比较优雅的离打包配置如下：

``` js
splitChunks: {
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      minSize: 30000,
      minChunks: 1,
      chunks: 'initial',
      priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
    },
    commons: {
      test: /[\\/]src[\\/]common[\\/]/,  // 单独抽出公共代码
      name: 'commons',
      minSize: 30000,
      minChunks: 3,
      chunks: 'initial',
      priority: -1,
      reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
    }
  }
}
```

这段配置，首先是将 `node_modules` 中的模块统一打包成 `vendors.js`, 它限制了分离文件的最小体积为 30k（压缩之前）。因为小于30k的代码分离出来，额外消耗一次 http 请求的成本太高。这个值是 webpack 通过大量的数据总结出来的。

其次，还分离除了共享模块，比如 `src` 目录下有几个全局公用的 `js` 文件，可以单独抽出来打包成一个 `commons.js` 。由于这部分文件不经常改变，有利于持久缓存。



## 常用的 loaders

- babel-loader：编译 js、ts、tsx 等文件
- awesome-typescript-loader：编译 ts 文件
- css-loader：处理 @import 和 url 的资源
- style-loader：在 head 创建 style 标签和插入样式
- postcss-loader：扩展 css 语法，可使用 autoprefixer, css next, cssnano
- thread-loader：开启缓存和多实例构建
- eslint-loader：代码检查
- vue-loader：编译 .vue 文件
- cache-loader：将编译结果缓存到磁盘，对性能开销大的 loader 前添加
- image-webpack-loader：对图片进行压缩


## 常用的 plugins

- html-webpack-plugin: 通过new 该插件的实例，可以让 webpack 帮我们编译出一个 html 文件。需要注意的是，多页面的配置下，有多少个页面，就要 new 多少个实例，传入到 plugins 中。
- terser-webpack-plugin：开启 parallel 多线程并行压缩
- hard-source-webpack-plugin：开启构建缓存, webpack 5 中不再使用
- mini-css-extract-plugin：提取 Chunk 中的 CSS 代码到单独文件
- optimize-css-assets-webpack-plugin：对 CSS 文件开启 cssnano 压缩
- compression-webpack-plugin：采用 gzip 压缩 js 和 css
- purgecss-webpack-plugin：对无用的代码进行 tree shaking，对 CommonJS 无效
- speed-measure-webpack-plugin：分析构建过程中的性能瓶颈
- webpack-bundle-analyzer：对 bundle 文件分析的工具，展示可交互缩放的 treemap 
- serviceworker-webpack-plugin：为网页应用添加离线缓存功能
- friendly-errors-webpack-plugin：控制台输出美化，通常只在 dev 使用
- progress-bar-webpack-plugin：显示构建进度条和百分比
- ignore-webpack-plugin：忽略文件
- clean-webpack-plugin：清理文件或目录
