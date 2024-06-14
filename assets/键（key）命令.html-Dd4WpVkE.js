import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as t,a as s}from"./app-Bq83tzU4.js";const d={},l=s('<h2 id="redis键-key" tabindex="-1"><a class="header-anchor" href="#redis键-key"><span>Redis键（key）</span></a></h2><p>Redis 键命令用于管理 redis 的键，其基本语法格式为：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">command</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> key_name</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>Redis键操作的基本命令：</strong></p><ul><li><code>del key</code>：key存在时删除key</li><li><code>dump key</code>：序列化key并返回被序列化后的值</li><li><code>exists key</code>：检查key是否存在</li><li><code>expire key seconds</code>：给指定可以设置过期时间，单位秒</li><li><code>expireat key timestamp</code>：给指定key设置过期时间，参数为unix时间戳</li><li><code>pexpire key milliseconds</code>：给指定key设置过期时间，单位毫秒</li><li><code>pexpireatat key milliseconds-timestamp</code>：给指定key设置过期时间，参数为unix时间戳，单位毫秒</li><li><code>keys pattern</code>：查找所有符合<code>pattern</code>表达式的key</li><li><code>move key db</code>：将当前数据库的key移动到指定数据库中</li><li><code>persist key</code>：移除key的过期时间，key将永久存在</li><li><code>pttl key</code>：返回key剩余的过期时间，单位毫秒</li><li><code>ttl key</code>：返回key剩余的过期时间，单位秒</li><li><code>randomkey</code>：随机返回一个key</li><li><code>rename key newkey</code>：重命名key</li><li><code>renamenx key newkey</code>：新名称不存在时重命名key</li><li><code>type key</code>：获取key所存储的值类型</li></ul>',5),a=[l];function o(r,n){return t(),i("div",null,a)}const y=e(d,[["render",o],["__file","键（key）命令.html.vue"]]),p=JSON.parse('{"path":"/%E4%B8%93%E9%A1%B9/%E6%95%B0%E6%8D%AE%E5%BA%93/redis/%E9%94%AE%EF%BC%88key%EF%BC%89%E5%91%BD%E4%BB%A4.html","title":"键(key)命令","lang":"zh-CN","frontmatter":{"title":"键(key)命令","tags":["redis","数据库"],"order":"2","description":"Redis键（key） Redis 键命令用于管理 redis 的键，其基本语法格式为： Redis键操作的基本命令： del key：key存在时删除key dump key：序列化key并返回被序列化后的值 exists key：检查key是否存在 expire key seconds：给指定可以设置过期时间，单位秒 expireat key ti...","head":[["meta",{"property":"og:url","content":"https://gly-dragon.github.io/blog/blog/%E4%B8%93%E9%A1%B9/%E6%95%B0%E6%8D%AE%E5%BA%93/redis/%E9%94%AE%EF%BC%88key%EF%BC%89%E5%91%BD%E4%BB%A4.html"}],["meta",{"property":"og:site_name","content":"龙哥不管事"}],["meta",{"property":"og:title","content":"键(key)命令"}],["meta",{"property":"og:description","content":"Redis键（key） Redis 键命令用于管理 redis 的键，其基本语法格式为： Redis键操作的基本命令： del key：key存在时删除key dump key：序列化key并返回被序列化后的值 exists key：检查key是否存在 expire key seconds：给指定可以设置过期时间，单位秒 expireat key ti..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-14T02:57:15.000Z"}],["meta",{"property":"article:author","content":"龙哥不管事"}],["meta",{"property":"article:tag","content":"redis"}],["meta",{"property":"article:tag","content":"数据库"}],["meta",{"property":"article:modified_time","content":"2024-06-14T02:57:15.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"键(key)命令\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-06-14T02:57:15.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"龙哥不管事\\",\\"url\\":\\"https://gly-dragon.github.io/blog/\\"}]}"]]},"headers":[{"level":2,"title":"Redis键（key）","slug":"redis键-key","link":"#redis键-key","children":[]}],"git":{"createdTime":1718333835000,"updatedTime":1718333835000,"contributors":[{"name":"龙哥不管事","email":"gly3498347531@163.com","commits":1}]},"readingTime":{"minutes":0.94,"words":281},"filePathRelative":"专项/数据库/redis/键（key）命令.md","localizedDate":"2024年6月14日","excerpt":"<h2>Redis键（key）</h2>\\n<p>Redis 键命令用于管理 redis 的键，其基本语法格式为：</p>\\n<div class=\\"language-shell line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"shell\\" data-title=\\"shell\\" style=\\"--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes github-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#005CC5;--shiki-dark:#56B6C2\\">command</span><span style=\\"--shiki-light:#032F62;--shiki-dark:#98C379\\"> key_name</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{y as comp,p as data};
