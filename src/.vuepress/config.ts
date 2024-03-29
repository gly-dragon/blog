import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",

  lang: "zh-CN",
  title: "书元",
  description: "",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
