import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,o as s,a}from"./app-DNxEUb65.js";const l={},r=a('<h1 id="redis的基本概念及环境配置" tabindex="-1"><a class="header-anchor" href="#redis的基本概念及环境配置"><span>redis的基本概念及环境配置</span></a></h1><h2 id="redis基本概念" tabindex="-1"><a class="header-anchor" href="#redis基本概念"><span>redis基本概念</span></a></h2><p>redis是一种非关系型数据库（NoSQL），非关系型数据库没有表的概念，数据是直接存储在内存中，所以它的速度会更快。</p><p>关系型数据库和非关系型数据库的区别：</p><ol><li>关系型数据库通过“表”来存储数据，非关系型数据库没有表的概念</li><li>非关系型数据库数据是直接存储在内存中</li><li>关系型数据库安全性高，性能差，非关系型数据库性能好但是安全性差</li></ol><p><strong>redis</strong>是基于键值对一种非关系型数据库，数据存储在内存中，主要是存储一些比较重要的信息，例如:用户的身份信息，以及抢购、秒杀之类的操作，主要应用场景是在高并发环境下缓解服务器压力或者在分布式系统中用来存放用户的身份信息。</p><h2 id="安装redis" tabindex="-1"><a class="header-anchor" href="#安装redis"><span>安装redis</span></a></h2><h3 id="使用压缩包安装" tabindex="-1"><a class="header-anchor" href="#使用压缩包安装"><span>使用压缩包安装</span></a></h3><ol><li><p>首先在<a href="https://download.redis.io/releases/" target="_blank" rel="noopener noreferrer">redis官网下载地址</a>上下载redis的安装包。</p></li><li><p>将redis的安装包上传到linux中并进行解压</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">tar</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -xvPf</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /software/redis-3.0.0.tar.gz</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -C</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /usr/local/software/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>redis是使用C语言进行编写的，如果没有安装C语言的运行环境，需要先安装C语言的运行环境，如果已经安装，跳过该步骤。此处使用联网安装C语言</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> gcc-c++</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>构建redis，进入/usr/local/software/redis-3.0.0目录执行make命令即可构建redis</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">make</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>安装redis，构建完成后在/usr/local/software/redis-3.0.0目录下执行安装命令</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">make</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> PREFIX=/usr/local/software/redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>执行成功后在/usr/local/software/目录下产生一个redis的文件夹，该文件夹中的bin目录包括一组redis的使用程序，至此redis安装完成。</p></li></ol><h3 id="使用docker安装redis-推荐" tabindex="-1"><a class="header-anchor" href="#使用docker安装redis-推荐"><span>使用docker安装redis（推荐）</span></a></h3><p>使用压缩包安装redis流程较为繁琐，所以可以在redis中使用docker进行安装，但是如果没有安装docker需要先安装docker。docker联网安装命令：</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> docker</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>安装了docker之后启动docker，只需要执行安装redis的命令即可。</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> pull</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>拉取成功后执行命令创建docker容器，即redis程序</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 6379:6379</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p>**注意：**无论是使用压缩包安装还是使用docker进行安装，都需要注册linux防火墙才可以使用，注册linux防火墙：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>firewall-cmd --zone=public --add-port=6379/tcp --permanent</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>注册防火墙后需要重启防火墙：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>firewall-cmd --reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></blockquote><h2 id="启动redis" tabindex="-1"><a class="header-anchor" href="#启动redis"><span>启动redis</span></a></h2><p>对于直接安装在linux中的redis可以使用两种方式进行启动：</p><ol><li><p>前台启动：进入redis安装目录中的bin目录，即/usr/local/software/redis/bin，执行命令即可：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>./redis-server</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>使用该方式启动后该控制台就不能再执行其他命令，如果要执行其他命令，需要重新打开一个控制台窗口，较为麻烦，所以一般情况下，使用后台启动更方便。</p></li><li><p>后台启动（推荐使用）：</p><p>后台启动在启动后该控制台窗口依然可以继续编写其他命令，但是后台使用后台启动需要一定的配置：</p><ul><li><p>复制redis的配置文件（安装后的bin目录中并没有redis的配置文件，配置文件需要到安装程序中去复制，即将/usr/local/software/redis-3.0.0目录下redis.conf文件复制到/usr/local/software/redis/bin目录中</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>cp /usr/local/software/redis-3.0.0/redis.conf /usr/local/software/redis/bin</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>修改配置文件（redis.conf）中的一些信息：</p><p>使用编辑命令（vi redis.conf）进入该文件，修改daemonize no为daemonize yes</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>vi redis.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>在bin目录中执行命令后台启动redis</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>./redis-server redis.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul></li></ol><p>如果是使用docker进行安装的，需要在保持docker运行的情况下执行命令启动</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>docker start 6a54231d1277 #6a54231d1277是docker容器的id，并不一定，可以使用docker ps查看redis的id</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="访问redis" tabindex="-1"><a class="header-anchor" href="#访问redis"><span>访问redis</span></a></h2><p>访问redis服务器一共有三种方式，分别是使用redis客户端和redis桌面管理工具以及使用代码连接</p><ol><li><p>使用redis客户端建立连接</p><p>redis客户端在redis的bin目录（redis-cli)中，进入该目录执行命令启动即可</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>./redis-cli</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>执行<code>exit</code>命令即可退出客户端。</p></li><li><p>使用redis的桌面管理工具，在Windows下直接连接linux中的redis，但是要求端口号必须已经注册，如果没有安装redis桌面管理工具，需要先安装redis桌面管理程序。</p></li><li><p>使用代码连接</p><p>可以使用jedis连接redis，jedis是java代码连接redis的一种技术，在spring生态中也提供了不少类似的连接架包。</p></li></ol>',25),d=[r];function t(n,h){return s(),e("div",null,d)}const c=i(l,[["render",t],["__file","介绍.html.vue"]]),k=JSON.parse('{"path":"/%E4%B8%93%E9%A1%B9/%E6%95%B0%E6%8D%AE%E5%BA%93/redis/%E4%BB%8B%E7%BB%8D.html","title":"介绍","lang":"zh-CN","frontmatter":{"title":"介绍","tags":["redis","数据库"],"order":"1","description":"redis的基本概念及环境配置 redis基本概念 redis是一种非关系型数据库（NoSQL），非关系型数据库没有表的概念，数据是直接存储在内存中，所以它的速度会更快。 关系型数据库和非关系型数据库的区别： 关系型数据库通过“表”来存储数据，非关系型数据库没有表的概念 非关系型数据库数据是直接存储在内存中 关系型数据库安全性高，性能差，非关系型数据库...","head":[["meta",{"property":"og:url","content":"https://gly-dragon.github.io/blog/blog/%E4%B8%93%E9%A1%B9/%E6%95%B0%E6%8D%AE%E5%BA%93/redis/%E4%BB%8B%E7%BB%8D.html"}],["meta",{"property":"og:site_name","content":"龙哥不管事"}],["meta",{"property":"og:title","content":"介绍"}],["meta",{"property":"og:description","content":"redis的基本概念及环境配置 redis基本概念 redis是一种非关系型数据库（NoSQL），非关系型数据库没有表的概念，数据是直接存储在内存中，所以它的速度会更快。 关系型数据库和非关系型数据库的区别： 关系型数据库通过“表”来存储数据，非关系型数据库没有表的概念 非关系型数据库数据是直接存储在内存中 关系型数据库安全性高，性能差，非关系型数据库..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-13T06:14:28.000Z"}],["meta",{"property":"article:author","content":"龙哥不管事"}],["meta",{"property":"article:tag","content":"redis"}],["meta",{"property":"article:tag","content":"数据库"}],["meta",{"property":"article:modified_time","content":"2024-06-13T06:14:28.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"介绍\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-06-13T06:14:28.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"龙哥不管事\\",\\"url\\":\\"https://gly-dragon.github.io/blog/\\"}]}"]]},"headers":[{"level":2,"title":"redis基本概念","slug":"redis基本概念","link":"#redis基本概念","children":[]},{"level":2,"title":"安装redis","slug":"安装redis","link":"#安装redis","children":[{"level":3,"title":"使用压缩包安装","slug":"使用压缩包安装","link":"#使用压缩包安装","children":[]},{"level":3,"title":"使用docker安装redis（推荐）","slug":"使用docker安装redis-推荐","link":"#使用docker安装redis-推荐","children":[]}]},{"level":2,"title":"启动redis","slug":"启动redis","link":"#启动redis","children":[]},{"level":2,"title":"访问redis","slug":"访问redis","link":"#访问redis","children":[]}],"git":{"createdTime":1711899362000,"updatedTime":1718259268000,"contributors":[{"name":"龙哥不管事","email":"gly3498347531@163.com","commits":1}]},"readingTime":{"minutes":3.97,"words":1192},"filePathRelative":"专项/数据库/redis/介绍.md","localizedDate":"2024年3月31日","excerpt":"\\n<h2>redis基本概念</h2>\\n<p>redis是一种非关系型数据库（NoSQL），非关系型数据库没有表的概念，数据是直接存储在内存中，所以它的速度会更快。</p>\\n<p>关系型数据库和非关系型数据库的区别：</p>\\n<ol>\\n<li>关系型数据库通过“表”来存储数据，非关系型数据库没有表的概念</li>\\n<li>非关系型数据库数据是直接存储在内存中</li>\\n<li>关系型数据库安全性高，性能差，非关系型数据库性能好但是安全性差</li>\\n</ol>\\n<p><strong>redis</strong>是基于键值对一种非关系型数据库，数据存储在内存中，主要是存储一些比较重要的信息，例如:用户的身份信息，以及抢购、秒杀之类的操作，主要应用场景是在高并发环境下缓解服务器压力或者在分布式系统中用来存放用户的身份信息。</p>","autoDesc":true}');export{c as comp,k as data};
