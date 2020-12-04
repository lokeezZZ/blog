---
title: 微信 Api 踩坑之路
date: 2019-03-06
categories:
 - 前端
tags:
 - 第三方
 - 微信
publish: true
---
# 微信 Api 踩坑之路

## 微信授跳转

关于授权步骤和一些参数说明可以看下[微信官方文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)，写的很清楚了。

**这里需要注意的是：**

`hash` 模式下，微信授权回调后，将会在 `pathname` 后以及`hash`前添加`code`等参数，例如:`https://a.com/web/?code={code}#/html/page?query={query}`。包括微信分享时配置的`link`也一样。

因此，在`hash`模式下，`react`通过 `constructor`中的`props.location.query`将获取不到`code`。`history`无需担心此问题。

`代码示例`

``` js
const {code} = props.location.query; // code:undefined
```

## JSSDK使用步骤
1. 绑定域名

- 先登录微信公众平台进入`公众号设置`的`功能设置`里填写`JS接口安全域名`，**一定要先确认是不是加了域名，不然没有权限。**

2. 引入`SDK`文件
- 通过 `AMD/UMD` 方式引入的必须注意 `wx`这个不是全局下，所以最好生成一个`sdk.js`文件，抽离 `wx`下所有的`api`操作。

``` js
// 支持https
<script src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js" ></script>
// UMD 方式
import wx from 'weixin-js-sdk';
```

3. `ready` 之后操作`SDK`；
- `ready` 是异步，使用` promise `更佳；
- 没有在`ready`状态下调用`api`会提示无权限；
- 注意后端返回字段的大小写 如 `appId`  `nonceStr`；
- `wx.config` 在 `SPA` 里最好在全局`APP.JS`里做，如果是`MPA`就需要每个页面进入的时候调用。**无论哪种操作，都只执行一次`config`。**

**`wx.config`失败的解决方案**

- 调用后端接口传参时 `url`是当前页面并且完整，即**协议+路径+参数(?部分)，但不包括'#'hash后面的部分**；
- 签名算法需正确，可通过`http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign` 页面工具进行校验；
-  `appId`需一致；
- 参数大小写是否正确；
- 在`wx.config`完成后再操作URL重定向。

**以上都没问题就是后端问题**

`代码示例`

``` js
/**
 * 配置微信
 * @param {string} get_wx_config 接口返回的配置
 */
function wxConfig(wxConfig={},jsApiList=[]){
    const {appId,timestamp,noncestr,signature}=wxConfig;
    const config = {
        debug:false,    // 开启调试模式
        appId,        // 必填，公众号的唯一标识
        timestamp,    // 必填，生成签名的时间戳
        nonceStr,    // 必填，生成签名的随机串
        signature,    // 必填，签名，见附录1
        jsApiList    // 必填，需要使用的JS接口列表
    }
    wx.config(config);
    return new Promise((resolve,reject)=>{
        wx.ready(resolve);
        wx.error((err)=>reject(err.errMsg));
    })
} 

```

## 支付
- **必须先在后台配置支付目录**
- 如果支付目录带路由，通常配置到当前路径的上一级，如配置为 `域名/pay` ：`域名/pay/pay.html` 可发起支付，而`域名/pay2/pay.html`无法发起支付；
- 如果支付目录不带路由，微信不会校验全路径，只要在当前域名下的所有页面都可以发起支付；
- `wx.chooseWXPay`需要在`wx.config`成功之后才可以调起支付；
- `wx.invoke`无需使用`wx.config`即可调起支付，但需要微信浏览器 
 ready之后才可发起支付；
- `wx.chooseWXPay` 和 `wx.invoke`的参数名是一致的，并且都是`JSON`格式；
- 传参时需要注意`package`参数，**由于`package`是JS保留关键字，无法定义为变量**

`代码示例`

``` js
/**
 * 【优先使用此版本】
 * 发起支付 invoke 版
 * @param {string} appId        公众号名称，由商户传入     
 * @param {string} timeStamp    时间戳，自1970年以来的秒数     
 * @param {string} nonceStr     随机串     
 * @param {string} package      prepay_id   
 * @param {string} signType     MD5 微信签名方式：     
 * @param {string} paySign      微信签名 
    微信团队郑重提示：
    res.err_msg 将在用户支付成功后返回 "get_brand_wcpay_request:ok"，但并不保证它绝对可靠。
 */
export function wxPayInvoke(param){
    return new Promise((resolve,reject)=>{
        function onBridgeReady(){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                param,
                res => res.err_msg == "get_brand_wcpay_request:ok"? resolve(res):reject(res)
            );
        }
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }
    })
}

// 发起支付 【新版兼容性较差】
// 注意：微信验签失败无法发起支付，也不会响应 reject
// 只有成功调起支付，但支付失败才会触发 reject 
export function wxPay(param){
    return new Promise((resolve,reject)=>{
        wx.chooseWXPay({
            ...param,
            success:res => resolve(res),
            fail:res=>reject(res)
        });
    })
}
```
## 分享

**注意事项**
- 先看一遍官方文档，这里只有官方文档没有提及的事项；
- `onMenuShareTimeline` `onMenuShareAppMessage` `onMenuShareQQ` `onMenuShareQZone`，这四个接口已准备废弃，最好不要使用；
- 新接口不再取页面首张图片作为分享小图标；
- 图片大小限制为`300 x 300 px`， 格式`jpg`；
- 图片`imgUrl`应该是完整的`URL`,即**协议+域名+路径**
- 配置是异步的，可多次进行配置分享数据，最好是提前配置；

**分享失败的解决方案**
- 确认`wx.config`已经成功
- 确认`wx.config`时，参数`jsApiList`里`updateTimelineShareData` 和`updateAppMessageShareData`的传入；
- 所有参数必填的如`imgUrl` `link`，为空必定失败；


`代码示例`

``` js
/**
 * 初始化wx分享API
 * @param {object} shareConfig 分享配置
 * @param {object} jsApi 分享接口列表
 */
export function initJsAPI(shareConfig={},jsApi=[]){
    const share=Object.assign({
        title: "威生活",    //分享标题 必填
        link:window.location.href,    //分享地址 必填
        type:'link',     // 分享类型,music、video或link，不填默认为link
        dataUrl:'',     // 如果type是music或video，则要提供数据链接，默认为空
        desc:'和你一起分享宝藏公众号',    //分享描述内容
        imgUrl:'',    //分享图标 必填
    },shareConfig);
    let result = [];
    jsApi.forEach(item=>{
        result.push(new Promise((resolve,reject)=>{
            wx[item]({
                ...share,
                success:()=>resolve(),// 设置后执行的回调函数
                fail:reject, // 设置失败执行的回调函数
                cancel:reject // 设置失败执行的回调函数
            });
        }))
    });
    return Promise.all(result);
}
```

## 隐藏微信功能按钮
通过指定数组来隐藏按钮会无法隐藏**微信分享**，如下代码

``` js
wx.hideMenuItems({
        menuList: [
            "menuItem:share:appMessage", //发送给朋友: 
            "menuItem:share:timeline", //分享到朋友圈: 
            "menuItem:share:qq", //分享到QQ:
            "menuItem:share:weiboApp", //分享到Weibo
            "menuItem:favorite", //收藏
            "menuItem:share:facebook", //分享到FB:
            "menuItem:share:QZone",//分享到 QQ 空间
            "menuItem:copyUrl",//复制链接
            "menuItem:originPage",//原网页
            "menuItem:readMode",//阅读模式
            "menuItem:openWithQQBrowser",//在QQ浏览器中打开
            "menuItem:openWithSafari",//在Safari中打开
            "menuItem:share:email",//邮件
        ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
    })
```

微信没有提供这个按钮对应的KEY，所以需要通过 `wx.hideAllNonBaseMenuItem` 来隐藏所有`传播类`和`保护类`按钮。

``` js
wx.hideAllNonBaseMenuItem(); //隐藏所有非基础类的按钮
```

再通过`showMenuItems`来显示需要显示的按钮。

``` js
wx.showMenuItems({
        menuList: [
            "menuItem:share:appMessage", //发送给朋友: 
            "menuItem:share:timeline", //分享到朋友圈: 
            // "menuItem:share:qq", //分享到QQ:
            // "menuItem:share:weiboApp", //分享到Weibo
            "menuItem:favorite", //收藏
            // "menuItem:share:facebook", //分享到FB:
            // "menuItem:share:QZone",//分享到 QQ 空间
            // "menuItem:copyUrl",//复制链接
            // "menuItem:originPage",//原网页
            // "menuItem:readMode",//阅读模式
            // "menuItem:openWithQQBrowser",//在QQ浏览器中打开
            // "menuItem:openWithSafari",//在Safari中打开
            // "menuItem:share:email",//邮件
        ]
    })

```