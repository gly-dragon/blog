import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as a,c as s,a as n}from"./app-BdFIoWYT.js";const i={},l=n(`<h1 id="redis的持久化" tabindex="-1"><a class="header-anchor" href="#redis的持久化"><span>redis的持久化</span></a></h1><p>Redis是一个基于内存的数据库，它的数据是存放在内存中，内存有个问题就是关闭服务或者断电会丢失。</p><p>Redis的数据也支持写到硬盘中，这个过程就叫做持久化。</p><p>Redis提供了2种不同形式的持久化方式。</p><ul><li>RDB（Redis DataBase）</li><li>AOP（Append Of File）</li></ul><h2 id="_1、rdb-redis-database" tabindex="-1"><a class="header-anchor" href="#_1、rdb-redis-database"><span>1、RDB（Redis DataBase）</span></a></h2><p>在指定的时间间隔内将内存中的数据集快照写入磁盘，也就是行话讲的Snapshot快照，它恢复时是将快照文件直接读到内存里。</p><p>**备份执行原理：**Redis会单独创建（fork）一个子进程进行持久化，会先将数据写入到一个临时文件中，待持久化过程都 结束后，再用这个临时文件替换上次持久化好的文件。整个过程中，主进程是不进行任何IO操作的，这 就是确保了极高的性能，如果需要进行大规模的恢复，且对数据恢复的完整性不是非常敏感，那RDB方式要比AOF方式更加的高效。RDB的缺点是最后一次持久化后的数据可能丢失。</p><p><strong>RDB持久化流程：</strong></p><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429170442901.png" alt="image-20220429170442901" style="zoom:50%;"><p>如果需要修改备份文件的名称以及文件存放目录，可以在redis.conf文件中进行修改。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment">#rdb默认备份文件</span>
dbfilename dump.rdb

<span class="token comment">#备份文件目录默认值，表示执行redis-server启动时所在的目录</span>
<span class="token function">dir</span> ./
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-1、fork" tabindex="-1"><a class="header-anchor" href="#_1-1、fork"><span>1.1、Fork</span></a></h3><ul><li>Fork的作用是复制一个与当前进程一样的进程，新进程的所有数据（变量、环境变量、程序计数器 等）数值都和原进程一致，它是一个全新的进程，并作为原进程的子进程。</li><li>在Linux程序中，fork()会产生一个和父进程完全相同的子进程，但子进程在此后多会exec系统调 用，处于效率考虑，linux中引入了“写时复制技术”</li><li>一般情况父进程和子进程会共用一段物理内存，只有进程空间的各段的内容要发生变化时，才会将 父进程的内容复制一份给子进程。</li></ul><h3 id="_1-2、触发备份的方式" tabindex="-1"><a class="header-anchor" href="#_1-2、触发备份的方式"><span>1.2、触发备份的方式</span></a></h3><h4 id="_1-2-1、方式一-自动备份" tabindex="-1"><a class="header-anchor" href="#_1-2-1、方式一-自动备份"><span>1.2.1、方式一：自动备份</span></a></h4><p>可在redis.conf中配置自动备份的规则</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token comment">#默认备份规则，1分钟内修改了一万次，或者5分钟内修改了10次，或者30分钟内修改了1次，都会报错</span>
save <span class="token number">900</span> <span class="token number">1</span>
save <span class="token number">300</span> <span class="token number">10</span>
save <span class="token number">60</span> <span class="token number">10000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>save的配置格式：<code>save 秒 操作次数</code></p><h4 id="_1-2-2、方式二-手动执行命令备份" tabindex="-1"><a class="header-anchor" href="#_1-2-2、方式二-手动执行命令备份"><span>1.2.2、方式二：手动执行命令备份</span></a></h4><p>有2个命令可以触发备份。</p><p>**save：**save时只管保存，其他不管，全部阻塞，手动保存，不建议使用。</p><p>**bgsave：**redis会在后台异步进行快照操作，快照同时还可以响应客户端情况。 可以通过<code>lastsave</code> 命令获取最后一次成功生成快照的时间。</p><h4 id="_1-2-3、flushall命令" tabindex="-1"><a class="header-anchor" href="#_1-2-3、flushall命令"><span>1.2.3、flushall命令</span></a></h4><p>执行flushall命令，也会产生dump.rdb文件，但里面是空的，无意义。</p><h3 id="_1-3、redis-cof一些关于rdb的配置" tabindex="-1"><a class="header-anchor" href="#_1-3、redis-cof一些关于rdb的配置"><span>1.3、redis.cof一些关于RDB的配置</span></a></h3><ol><li>stop-writes-on-bgsave-error：当磁盘满时，是否关闭redis的写操作</li><li>rdbcompression：rdb备份是否开启压缩</li><li>rdbchecksum：是否检查rdb备份文件的完整性</li></ol><h3 id="_1-4、rdb的备份和恢复" tabindex="-1"><a class="header-anchor" href="#_1-4、rdb的备份和恢复"><span>1.4、rdb的备份和恢复</span></a></h3><ol><li><p>先通过config get dir 查询rdb文件的目录</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> config get <span class="token function">dir</span>
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token string">&quot;dir&quot;</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token string">&quot;/usr/local/software/redis/bin&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>将rdb的备份文件 <code>*.rdb</code> 文件拷贝到别的地方</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">cp</span> /usr/local/software/redis/bin/dump.rdb /usr/local/software/redis/bin/dump2.rdb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>rdb的恢复</p><ul><li>关闭redis</li><li>把备份的文件拷贝到工作目录 cp dump2.rdb dump.rdb</li><li>启动redis，备份数据直接加载，数据被恢复</li></ul></li></ol><h3 id="_1-5、rdb的优劣势" tabindex="-1"><a class="header-anchor" href="#_1-5、rdb的优劣势"><span>1.5、RDB的优劣势</span></a></h3><h4 id="_1-5-1、优势" tabindex="-1"><a class="header-anchor" href="#_1-5-1、优势"><span>1.5.1、优势</span></a></h4><ol><li>适合大规模数据恢复</li><li>对数据完整性和一致性要求不高更适合使用</li><li>节省磁盘空间</li><li>恢复速度快</li></ol><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429172202128.png" alt="image-20220429172202128" style="zoom:50%;"><h4 id="_1-5-2、劣势" tabindex="-1"><a class="header-anchor" href="#_1-5-2、劣势"><span>1.5.2、劣势</span></a></h4><ol><li>Fork的时候，内存中的数据会被克隆一份，大致2倍的膨胀，需要考虑</li><li>虽然Redis在fork的时候使用了写时拷贝技术，但是如果数据庞大时还是比较消耗性能</li><li>在备份周期在一定间隔时间做一次备份，所以如果Redis意外down的话，就会丢失最后一次快照后 所有修改</li></ol><h3 id="_1-6、停止rdb" tabindex="-1"><a class="header-anchor" href="#_1-6、停止rdb"><span>1.6、停止RDB</span></a></h3><p>动态停止RDB：<code>redis-cli config set save &quot;&quot;</code> #save后给空值，表示禁用保存策略。</p><h2 id="_2、aof-append-only-file" tabindex="-1"><a class="header-anchor" href="#_2、aof-append-only-file"><span>2、AOF（Append Only File）</span></a></h2><p>aof是以日志的形式来记录每个写操作（增量保存），将redis执行过的所有写指令记录下来（读操作不记 录），只允追加文件但不可改写文件，redis启动之初会读取该文件重新构造数据，换言之，redis重启 的话就根据日志文件的内容将写指令从前到后执行一次以完成数据的恢复工作。</p><p><strong>aof的持久化流程：</strong></p><ul><li>客户端的请求写命令会被append追加到AOF缓冲区内</li><li>AOF缓冲区会根据AOF持久化策略[always,everysec,no]将操作sync同步到磁盘的AOF文件中</li><li>AOF文件大小超过重写策略或手动重写时，会对AOF文件进行重写（rewrite），压缩AOF文件容量</li><li>redis服务器重启时，会重新load加载AOF文件中的写操作达到数据恢复的目的</li></ul><img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/image-20220429172652603.png" alt="image-20220429172652603" style="zoom:50%;"><p>aof默认是不开启的，可以配置<code>redis.conf</code>来开启aof配置。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>appendonly no <span class="token comment"># 是否开启AOF，yes：开启，no：不开启，默认为no</span>
appendfilename <span class="token string">&quot;appendonly.aof&quot;</span> <span class="token comment"># aof文件名称，默认为appendonly.aof</span>
<span class="token function">dir</span> ./ <span class="token comment"># aof文件所在目录，默认./，表示执行启动命令时所在的目录，比如我们在/opt目录中，去执行redis-server /etc/redis.conf 来启动redis，那么dir此时就是/opt目录</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果AOF和RDB同时开启，系统默认取AOF的数据（数据不会存在丢失）。</p><h3 id="_2-1、aof同步频率设置" tabindex="-1"><a class="header-anchor" href="#_2-1、aof同步频率设置"><span>2.1、AOF同步频率设置</span></a></h3><p>在redis.config中配置AOF同步的频率，通过配置appendfsync的值来进行配置</p><ul><li><p>appendfsync always：每次写入立即同步</p><p>始终同步，每次redis的写入都会立刻记入日志；性能较差但数据完整性比较好。</p></li><li><p>appendfsync everysec：每秒同步</p><p>每秒同步，每秒记录日志一次，如果宕机，本秒数据可能丢失；更新的命令会放在内存中AOF缓冲区， 每秒将缓冲区的命令追加到AOF文件</p></li><li><p>appendfsync no：不主动同步</p><p>redis不主动进行同步，把同步交给操作系统。</p></li></ul><h3 id="_2-2、aof的优劣势" tabindex="-1"><a class="header-anchor" href="#_2-2、aof的优劣势"><span>2.2、AOF的优劣势</span></a></h3><h4 id="_2-2-1、优势" tabindex="-1"><a class="header-anchor" href="#_2-2-1、优势"><span>2.2.1、优势</span></a></h4><ul><li>备份机制更稳健，丢失数据概率更低</li><li>可读的日志文本，通过操作AOF文件，可以处理误操作</li></ul><h4 id="_2-2-2、劣势" tabindex="-1"><a class="header-anchor" href="#_2-2-2、劣势"><span>2.2.2、劣势</span></a></h4><ul><li>比RDB占用更多的磁盘空间</li><li>恢复备份速度要慢</li><li>每次读写都同步的话，有一定的性能压力</li><li>存在个别bug，造成不能恢复</li></ul>`,53),d=[l];function r(t,p){return a(),s("div",null,d)}const h=e(i,[["render",r],["__file","持久化策略.html.vue"]]),u=JSON.parse('{"path":"/database/redis/%E6%8C%81%E4%B9%85%E5%8C%96%E7%AD%96%E7%95%A5.html","title":"redis的持久化","lang":"zh-CN","frontmatter":{"title":"redis的持久化","tags":["redis","数据库"],"order":"5","description":"redis的持久化 Redis是一个基于内存的数据库，它的数据是存放在内存中，内存有个问题就是关闭服务或者断电会丢失。 Redis的数据也支持写到硬盘中，这个过程就叫做持久化。 Redis提供了2种不同形式的持久化方式。 RDB（Redis DataBase） AOP（Append Of File） 1、RDB（Redis DataBase） 在指定的...","head":[["meta",{"property":"og:url","content":"https://gly-dragon.github.io/blog/blog/database/redis/%E6%8C%81%E4%B9%85%E5%8C%96%E7%AD%96%E7%95%A5.html"}],["meta",{"property":"og:site_name","content":"书元"}],["meta",{"property":"og:title","content":"redis的持久化"}],["meta",{"property":"og:description","content":"redis的持久化 Redis是一个基于内存的数据库，它的数据是存放在内存中，内存有个问题就是关闭服务或者断电会丢失。 Redis的数据也支持写到硬盘中，这个过程就叫做持久化。 Redis提供了2种不同形式的持久化方式。 RDB（Redis DataBase） AOP（Append Of File） 1、RDB（Redis DataBase） 在指定的..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-01T02:17:41.000Z"}],["meta",{"property":"article:author","content":"龙哥不管事"}],["meta",{"property":"article:tag","content":"redis"}],["meta",{"property":"article:tag","content":"数据库"}],["meta",{"property":"article:modified_time","content":"2024-04-01T02:17:41.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"redis的持久化\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-04-01T02:17:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"龙哥不管事\\",\\"url\\":\\"https://gly-dragon.github.io/blog/\\"}]}"]]},"headers":[{"level":2,"title":"1、RDB（Redis DataBase）","slug":"_1、rdb-redis-database","link":"#_1、rdb-redis-database","children":[{"level":3,"title":"1.1、Fork","slug":"_1-1、fork","link":"#_1-1、fork","children":[]},{"level":3,"title":"1.2、触发备份的方式","slug":"_1-2、触发备份的方式","link":"#_1-2、触发备份的方式","children":[]},{"level":3,"title":"1.3、redis.cof一些关于RDB的配置","slug":"_1-3、redis-cof一些关于rdb的配置","link":"#_1-3、redis-cof一些关于rdb的配置","children":[]},{"level":3,"title":"1.4、rdb的备份和恢复","slug":"_1-4、rdb的备份和恢复","link":"#_1-4、rdb的备份和恢复","children":[]},{"level":3,"title":"1.5、RDB的优劣势","slug":"_1-5、rdb的优劣势","link":"#_1-5、rdb的优劣势","children":[]},{"level":3,"title":"1.6、停止RDB","slug":"_1-6、停止rdb","link":"#_1-6、停止rdb","children":[]}]},{"level":2,"title":"2、AOF（Append Only File）","slug":"_2、aof-append-only-file","link":"#_2、aof-append-only-file","children":[{"level":3,"title":"2.1、AOF同步频率设置","slug":"_2-1、aof同步频率设置","link":"#_2-1、aof同步频率设置","children":[]},{"level":3,"title":"2.2、AOF的优劣势","slug":"_2-2、aof的优劣势","link":"#_2-2、aof的优劣势","children":[]}]}],"git":{"createdTime":1711937861000,"updatedTime":1711937861000,"contributors":[{"name":"龙哥不管事","email":"gly3498347531@163.com","commits":1}]},"readingTime":{"minutes":5.97,"words":1790},"filePathRelative":"database/redis/持久化策略.md","localizedDate":"2024年4月1日","excerpt":"\\n<p>Redis是一个基于内存的数据库，它的数据是存放在内存中，内存有个问题就是关闭服务或者断电会丢失。</p>\\n<p>Redis的数据也支持写到硬盘中，这个过程就叫做持久化。</p>\\n<p>Redis提供了2种不同形式的持久化方式。</p>\\n<ul>\\n<li>RDB（Redis DataBase）</li>\\n<li>AOP（Append Of File）</li>\\n</ul>\\n<h2>1、RDB（Redis DataBase）</h2>\\n<p>在指定的时间间隔内将内存中的数据集快照写入磁盘，也就是行话讲的Snapshot快照，它恢复时是将快照文件直接读到内存里。</p>\\n<p>**备份执行原理：**Redis会单独创建（fork）一个子进程进行持久化，会先将数据写入到一个临时文件中，待持久化过程都 结束后，再用这个临时文件替换上次持久化好的文件。整个过程中，主进程是不进行任何IO操作的，这 就是确保了极高的性能，如果需要进行大规模的恢复，且对数据恢复的完整性不是非常敏感，那RDB方式要比AOF方式更加的高效。RDB的缺点是最后一次持久化后的数据可能丢失。</p>","autoDesc":true}');export{h as comp,u as data};
