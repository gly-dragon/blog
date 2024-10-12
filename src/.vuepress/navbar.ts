import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/", {
    text: '专项笔记',
    icon: 'book',
    children: [
      {
        text: '数据库',
        prefix: '/专项/数据库/',
        children: [
          {
            text: 'mysql',
            link: 'mysql/',
            icon: 'mysql'
          }, {
            text: 'redis',
            link: 'redis/',
            icon: 'redis'
          }
        ]
      }, {
        text: 'Java专项',
        prefix: '/专项/Java专项',
        children: [
          {
            text: 'java基础',
            link: 'Java基础/',
            icon: 'java'
          }, {
            text: 'java高级',
            link: ''
          }, {
            text: 'java web',
            link: ''
          }
        ]
      }, {
        text: 'java框架',
        // prefix: '',
        children: []
      }
    ]
  }, {
    text: '进阶之路',
    icon: 'trophy',
    children: [{
      text: '设计模式',
      children: [{
        text: '设计模式详解',
        link: '/进阶/设计模式/',
        icon: 'sheji'
      }]
    }]
  }, {
    text: '模板方案',
    icon: 'experience',
    prefix: '/方案',
    children: [
      {
        text: 'Java项目',
        link: 'Java项目/'
      }
    ]
  }, {
    text: '工具',
    icon: 'util',
    prefix: '/工具/',
    children: [{
      text: '文件服务',
      prefix: '文件服务/',
      children: [{
        text: 'FastDfs',
        link: 'FastDfs',
        icon: 'fast-dfs'
      }]
    }, {
      text: '数据库',
      prefix: '数据库/',
      children: [{
        text: 'redis',
        link: 'redis',
        icon: 'redis'
      }]
    }]
  }
]);
