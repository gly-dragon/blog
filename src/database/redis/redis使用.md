---
title: redis使用
tags:
  - redis
  - 数据库
order: "9"
---
## 1、在不同项目中使用redis

使用代码连接redis时，如果不使用jedis连接池，则直接创建jedis对象，指定主机地址和端口号即可：

```java
Jedis jedis = new Jedis("192.168.170.131", 6379);
```

该笔记一下内容均为使用jedis连接池版本配置。

### 1.1、spring中使用redis

spring项目中使用redis，无论是使用单机版还是使用集群版都需要添加jedis和commons-pool2的jar包，如果是普通的java项目，则把这两个jar包放到lib文件夹里面直接添加即可，如果是maven项目，那么需要在pom文件中配置依赖：

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.7.0</version>
</dependency>

<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
    <version>2.7.0</version>
</dependency>
```

#### 1.1.1、使用单机版redis

1. 添加application-redis.xml文件，并配置相关信息

   ```xml
   <!-- ################ 配置Redis单机版 #################-->
   <!--jedis连接池配置信息-->
   <bean class="redis.clients.jedis.JedisPoolConfig" id="jedisPoolConfig">
       <!--最小闲置连接数-->
       <property name="minIdle" value="10"/>
       <!--最大闲置连接数-->
       <property name="maxIdle" value="100"/>
       <!--最大允许多少连接同时访问-->
       <property name="maxTotal" value="1000"/>
       <!--最大等待时间-->
       <property name="maxWaitMillis" value="3000"/>
       <!--销毁多余连接的时间-->
       <property name="softMinEvictableIdleTimeMillis" value="3000"/>
   </bean>
   
   <!--创建jedis连接池-->
   <bean class="redis.clients.jedis.JedisPool" id="jedisPool">
       <!--注入连接池配置类-->
       <constructor-arg name="poolConfig" ref="jedisPoolConfig"/>
       <!--注入主机地址-->
       <constructor-arg name="host" value="192.168.170.131"/>
       <!--注入端口号-->
       <constructor-arg name="port" value="6379"/>
   </bean>
   ```

1. 创建JedisClient接口，按需封装一组操作redis数据的方法

   ```java
   package org.java.redis;
   
   public interface JedisClient {
   
       //字符串类型的存储
       void set(String key, String value);
   
       //字符串类型的读取
       String get(String key);
   
       //hash类型的存储
       void hset(String key, String field, String value);
   
       //hash类型的读取
       String hget(String key, String field);
   
       //hash类型的删除
       void hdel(String key, String field);
   }
   ```

1. 创建JedisClientSingle（单击版jedis客户端），实现JedisClient接口，用于获得连接，并把数据存入到redis中。

   ```java
   package org.java.redis.impl;
   
   import org.java.redis.JedisClient;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.stereotype.Component;
   import redis.clients.jedis.Jedis;
   import redis.clients.jedis.JedisPool;
   
   @Component("jedisClientSingle")//标识组件，用于扫描
   public class JedisClientSingle implements JedisClient {
   
       //Jedis连接池，它可以产生jedis
       @Autowired
       private JedisPool jedisPool;
   
       @Override
       public void set(String key, String value) {
           //通过连接池产生jedis
           Jedis jedis = jedisPool.getResource();
           jedis.set(key,value);
           //关闭jedi-------此处的关闭，并不会释放资源，只是将用完的连接放回到连接池，该连接是可以继续使用的
           jedis.close();
       }
   
       @Override
       public String get(String key) {
           Jedis jedis = jedisPool.getResource();
           String value = jedis.get(key);
           jedis.close();
           return value;
       }
   
       @Override
       public void hset(String key, String field, String value) {
           Jedis jedis = jedisPool.getResource();
           jedis.hset(key,field,value);
           jedis.close();
       }
   
       @Override
       public String hget(String key, String field) {
           Jedis jedis = jedisPool.getResource();
           String value = jedis.hget(key, field);
           jedis.close();
           return value;
       }
   
       @Override
       public void hdel(String key, String field) {
           Jedis jedis = jedisPool.getResource();
           jedis.hdel(key,field);
           jedis.close();
       }
   }
   ```

1. 在service层的方法中使用单机版的客户端连接redis并操作数据

   ```java
   package org.java.service.impl;
   
   import org.java.dao.PrdMapper;
   import org.java.entity.Prd;
   import org.java.redis.JedisClient;
   import org.java.service.PrdService;
   import org.java.util.JsonUtils;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.beans.factory.annotation.Qualifier;
   import org.springframework.stereotype.Service;
   import org.springframework.util.StringUtils;
   
   import java.util.List;
   
   @Service
   public class PrdServiceImpl implements PrdService {
       @Autowired
       private PrdMapper mapper;
   
       @Autowired
       @Qualifier("jedisClientSingle")
       private JedisClient jedisClient;
   
       @Override
       public Prd findById(String pid) {
           //首先判断缓存中有没有需要的数据
           String json = jedisClient.hget("redis_j54_singleton", pid); //在同步块的外面查询，50个线程会并发执行
           if(StringUtils.isEmpty(json)){
               //如果为空，表示缓存中没有需要的数据，第一批的50个线程都要准备查询数据库
               synchronized (this){//同步锁，这里面的代码，每一次只允许运行一个线程
                   //再一次查询缓存.此时，由于代码包含在同步锁中，每一次只能有一个线程运行
                   json = jedisClient.hget("redis_j54_singleton", pid);
                   //再一次判断是否查询到结果
                   if(StringUtils.isEmpty(json)){
                       //表示还没有线程查询过数据库，缓存中依然没有需要的数据-------------准备查询数据
                       System.out.println("-------------------------从数据库库查询数据----"+pid);
                       Prd prd = mapper.findById(pid);
                       //将查询到的Prd转换成json,放入到redis
                       json  = JsonUtils.objectToJson(prd);
                       jedisClient.hset("redis_j54_singleton",pid,json);
                       return prd;
                   }else{
                       //如果json不为空，表示，已经线程查询了数据库，并且把数据放入到了缓存在中，就不需要再查询数据库，直接返回缓存中的数据即可
                       System.out.println("-----------------------------从缓存中加载数据----------"+pid);
                       //将查询到的json转换成实体对象
                       Prd prd = JsonUtils.jsonToPojo(json,Prd.class);
                       return  prd;
                   }
               }
           }else{
               //如果不为空，表示，缓存中，已经找到需要的数据
               System.out.println("-----------------------------从缓存中加载数据----------"+pid);
               //将查询到的json转换成实体对象
               Prd prd = JsonUtils.jsonToPojo(json,Prd.class);
               return  prd;
           }
       }
   }
   ```

   以上案例中使用了双检锁来处理在高并发环境下缓存击穿的问题，如果只是单纯的需要使用jedis来操作redis，则只需要调用jedis的方法并传入相应的参数即可。

   ```java
    String json = jedisClient.hget("redis_j54_singleton", pid); 
   ```

#### 1.1.2、使用集群版redis

1. 添加application-redis.xml文件，并添加相关配置。

   ```xml
   <!-- ################ 配置Redis集群版 #################-->
   <!--jedis连接池配置信息-->
   <bean class="redis.clients.jedis.JedisPoolConfig" id="jedisPoolConfig">
       <!--最小闲置连接数-->
       <property name="minIdle" value="10"/>
       <!--最大闲置连接数-->
       <property name="maxIdle" value="100"/>
       <!--最大允许多少连接同时访问-->
       <property name="maxTotal" value="1000"/>
       <!--最大等待时间-->
       <property name="maxWaitMillis" value="3000"/>
       <!--销毁多余连接的时间-->
       <property name="softMinEvictableIdleTimeMillis" value="3000"/>
   </bean>
   
   <!--使用的是集群版的jedis对象-->
   <bean class="redis.clients.jedis.JedisCluster">
       <!--注入redis服务器-->
       <constructor-arg index="0" name="nodes">
           <set>
               <!--具体的redis服务器地址和端口号-->
               <bean class="redis.clients.jedis.HostAndPort">
                   <constructor-arg name="host" value="192.168.170.131"/>
                   <constructor-arg name="port" value="7001"/>
               </bean>
               <bean class="redis.clients.jedis.HostAndPort">
                   <constructor-arg name="host" value="192.168.170.131"/>
                   <constructor-arg name="port" value="7002"/>
               </bean>
               <bean class="redis.clients.jedis.HostAndPort">
                   <constructor-arg name="host" value="192.168.170.131"/>
                   <constructor-arg name="port" value="7003"/>
               </bean>
               <bean class="redis.clients.jedis.HostAndPort">
                   <constructor-arg name="host" value="192.168.170.131"/>
                   <constructor-arg name="port" value="7004"/>
               </bean>
               <bean class="redis.clients.jedis.HostAndPort">
                   <constructor-arg name="host" value="192.168.170.131"/>
                   <constructor-arg name="port" value="7005"/>
               </bean>
               <bean class="redis.clients.jedis.HostAndPort">
                   <constructor-arg name="host" value="192.168.170.131"/>
                   <constructor-arg name="port" value="7006"/>
               </bean>
           </set>
       </constructor-arg>
       <!--指定连接池的配置信息-->
       <constructor-arg index="1" name="poolConfig" ref="jedisPoolConfig"/>
   </bean>
   ```

1. 创建JedisClientCluster类实现JedisClient接口，该接口创建见上述单机版创建的第二步

   ```java
   package org.java.redis.impl;
   
   import org.java.redis.JedisClient;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.stereotype.Component;
   import redis.clients.jedis.JedisCluster;
   
   @Component("jedisClientCluster")
   public class JedisClientCluster implements JedisClient {
   
   	@Autowired
   	private JedisCluster jedisCluster;
   
   	@Override
   	public void set(String key, String value) {
   		jedisCluster.set(key,value);
   	}
   
   	@Override
   	public String get(String key) {
   		return jedisCluster.get(key);
   	}
   
   	@Override
   	public void hset(String key, String field, String value) {
   		jedisCluster.hset(key,field,value);
   	}
   
   	@Override
   	public String hget(String key, String field) {
   		return jedisCluster.hget(key,field);
   	}
   
   	@Override
   	public void hdel(String key, String field) {
   		jedisCluster.hdel(key,field);
   	}
   }
   ```

1. 在service层的使用和单击版一样，只是注入的jedisClient不同

   ```java
    @Autowired
    @Qualifier("jedisClientCluster")
    private JedisClient jedisClient;
   ```

### 1.2、springboot中使用redis

#### 1.2.1、使用单机版redis

1. 创建项目，创建springboot项目，在创建时可以直接导入noSQL中的redis  Drive，或者在pom文件中配置：

   ```xml
   <dependency>
   	<groupId>org.springframework.boot</groupId>
   	<artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

2. 在application.yml中配置redis的连接信息

   ```yaml
   spring:
       redis:
           host: 192.168.233.135 #连接地址
           port: 6379 #端口号
               jedis:
                   pool:
                       min-idle: 10 #最小闲置连接数
                       max-idle: 50 #最大闲置连接数
                       max-active: 100 #最大活动连接数（允许多个人同时连接）
                       max-wait: 3s #最大等待时间（秒）
                       time-between-eviction-runs: 3000ms #闲置连接超过上限，将闲置3秒以上多余连接销毁
   ```

3. 使用redis进行缓存

   在springboot中使用redis进行缓存有两种方式，分别是使用redis的注解和使用RedisTemplate的模板

   **方式一：**使用redis注解，该方法需要在启动类配置redis缓存管理，`@EnableCaching`启用redis注解，然后在业务类中需要使用redis缓存的方法上加上`@Cacheable`注解即可。

   ```java
   @SpringBootApplication
   @MapperScan(basePackages = "org.java.dao")
   //@EnableCaching //启用缓存管理
   public class Springboot41Application {
   	public static void main(String[] args) {
   		SpringApplication.run(Springboot41Application.class, args);
   	}
   }
   ```

   ```java
   @Override
   @Cacheable("springboot")
   public Inf findById(Integer id) {
       return infMapper.selectByPrimaryKey(id);
   }
   ```

   该方式的缓存原理是生成的缓存名为：注解参数::方法参数，比如该案例中如果传入的id值为1，那么生成的缓存名，即key为`springboot::1`。但是该方法在高并发的环境中会发送缓存击穿的情况并不适合使用，因此在高并发的环境下一般使用的是方式二。

   **方式二：**使用RedisTemplate模板进行配置，该方法需要自己指定key的值并且需要处理key可能存在的乱码问题，应用也比较繁琐，但是由于加入了双检锁，所以在高并发的环境下也可以使用，不会发送缓存击穿的情况。

   ```java
   @Autowired
   private RedisTemplate<Object, Object> redisTemplate;
   
   @Override
   @Cacheable("springboot")
   public Inf findById(Integer id) {
       //指定redis序列化的方式，如果不指定，用工具查询key会乱码
       RedisSerializer redisSerializer = new StringRedisSerializer();
       //指定redisTemplate采用哪种序列化方式设置key
       redisTemplate.setKeySerializer(redisSerializer);
       //从redis中查询指定名称的数据
       HashOperations<Object, Object, Object> ops = redisTemplate.opsForHash();//得到一个hash类型的数据对象
       Inf inf = (Inf) ops.get("springboot", id);
       if (inf == null) {
           synchronized (this) {
               inf = (Inf) ops.get("springboot", id);
               if (inf == null) {
                   inf = infMapper.selectByPrimaryKey(id);
                   ops.put("springboot", id, inf);
               }
               return inf;
           }
       } else {
           return inf;
       }
   }
   ```

#### 1.2.2、使用集群版redis

1. 使用集群版redis需要导入jedis的依赖，导入了jedis依赖就不需要导入单击版中导入过的redis依赖。

   ```xml
   <dependency>
       <groupId>redis.clients</groupId>
       <artifactId>jedis</artifactId>
   </dependency>
   ```

   不需要导入

   ```xml
   <dependency>
   	<groupId>org.springframework.boot</groupId>
   	<artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

1. 在application.yml文件中配置集群的连接信息

   ```yaml
   spring:
   	redis:
   		 cluster:
   		 #配置集群的主机地址和端口号，格式		ip：端口号
   		 	nodes: 192.168.170.131:7001,192.168.170.131:7002,192.168.170.131:7003,192.168.170.131:7004,192.168.170.131:7005,192.168.170.131:7006
   ```

3. 在配置类中配置集群的信息，并创建集群

   ```java
   package org.java.conf;
   
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import redis.clients.jedis.HostAndPort;
   import redis.clients.jedis.JedisCluster;
   
   import java.util.HashSet;
   import java.util.Set;
   
   @Configuration //标识是一个配置类
   public class RedisConfig {
   	@Value("${spring.redis.cluster.nodes}")
   	private String nodes;
   
   	@Bean
   	public JedisCluster jedisCluster() {
   		//创建set集合，存放主机信息
   		Set<HostAndPort> set = new HashSet<>();
   		//获得每个主机的信息（地址：端口号）
   		String[] node = nodes.split(",");
   		//对每一个服务器的主机信息，端口号进行分割
   		for (String hp : node) {
   			String[] h = hp.split(":");
   			HostAndPort server = new HostAndPort(h[0], Integer.parseInt(h[1]));
   			set.add(server);
   		}
   		//根据set中的主机信息创建集群
   		JedisCluster jc = new JedisCluster(set);
   		return jc;
   	}
   }
   
   ```

   在services实现类中存储数据时需要自己指定key，如果存入的是对象类型，可以转换成json类型进行存储。

   ```java
   @Autowired
   private JedisCluster jedisCluster;
   
   //集群版配置
   @Override
   public Inf findById(Integer id) {
   	//从 redis中获得数据
   	String json = jedisCluster.hget("springboot_4_1", id.toString());
   	Inf inf;
   	if (json == null) {
   		inf = infMapper.selectByPrimaryKey(id);
   		jedisCluster.hset("springboot_4_1", id.toString(), JsonUtils.objectToJson(inf));
   	} else {
   		inf = JsonUtils.jsonToPojo(json, Inf.class);
   	}
   	return inf;
   }
   ```

   > **注意：**以上代码使用了json工具类进行转换，所以在使用时需要引入json工具类才可以使用

### 1.3、使用jedis操作redis

Jedis是java开发的操作redis的工具包。使用jedis需要添加jedis的架包。如果是maven项目，直接在pom文件中导入即可：

```xml
<dependency>
	<groupId>redis.clients</groupId>
	<artifactId>jedis</artifactId>
	<version>2.7.0</version>
</dependency>
```

#### 1.3.1、jedis主要方法

jedis提供了一组操作redis的方法，比如添加字符串的方法是：`jedis.set("键","值")`。

以下示例描述一部分jedis的方法以及使用

```java
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

public class JedisDemo {
    Jedis jedis;
    
    @Before
    public void before() {
    	this.jedis = new Jedis("192.168.200.129", 6379);
    }
    
    @After
    public void after() {
        //关闭jedis
        this.jedis.close();
    }
    
    /**
    * 测试redis是否连通
    */
    @Test
    public void test1() {
        String ping = jedis.ping();
        System.out.println(ping);
    }
    
    /**
    * string类型测试
    */
    @Test
    public void stringTest() {
        jedis.set("site", "http://www.itsoku.com");
        System.out.println(jedis.get("site"));
        System.out.println(jedis.ttl("site"));
    }
    
    /**
    * list类型测试
    */
    @Test
    public void listTest() {
        jedis.rpush("courses", "java", "spring", "springmvc", "springboot");
        List<String> courses = jedis.lrange("courses", 0, -1);
        for (String course : courses) {
        	System.out.println(course);
        }
    }
    
    /**
    * set类型测试
    */
    @Test
    public void setTest() {
        jedis.sadd("users", "tom", "jack", "ready");
        Set<String> users = jedis.smembers("users");
        for (String user : users) {
        	System.out.println(user);
        }
    }
    
    /**
    * hash类型测试
    */
    @Test
    public void hashTest() {
        jedis.hset("user:1001", "id", "1001");
        jedis.hset("user:1001", "name", "张三");
        jedis.hset("user:1001", "age", "30");
        Map<String, String> userMap = jedis.hgetAll("user:1001");
        System.out.println(userMap);
    }
    
    /**
    * zset类型测试
    */
    @Test
    public void zsetTest() {
        jedis.zadd("languages", 100d, "java");
        jedis.zadd("languages", 95d, "c");
        jedis.zadd("languages", 70d, "php");
        List<String> languages = jedis.zrange("languages", 0, -1);
        System.out.println(languages);
    }
    
    /**
    * 订阅消息
    *
    * @throws InterruptedException
    */
    @Test
    public void subscribeTest() throws InterruptedException {
        //subscribe(消息监听器,频道列表)
        jedis.subscribe(new JedisPubSub() {
            @Override
            public void onMessage(String channel, String message) {
            System.out.println(channel + ":" + message);
            }
        }, "sitemsg");
        TimeUnit.HOURS.sleep(1);
    }
    
    /**
    * 发布消息
    *
    * @throws InterruptedException
    */
    @Test
    public void publishTest() {
    	jedis.publish("sitemsg", "hello redis");
    }
}
```

### 1.4、使用RedisTemplate工具类操作redis

在springboot中使用RedisTemplate操作redis时，需要注入RedisTemplate对象，使用自动注入即可

```java
@Autowired
private RedisTemplate<String, String> redisTemplate;
// 用下面5个对象来操作对应的类型
this.redisTemplate.opsForValue(); //提供了操作string类型的所有方法
this.redisTemplate.opsForList(); // 提供了操作list类型的所有方法
this.redisTemplate.opsForSet(); //提供了操作set的所有方法
this.redisTemplate.opsForHash(); //提供了操作hash表的所有方法
this.redisTemplate.opsForZSet(); //提供了操作zset的所有方法
```

#### 1.4.1、RedisTemplate示例代码

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/redis")
public class RedisController {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @RequestMapping("/stringTest")
    public String stringTest() {
        this.redisTemplate.delete("name");
        this.redisTemplate.opsForValue().set("name", "路人");
        String name = this.redisTemplate.opsForValue().get("name");
        return name;
    }
    
    @RequestMapping("/listTest")
    public List<String> listTest() {
        this.redisTemplate.delete("names");
        this.redisTemplate.opsForList().rightPushAll("names", "刘德华", "张学友","郭富城", "黎明");
        List<String> courses = this.redisTemplate.opsForList().range("names", 0,-1);
        return courses;
    }
    
    @RequestMapping("setTest")
    public Set<String> setTest() {
        this.redisTemplate.delete("courses");
        this.redisTemplate.opsForSet().add("courses", "java", "spring","springboot");
        Set<String> courses = this.redisTemplate.opsForSet().members("courses");
        return courses;
    }
    
    @RequestMapping("hashTest")
    public Map<Object, Object> hashTest() {
        this.redisTemplate.delete("userMap");
        Map<String, String> map = new HashMap<>();
        map.put("name", "路人");
        map.put("age", "30");
        this.redisTemplate.opsForHash().putAll("userMap", map);
        Map<Object, Object> userMap = this.redisTemplate.opsForHash().entries("userMap");
    return userMap;
    }
    
    @RequestMapping("zsetTest")
    public Set<String> zsetTest() {
        this.redisTemplate.delete("languages");
        this.redisTemplate.opsForZSet().add("languages", "java", 100d);
        this.redisTemplate.opsForZSet().add("languages", "c", 95d);
        this.redisTemplate.opsForZSet().add("languages", "php", 70);
        Set<String> languages =
        this.redisTemplate.opsForZSet().range("languages", 0, -1);
        return languages;
    }
}
```

实际使用中不需要使用this关键字仍可以正常使用，详情看sprigboot中使用redis单机版。