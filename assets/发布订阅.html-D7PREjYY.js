import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,o as a,a as t}from"./app-DNxEUb65.js";const l={},n=t(`<h1 id="redis的发布和订阅" tabindex="-1"><a class="header-anchor" href="#redis的发布和订阅"><span>redis的发布和订阅</span></a></h1><h2 id="什么是发布和订阅" tabindex="-1"><a class="header-anchor" href="#什么是发布和订阅"><span>什么是发布和订阅</span></a></h2><p>redis发布订阅（pub/sub）是一种消息通信模式：发布者（pub）发布消息，订阅者（sub）接收消 息。 redis客户端可以订阅任意数量的频道。</p><h2 id="redis的发布和订阅-1" tabindex="-1"><a class="header-anchor" href="#redis的发布和订阅-1"><span>redis的发布和订阅</span></a></h2><p>客户端订阅频道图：</p><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429150303972.png" style="zoom:33%;"><p>当给这个频道发布消息后，消息就会发送给订阅的客户端。</p><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429150635009.png" style="zoom:33%;"><h2 id="发布和订阅的命令行实现" tabindex="-1"><a class="header-anchor" href="#发布和订阅的命令行实现"><span>发布和订阅的命令行实现</span></a></h2><ol><li><p>打开一个客户端订阅channel1，命令：subscribe 频道1 频道2 ...，可以订阅多个频道</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">subscribe</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> channel1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429151621961.png" alt="image-20220429151621961" loading="lazy"></p></li><li><p>打开另一个客户端，给channel1发布消息，命令：publish channel1 消息，返回值是订阅者数量。</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">publish</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> channel1</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> hello</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429151800046.png" alt="image-20220429151800046" loading="lazy"></p></li><li><p>切换到订阅客户端就可以看到收到的消息。</p><p><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429151918567.png" alt="image-20220429151918567" loading="lazy"></p></li></ol><h2 id="发布和订阅常用命令" tabindex="-1"><a class="header-anchor" href="#发布和订阅常用命令"><span>发布和订阅常用命令</span></a></h2><ol><li><p>订阅一个或多个消息频道</p><p><strong>命令：</strong> subscribe 频道1 频道2...</p><p><strong>返回值：</strong> 接收到的信息，详细信息：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">127.0.0.1:6379</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt; </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">subscribe</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> channel1</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">Reading</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> messages...</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (press </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">Ctrl-C</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> to</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> quit</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;subscribe&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">			#返回值的类型：显示订阅成功</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;channel1&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">			#订阅频道的名字</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">integer</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) 1			</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">#目前已订阅的频道数量</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;message&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">			#返回值的类型：信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;channel1&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">			#信息来源（是哪个频道的信息）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;hello&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">				#信息内容</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>发布消息到指定的频道</p><p><strong>命令：</strong> publish 频道 信息</p><p><strong>返回值：</strong> 接收到信息的订阅者数量</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">#向channel1频道发送消息hello</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">127.0.0.1:6379</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt; </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">publish</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> channel1</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> hello</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">integer</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">1</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">		#订阅者数量，表示有1个客户端订阅了该频道消息</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>订阅一个或多个符合给定模式的频道</p><p><strong>命令：</strong> pusbscribe 表达式</p><p>订阅一个或多个符合表达式的频道，每个模式一<code>*</code>作为匹配符，比如<code>it*</code>匹配所有以<code>it</code>开头的频道（<code>it.new</code>,<code>it.blog</code>等）；</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"># 第 1 - 6 行是执行 psubscribe 之后的反馈信息</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"># 第 7 - 10 才是接收到的第一条信息</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"># 第 11 - 14 是第二条</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"># 以此类推。。。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">redis</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">&gt; </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">psubscribe</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> news.</span><span style="--shiki-light:#005CC5;--shiki-dark:#E5C07B;">*</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> tweet.</span><span style="--shiki-light:#005CC5;--shiki-dark:#E5C07B;">*</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">Reading</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> messages...</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (press </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">Ctrl-C</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> to</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> quit</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;psubscribe&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> # 返回值的类型：显示订阅成功</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;news.*&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> # 订阅的模式</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">integer</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) 1 </span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"># 目前已订阅的模式的数量</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;psubscribe&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;tweet.*&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">integer</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) 2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;pmessage&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> # 返回值的类型：信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;news.*&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> # 信息匹配的模式</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;news.it&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> # 信息本身的目标频道</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;Google buy Motorola&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#7F848E;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> # 信息的内容</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol>`,12),e=[n];function h(k,p){return a(),s("div",null,e)}const g=i(l,[["render",h],["__file","发布订阅.html.vue"]]),o=JSON.parse('{"path":"/%E4%B8%93%E9%A1%B9/%E6%95%B0%E6%8D%AE%E5%BA%93/redis/%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85.html","title":"发布订阅","lang":"zh-CN","frontmatter":{"title":"发布订阅","tags":["数据库","redis"],"order":"3","description":"redis的发布和订阅 什么是发布和订阅 redis发布订阅（pub/sub）是一种消息通信模式：发布者（pub）发布消息，订阅者（sub）接收消 息。 redis客户端可以订阅任意数量的频道。 redis的发布和订阅 客户端订阅频道图： 当给这个频道发布消息后，消息就会发送给订阅的客户端。 发布和订阅的命令行实现 打开一个客户端订阅channel1，...","head":[["meta",{"property":"og:url","content":"https://gly-dragon.github.io/blog/blog/%E4%B8%93%E9%A1%B9/%E6%95%B0%E6%8D%AE%E5%BA%93/redis/%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85.html"}],["meta",{"property":"og:site_name","content":"龙哥不管事"}],["meta",{"property":"og:title","content":"发布订阅"}],["meta",{"property":"og:description","content":"redis的发布和订阅 什么是发布和订阅 redis发布订阅（pub/sub）是一种消息通信模式：发布者（pub）发布消息，订阅者（sub）接收消 息。 redis客户端可以订阅任意数量的频道。 redis的发布和订阅 客户端订阅频道图： 当给这个频道发布消息后，消息就会发送给订阅的客户端。 发布和订阅的命令行实现 打开一个客户端订阅channel1，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429151621961.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-13T06:14:28.000Z"}],["meta",{"property":"article:author","content":"龙哥不管事"}],["meta",{"property":"article:tag","content":"数据库"}],["meta",{"property":"article:tag","content":"redis"}],["meta",{"property":"article:modified_time","content":"2024-06-13T06:14:28.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"发布订阅\\",\\"image\\":[\\"https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429151621961.png\\",\\"https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429151800046.png\\",\\"https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429151918567.png\\"],\\"dateModified\\":\\"2024-06-13T06:14:28.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"龙哥不管事\\",\\"url\\":\\"https://gly-dragon.github.io/blog/\\"}]}"]]},"headers":[{"level":2,"title":"什么是发布和订阅","slug":"什么是发布和订阅","link":"#什么是发布和订阅","children":[]},{"level":2,"title":"redis的发布和订阅","slug":"redis的发布和订阅-1","link":"#redis的发布和订阅-1","children":[]},{"level":2,"title":"发布和订阅的命令行实现","slug":"发布和订阅的命令行实现","link":"#发布和订阅的命令行实现","children":[]},{"level":2,"title":"发布和订阅常用命令","slug":"发布和订阅常用命令","link":"#发布和订阅常用命令","children":[]}],"git":{"createdTime":1711937861000,"updatedTime":1718259268000,"contributors":[{"name":"龙哥不管事","email":"gly3498347531@163.com","commits":1}]},"readingTime":{"minutes":2.17,"words":650},"filePathRelative":"专项/数据库/redis/发布订阅.md","localizedDate":"2024年4月1日","excerpt":"\\n<h2>什么是发布和订阅</h2>\\n<p>redis发布订阅（pub/sub）是一种消息通信模式：发布者（pub）发布消息，订阅者（sub）接收消 息。 redis客户端可以订阅任意数量的频道。</p>\\n<h2>redis的发布和订阅</h2>\\n<p>客户端订阅频道图：</p>\\n<img src=\\"https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429150303972.png\\" style=\\"zoom:33%;\\">\\n<p>当给这个频道发布消息后，消息就会发送给订阅的客户端。</p>\\n<img src=\\"https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429150635009.png\\" style=\\"zoom:33%;\\">","autoDesc":true}');export{g as comp,o as data};
