module.exports = {
    title: 'Lokee\'s blog',
    theme: 'reco',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        subSidebar: 'auto',
        // 博客配置
        blogConfig: {
            category: {
                location: 2,     // 在导航栏菜单中所占的位置，默认2
                text: 'frontEnd' // 默认文案 “分类”
            },
            tag: {
                location: 3,     // 在导航栏菜单中所占的位置，默认3
                text: 'Tag'      // 默认文案 “标签”
            }
        },
        mode: 'light', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
        nav: [
            { text: 'Home', link: '/', icon:'reco-home'},
            // { text: 'Github', link: '/'},
            // { text: '参与人员', link: '/contributer'},
            { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
            { text: 'Memo', link: '/mymemo',icon:'reco-lock'}
        ],
        sidebar: [
            {
                title: '基础入门',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children:[
                    ['/pages/rule','开始开发'],
                    ['/pages/tricks','JS 小技巧'],
                    ['/pages/html-css','HTML 和 CSS'],
                    ['/pages/design-pattern','设计模式'],
                    ['/pages/functional','函数式编程']
                ]
            },
            {
                title: '性能', 
                children:[
                    ['/pages/performance/timing.md','性能指标'],
                ]
            },
            { 
                title: '工程化',
                children: [
                    ['/pages/webpack/introduction','Webpack 5 配置篇'],
                    // ['/pages/webpack/speedup','Webpack4 优化篇'],
                    // ['/pages/webpack/source-code','Webpack4 原理篇'],
                    ['/pages/webpack/update','Webpack 5 新特性']
                ]
            },
            { 
                title: '前端框架',
                children: [
                    ['/pages/vue/vue2','Vue 2.x'],
                    // ['/pages/vue/vue3','Vue 3.0'],
                    // ['/pages/vue/domdiff','Vue Dom diff'],
                    // ['/pages/react/class','React 15.x'],
                    // ['/pages/react/hooks','React 16-17'],
                    // ['/pages/react/fiber','React fiber'],
                    // ['/pages/react/domdiff','React Dom Diff'],
                    // ['/pages/vue-diff-react','React vs Vue'],
                ]
            },
            // ['/pages/safe','前端安全']
            {
                title: '第三方文档', 
                children:[
                    ['/pages/wechatapi','微信开发'],
                ]
            },
        ],
        nextLinks: false, //禁用下一页
        prevLinks: false, //禁用上一页
        smoothScroll: true //启用页面滚动效果
    }



}
