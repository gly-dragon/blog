import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,o as a,a as e}from"./app-CKhZ0qjf.js";const t={},n=e(`<p>原型模式是用于创建重复的对象，同时又能保证性能。该模式实现了一个原型接口，该接口用于创建当前对象的克隆。类的初始化或者通过<code>new</code>关键字实例化对象需要消耗非常多的资源或者很繁琐，原型模式是在内存二进制流的拷贝，要比直接实例化一个对象性能好很多。</p><p>Object 类中有一个 clone()方法，用于生成一个新的对象，当然，如果我们要调用这个方法，java 要求我们的类必须先<strong>实现 Cloneable 接口</strong> ，此接口没有定义任何方法，但是不这么做的话，在 clone() 的时候，会抛出 CloneNotSupportedException 异常。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">protected</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> native</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> Object</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> clone</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">() throws CloneNotSupportedException</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p>java 的克隆是浅克隆，碰到对象引用的时候，克隆出来的对象和原对象中的引用将指向同一个对象。通常实现深克隆的方法是将对象进行序列化，然后再进行反序列化。</p></blockquote><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> abstract</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> Shape</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;"> implements</span><span style="--shiki-light:#6F42C1;--shiki-dark:#E5C07B;"> Cloneable</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;"> Object</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> clone</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">      Object</span><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;"> clone</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">      try</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">         clone </span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#E5C07B;"> super</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">clone</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">      } </span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">catch</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">CloneNotSupportedException</span><span style="--shiki-light:#E36209;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> e</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E5C07B;">         e</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">printStackTrace</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">      }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> clone;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),l=[n];function h(p,k){return a(),s("div",null,l)}const o=i(t,[["render",h],["__file","原型模式.html.vue"]]),c=JSON.parse('{"path":"/%E8%BF%9B%E9%98%B6/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E5%88%9B%E5%BB%BA%E5%9E%8B/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F.html","title":"原型模式","lang":"zh-CN","frontmatter":{"title":"原型模式","description":"原型模式是用于创建重复的对象，同时又能保证性能。该模式实现了一个原型接口，该接口用于创建当前对象的克隆。类的初始化或者通过new关键字实例化对象需要消耗非常多的资源或者很繁琐，原型模式是在内存二进制流的拷贝，要比直接实例化一个对象性能好很多。 Object 类中有一个 clone()方法，用于生成一个新的对象，当然，如果我们要调用这个方法，java 要...","head":[["meta",{"property":"og:url","content":"https://gly-dragon.github.io/blog/blog/%E8%BF%9B%E9%98%B6/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E5%88%9B%E5%BB%BA%E5%9E%8B/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F.html"}],["meta",{"property":"og:site_name","content":"龙哥不管事"}],["meta",{"property":"og:title","content":"原型模式"}],["meta",{"property":"og:description","content":"原型模式是用于创建重复的对象，同时又能保证性能。该模式实现了一个原型接口，该接口用于创建当前对象的克隆。类的初始化或者通过new关键字实例化对象需要消耗非常多的资源或者很繁琐，原型模式是在内存二进制流的拷贝，要比直接实例化一个对象性能好很多。 Object 类中有一个 clone()方法，用于生成一个新的对象，当然，如果我们要调用这个方法，java 要..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-06T02:18:29.000Z"}],["meta",{"property":"article:author","content":"龙哥不管事"}],["meta",{"property":"article:modified_time","content":"2024-09-06T02:18:29.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"原型模式\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-09-06T02:18:29.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"龙哥不管事\\",\\"url\\":\\"https://gly-dragon.github.io/blog/\\"}]}"]]},"headers":[],"git":{"createdTime":1720167657000,"updatedTime":1725589109000,"contributors":[{"name":"龙哥不管事","email":"gly3498347531@163.com","commits":2}]},"readingTime":{"minutes":0.97,"words":291},"filePathRelative":"进阶/设计模式/创建型/原型模式.md","localizedDate":"2024年7月5日","excerpt":"<p>原型模式是用于创建重复的对象，同时又能保证性能。该模式实现了一个原型接口，该接口用于创建当前对象的克隆。类的初始化或者通过<code>new</code>关键字实例化对象需要消耗非常多的资源或者很繁琐，原型模式是在内存二进制流的拷贝，要比直接实例化一个对象性能好很多。</p>\\n<p>Object 类中有一个 clone()方法，用于生成一个新的对象，当然，如果我们要调用这个方法，java 要求我们的类必须先<strong>实现 Cloneable 接口</strong> ，此接口没有定义任何方法，但是不这么做的话，在 clone() 的时候，会抛出 CloneNotSupportedException 异常。</p>","autoDesc":true}');export{o as comp,c as data};
