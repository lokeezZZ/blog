
# git 规范
## 背景

后端之前一段时间`git`版本时间轴混乱，多人提测的版本互相覆盖。因此导致测试组在测试时，重复打开历史`bug`，进而重复排查`bug`，效率极低。有些时候，前端在项目中参与人数1-2人，所以没有这么明显。如果人数多的话，问题必然会出现。**这次统一下规范，避免后续出现此类问题。**

### 开发者注意：

1. 新需要接入开始需要从`master`中创建自己的分支，并遵循`git 分支命名规范`;
2. 非必要的情况下，每个人都应该单独新建一个分支进行开发；
3. 非永久性变动的情况下，不可提交配置文件，如生产环境配置、打包配置；
4. 用 `git add`添加文件失误时，应使用`git reset HEAD {文件路径}` 撤销操作;
5. 用 `git commit`提交文件失误时，应使用`git reset --soft HEAD~1`撤销操作；
6. 每次提交、合并、上线前，都应查看自己修改的部分是否正确无误，建议使用 vs code diff 一下文件；
7. 提测时，应新建一个`test`分支，用来修复或发布版本；
8. 上线前将 `master`中的代码合并到当前分支；
9. 上线后，产品体验结束即时在`master`中合并已上线的分支；
10. 已在`master`中合并的分支应删除，大版本需要打`tag`，并在`wiki`中添加相应的描述说明，简要说明当前版本的需求和一些注意事项；

`git代码示例`
``` ruby
> git checkout master
> git branch dev_200709_daojia_5.6.1_lzt
> git add ./demo.js
> git reset HEAD ./demo.js
> git commit -m '提交一个demo'
> git reset --soft HEAD~1
> git push origin dev_200709_daojia_5.6.1_lzt
```

## 命名规则

### git 分支命名规则

> 标准开发流程的分支名

`dev_{开始日期}_{版本描述}_{版本号}_{负责人名字拼音}`

1.  开始日期：年份末两位+月份+日期
2.  版本号为当前需求的版本号
（下同）

`例`  
dev_200428_wxpay_3.2_lzt  
dev_200428_alipay_2.1_lzt

>  转测或免测流程的分支名

`test_{提测日期}_{版本描述}_{版本号}_{负责人名字拼音}`

`例`  
test_200430_textChange_3.1_lzt  
test_200430_styleFix_3.2_lzt

>  Bug修复流程

`bug_{开始日期}_{bug类型}_{版本号}_{负责人名字拼音}`

`例`  
bug_200428_wxpayBug_3.2_lzt  
bug_200428_alipayBug_3.2_lzt

### 文件夹/文件名命名规则

1. 尽量使用单词命名，建议使用`codelf`或百度翻译等工具；
2. 多词义的单词间使用 `-` 连接单词而不是使用驼峰，如 `user-vip-list` `user-index.tsx`;

### 文件修改规范

1. 创建文件时，应添加以下头信息：

``` js
/** 
 * author: 吕梓添 1号
 * create: 2020-07-07
 * info: 这个页面有很多让你惊喜的bug
*/
console.log(`hey`)
```
2. 修改文件时，应修改或添加以下头信息:
``` js
/** 
 * author: 吕梓添 1号
 * create: 2020-07-07
 * info: 这个页面有很多让你惊喜的bug
 * 
 * last modify: 2020-07-09
 * by: 吕梓添 2号
 * info: bug守护着你
*/
console.log(`hey,guys`)
```

### 变量命名规则

1. 代码中的变量名应使用驼峰，声明`class`时应首字母大写；
2. 全局环境声明常量时所有字母大写，并注释其意义；

### less/sass/css 规则

1. 样式命名规则使用 `BEM` 命名规范（参考下面的 `BEM` 命名规范）； 
2. 样式嵌套层级不能超过3层，当前根下所有层级代码不超过10行；
3. 非必要情况下，公共组件内样式不使用 `scope` 作用域；
4. 页面内需要修改全局样式时，应写备注，并在对应的页面层级下修改；
5. 分层`z-index`最高层级设置不超过999；
6. 应使用三层结构设计分层：`z-index<9`背景层、`z-index<19`视觉层、`z-index<29`前置层

### BEM 样式命名规范

`Bem` 是块（block）、元素（element）、修饰符（modifier）的简写，由 `Yandex` 团队提出的一种前端 `CSS` 命名方法论。

1. 每个块的命名应使用驼峰如 `.userVipListPage`;
2. 根级页面的样式名加上自己的姓名前缀如 `.lzt_userVipListPage`;
3. 使用 `-` 中划线连接子元素如 `.userVipListPage-title`;
4. 使用 `__` 双下划线连接孙元素如 `.userVipListPage-title__h2`;
5. 修饰元素的状态时，可使用层级来实现，如 ` .userVipListPage-title{ .active{} } `;

`示例`
``` html
<template>
  <div class="lzt_userVipListPage">
    <div class="userVipListPage-title active">
      <div class="userVipListPage-title__h2 disabled"></div>
    </div>
  </div>
</template>
```

``` html
<style lang="less">
.lzt_userVipListPage{}

.userVipListPage-title{
  &.active{}
}

.userVipListPage-title__h2{
  &.disabled{}
}
</style>
```


### js代码规范如if/else


### 变量声明/取值规范;
### 函数声明/调用规范；
### 缓存规范；
### 全局环境使用规范；
