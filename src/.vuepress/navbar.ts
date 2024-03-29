import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: '数据库',
    icon: 'database',
    prefix: '/database/',
    children: [
      {
        text: 'mysql',
        link: 'mysql/'
      }, {
        text: 'redis',
        link: 'redis/'
      }
    ]
  }
]);
