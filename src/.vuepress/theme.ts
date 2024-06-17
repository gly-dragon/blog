import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://gly-dragon.github.io/blog/",
  favicon: 'https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/avatar.jpg',

  author: {
    name: "龙哥不管事",
    url: "https://gly-dragon.github.io/blog/",
  },

  iconAssets: "//at.alicdn.com/t/c/font_4582440_dovdwvfatym.css",
  iconPrefix: "ic ic-",

  logo: "https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/avatar.jpg",

  // Git仓库地址
  repo: "gly-dragon/blog",
  repoLabel: "GitHub",
  // 是否显示Git仓库链接
  repoDisplay: true,
  editLink: false,
  lastUpdated: true,
  contributors: true,

  // 全屏切换按钮
  fullscreen: true,

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "",
    intro: "/intro.html",
    medias: {

    },
  },

  // 加密配置
  encrypt: {
    config: {

    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 纯净模式开关
  // pure: false,

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

  /*   navbarLayout: {
      start: ['Brand'],
      center: ['Links'],
      end: []
    }, */

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,
    search: true,

    // 在启用之前需要安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务器，在生产环境中请自行部署并使用自己的服务器！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    components: {
      components: ["Badge", "VPCard"],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      sub: true,
      sup: true,
      tabs: true,

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      // katex: true,

      // 在启用之前安装 mathjax-full
      // mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
