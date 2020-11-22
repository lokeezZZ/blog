module.exports = {
    title: 'Lokee\'s blog',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [
            { text: 'Home', link: '/'},
            // { text: 'Github', link: '/'},
            // { text: '参与人员', link: '/contributer'},
            { text: 'MD语法', link: '/md-demo'}
        ],
        sidebar: [
            ['/','开发环境'],
            // ['/development','开始开发'],
            {
                title: '组件文档',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children:[
                    ['/pages/design-pattern','设计模式'],
                    ['/pages/wechatapi','微信开发'],
                ]
            }


        ],
        nextLinks: false, //禁用下一页
        prevLinks: false, //禁用上一页
        smoothScroll: true //启用页面滚动效果
    }



}
