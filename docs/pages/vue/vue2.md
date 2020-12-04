---
title: Vue 2.x 使用
date: 2019-04-19
categories:
 - 前端
 - 响应式框架
tags:
 - 基础
 - Vue
---


## 简介

Vue.js不是一个框架，它提供一个MVVM风格的双向数据绑定的数据驱动组件，专注于UI层面，纯粹是为了现代化Web界面而生的库。可以使用 `vue-devtools` `vue-syntax-highlight`开发工具协助开发Vue。


## Vue2.0的新变化

- 体积更小，基于virtual-dom实现
- 可以使用 render
- 支持服务端渲染
- ready钩子替换成mounted , 新增 beforeMount beforeUpdate update等
- `<p ref="a"></p>` 通过this.$refs.a 取值

## directive指令
在正常学习中，有这样一段代码 `<h1 v-if="yes">show</h1>`， `v-` 是 vue 的标识， `if` 是 vue 的指令， `yes` 是表达式。通过 directive 可以自定义指令，传递一些参数实现复杂的指令，以下是directive 的一些钩子函数：
- bind: 监听绑定，在绑定之前触发，只执行一次
- inserted：监听插入，被绑定元素插入时调用，父节点存在，不必在document
- update: 监听获得的值对应的更新，对于初始值也会调用一次
- componentUpdated：被绑定元素所在模版完成一次更新周期时调用
- unbind：移除bind绑定的事件时触发

通过示例深入了解：

``` html
<div id="app"> <input v-focus> </div>
<script>
Vue.directive('focus',{
    inserted: el=>{
        el.focus();
    }
});
</script>
```

使用驼峰命名指令DemoDirective时，dom中对应的写法应该为 v-demo-directive。示例：

``` html
<div id="app" v-demo-directive:bgcolor="color">  </div>

<script>
Vue.directive('DemoDirective',{
  bind: function(el,binding,vnode){
     el.style.color= binding.value; //指定绑定的值，即color  
  }
})
new Vue({
    el:"#app",
    data:{ color:'red'}
})
</script>
```

以下是binding对象具体包含的哪些内容：
- name 指令名，不包括v-前缀，即 demo-directive
- value 指定绑定的值，即 color 对应的值 red
- oldvalue 前一个值,仅在update和componentUpdated中可用
- expression 绑定值的字符串形式, 即 "color"
- arg 	传给指令的参数，即 bgcolor
- modifiers 一个包含修饰符的对象

在使用时，还可以传一些表达式，如

``` html
<div id="app" v-demo="{ color:'white'}">  </div>
<script>
// 当Vue.directive传递第二个参数不是object时，默为监听bind；
Vue.directive('demo',function(el,binding,vnode){
     console.log(binding.value.color); // "white"
})
</script>
```


## Vue 生命周期

首先，看一段经典的代码

``` html
<div id="app"> 
    <input v-model="msg" type="text">  
    {{msg}} 
</div>

<script>
// 在Vue里使用一些钩子：
new Vue({
    el:"#app",
    data:{ msg:1 },
    created(){
        this.msg = 2;
    },
    mounted(){},
    updated(){},
    destoryed(){},
})
</script>
```

- created: 实例已经创建，但msg还未渲染到模版，渲染后msg为2;
- mounted: 已经挂载到模版上
- updated: 实例更新时触发，包括外部触发
- destoryed: 销毁时触发，可以使用自带的app.$destory()销毁

## 组件间通信


组件间通信主要有以下几种方式，可在不同的场景下使用:

- props 和 data
- inject 和 provide 
- EventBus
- Vuex

### 父子嵌套组件间的通信

以下是示例：
``` js
//子组件
Vue.component("child",{
    inject:["form"],//接收父组件的provide
    props:['message'], //接收父组件的data.message
    data(){
        return {
            msg1:this.message,
            msg2:this.form //接收 inject的数据
        }
    },
    template:`<div>
        我是子组件
        数据1{{msg1}}
        数据2{{msg2}}
        </div>`
});
// 再声明一个父节点
Vue.component("parent",{
    data(){
        return {
            message:'我是传递的数据1'
        }
    },
    provide:{
        from:'我是传递的数据2'
    },
    template:`<div>父节点 
    <child /> //通过provide传递
    <child :message="message" /> //通过data传递
    </div>`,
});

// 插入HTML代码：
<div id="app"></div>

// 注册Vue
new Vue({
    el:"#app",
    template:"<parent />"
})

```

### 同级组件间的通信

首先创建两个兄弟节点bro1和bro2 ，在bro1 里创建用来传递数据的函数passData，将参数传递到bro2 ，示例：

``` js
Vue.component("bro1",{
    data(){
        return {
            msg:'bro1'
        }
    },
    template:`<div>
        兄弟节点：{{msg}}
        <input v-model="msg" @input="passData(msg)" />
    </div>`,
    methods:{
        passData(val){
            bus.$emit("globalEvent",val);
        }
    }
});
Vue.component("bro2",{
    data(){
        return {
            msg:'bro2',
            bro1:'',
        }
    },mounted(){
        bus.$on("globalEvent",val=>{
            this.bro1=val;
        })
    },
    template:`<div>{{msg}} from bro1:{{bro1}}</div>`
});

// 这里需要一个中央总线bus，来承载数据
var bus = new Vue(); //中央总线
var app = new Vue({
    el:'#app',
    template:`<div><bro1 /><bro2 /></div>`
})
```

## 组件缓存 keepAlive 

*内容待完善*

### Vue全家桶

- vue-router 
- vuex 
- vue-cli 基于脚手架构建项目
- vue-loader 
- vue-server-renderer 服务端渲染
- vue-class-component 为TS 准备，提供的一些支持
- vue-rx 基于是angular核心概念，基于ovserver
- vue-devtools 	 开发工具，浏览器拓展工具




