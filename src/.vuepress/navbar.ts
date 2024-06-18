import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
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
  },
  {
    text: '进阶之路',
    icon: 'trophy',
    children: []
  }, {
    text: '日积月累',
    icon: 'experience',
    children: []
  },
  {
    text: '工具',
    icon: 'util',
    children: []
  }
]);
