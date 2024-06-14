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
        prefix: '',
        icon: 'util',
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
    children: []
  }
]);
