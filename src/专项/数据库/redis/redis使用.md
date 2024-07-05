---
title: redis使用
tags:
  - redis
  - 数据库
order: "9"
---

## 1、在不同项目中使用 redis

使用代码连接 redis 时，如果不使用 jedis 连接池，则直接创建 jedis 对象，指定主机地址和端口号即可：

```java
Jedis jedis = new Jedis("192.168.170.131", 6379);
```

该笔记一下内容均为使用 jedis 连接池版本配置。

### 1.1、spring 中使用 redis

spring 项目中使用 redis，无论是使用单机版还是使用集群版都需要添加 jedis 和 commons-pool2 的 jar 包，如果是普通的 java 项目，则把这两个 jar 包放到 lib 文件夹里面直接添加即可，如果是 maven 项目，那么需要在 pom 文件中配置依赖：

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

#### 1.1.1、使用单机版 redis

1. 添加 application-redis.xml 文件，并配置相关信息

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

1. 创建 JedisClient 接口，按需封装一组操作 redis 数据的方法

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

1. 创建 JedisClientSingle（单击版 jedis 客户端），实现 JedisClient 接口，用于获得连接，并把数据存入到 redis 中。

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

1. 在 service 层的方法中使用单机版的客户端连接 redis 并操作数据

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

   以上案例中使用了双检锁来处理在高并发环境下缓存击穿的问题，如果只是单纯的需要使用 jedis 来操作 redis，则只需要调用 jedis 的方法并传入相应的参数即可。

   ```java
    String json = jedisClient.hget("redis_j54_singleton", pid);
   ```

#### 1.1.2、使用集群版 redis

1. 添加 application-redis.xml 文件，并添加相关配置。

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

1. 创建 JedisClientCluster 类实现 JedisClient 接口，该接口创建见上述单机版创建的第二步

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

1. 在 service 层的使用和单击版一样，只是注入的 jedisClient 不同

   ```java
    @Autowired
    @Qualifier("jedisClientCluster")
    private JedisClient jedisClient;
   ```

### 1.2、springboot 中使用 redis

#### 1.2.1、使用单机版 redis

1. 创建项目，创建 springboot 项目，在创建时可以直接导入 noSQL 中的 redis Drive，或者在 pom 文件中配置：

   ```xml
   <dependency>
   	<groupId>org.springframework.boot</groupId>
   	<artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

2. 在 application.yml 中配置 redis 的连接信息

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

3. 使用 redis 进行缓存

   在 springboot 中使用 redis 进行缓存有两种方式，分别是使用 redis 的注解和使用 RedisTemplate 的模板

   **方式一：** 使用 redis 注解，该方法需要在启动类配置 redis 缓存管理，`@EnableCaching`启用 redis 注解，然后在业务类中需要使用 redis 缓存的方法上加上`@Cacheable`注解即可。

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

   该方式的缓存原理是生成的缓存名为：注解参数::方法参数，比如该案例中如果传入的 id 值为 1，那么生成的缓存名，即 key 为`springboot::1`。但是该方法在高并发的环境中会发送缓存击穿的情况并不适合使用，因此在高并发的环境下一般使用的是方式二。

   **方式二：** 使用 RedisTemplate 模板进行配置，该方法需要自己指定 key 的值并且需要处理 key 可能存在的乱码问题，应用也比较繁琐，但是由于加入了双检锁，所以在高并发的环境下也可以使用，不会发送缓存击穿的情况。

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

#### 1.2.2、使用集群版 redis

1. 使用集群版 redis 需要导入 jedis 的依赖，导入了 jedis 依赖就不需要导入单击版中导入过的 redis 依赖。

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

1. 在 application.yml 文件中配置集群的连接信息

   ```yaml
   spring:
   	redis:
   		 cluster:
   		 #配置集群的主机地址和端口号，格式		ip：端口号
   		 	nodes: 192.168.170.131:7001,192.168.170.131:7002,192.168.170.131:7003,192.168.170.131:7004,192.168.170.131:7005,192.168.170.131:7006
   ```

1. 在配置类中配置集群的信息，并创建集群

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

   在 services 实现类中存储数据时需要自己指定 key，如果存入的是对象类型，可以转换成 json 类型进行存储。

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

   > **注意：** 以上代码使用了 json 工具类进行转换，所以在使用时需要引入 json 工具类才可以使用

### 1.3、使用 jedis 操作 redis

Jedis 是 java 开发的操作 redis 的工具包。使用 jedis 需要添加 jedis 的架包。如果是 maven 项目，直接在 pom 文件中导入即可：

```xml
<dependency>
	<groupId>redis.clients</groupId>
	<artifactId>jedis</artifactId>
	<version>2.7.0</version>
</dependency>
```

#### 1.3.1、jedis 主要方法

jedis 提供了一组操作 redis 的方法，比如添加字符串的方法是：`jedis.set("键","值")`。

以下示例描述一部分 jedis 的方法以及使用

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

### 1.4、使用 RedisTemplate 工具类操作 redis

在 springboot 中使用 RedisTemplate 操作 redis 时，需要注入 RedisTemplate 对象，使用自动注入即可

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

#### 1.4.1、RedisTemplate 示例代码

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

实际使用中不需要使用 this 关键字仍可以正常使用，详情看 sprigboot 中使用 redis 单机版。
