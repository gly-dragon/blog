---
title: Redis简介
index: false
tags:
  - redis
  - 数据库
dir:
  text: Redis
  link: true
---

## 介绍

REmote DIctionary Server(Redis) 是一个由 Salvatore Sanfilippo 写的 key-value 存储系统，是跨平台的非关系型数据库。

Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内存、分布式、可选持久性的键值对(Key-Value)存储数据库，并提供多种语言的 API。

Redis 通常被称为数据结构服务器，因为值（value）可以是字符串(String)、哈希(Hash)、列表(list)、集合(sets)和有序集合(sorted sets)等类型。

## 资源链接

- Redis 官网：[https://redis.io](https://redis.io)
- 源码地址：[https://github.com/redis/redis](https://github.com/redis/redis)
- Redis 命令参考：[http://doc.redisfans.com](http://doc.redisfans.com)

## redis 基本概念

redis 是一种非关系型数据库（NoSQL），非关系型数据库没有表的概念，数据是直接存储在内存中，所以它的速度会更快。

关系型数据库和非关系型数据库的区别：

1. 关系型数据库通过“表”来存储数据，非关系型数据库没有表的概念
1. 非关系型数据库数据是直接存储在内存中
1. 关系型数据库安全性高，性能差，非关系型数据库性能好但是安全性差

**redis**是基于键值对一种非关系型数据库，数据存储在内存中，主要是存储一些比较重要的信息，例如:用户的身份信息，以及抢购、秒杀之类的操作，主要应用场景是在高并发环境下缓解服务器压力或者在分布式系统中用来存放用户的身份信息。

## 安装 redis

### 使用压缩包安装

1. 首先在[redis 官网下载地址](https://download.redis.io/releases/)上下载 redis 的安装包。

1. 将 redis 的安装包上传到 linux 中并进行解压

   ```shell
   tar -xvPf /software/redis-3.0.0.tar.gz -C /usr/local/software/
   ```

1. redis 是使用 C 语言进行编写的，如果没有安装 C 语言的运行环境，需要先安装 C 语言的运行环境，如果已经安装，跳过该步骤。此处使用联网安装 C 语言

   ```shell
   yum install gcc-c++
   ```

1. 构建 redis，进入/usr/local/software/redis-3.0.0 目录执行 make 命令即可构建 redis

   ```shell
   make
   ```

1. 安装 redis，构建完成后在/usr/local/software/redis-3.0.0 目录下执行安装命令

   ```shell
   make install PREFIX=/usr/local/software/redis
   ```

   执行成功后在/usr/local/software/目录下产生一个 redis 的文件夹，该文件夹中的 bin 目录包括一组 redis 的使用程序，至此 redis 安装完成。

### 使用 docker 安装 redis（推荐）

使用压缩包安装 redis 流程较为繁琐，所以可以在 redis 中使用 docker 进行安装，但是如果没有安装 docker 需要先安装 docker。docker 联网安装命令：

```shell
yum install docker
```

安装了 docker 之后启动 docker，只需要执行安装 redis 的命令即可。

```shell
docker pull redis
```

拉取成功后执行命令创建 docker 容器，即 redis 程序

```shell
docker run -p 6379:6379 -d redis
```

> **注意：** 无论是使用压缩包安装还是使用 docker 进行安装，都需要注册 linux 防火墙才可以使用，注册 linux 防火墙：
>
> ```
> firewall-cmd --zone=public --add-port=6379/tcp --permanent
> ```
>
> 注册防火墙后需要重启防火墙：
>
> ```
> firewall-cmd --reload
> ```

## 启动 redis

对于直接安装在 linux 中的 redis 可以使用两种方式进行启动：

1. 前台启动：进入 redis 安装目录中的 bin 目录，即/usr/local/software/redis/bin，执行命令即可：

   ```
   ./redis-server
   ```

   使用该方式启动后该控制台就不能再执行其他命令，如果要执行其他命令，需要重新打开一个控制台窗口，较为麻烦，所以一般情况下，使用后台启动更方便。

1. 后台启动（推荐使用）：

   后台启动在启动后该控制台窗口依然可以继续编写其他命令，但是后台使用后台启动需要一定的配置：

   - 复制 redis 的配置文件（安装后的 bin 目录中并没有 redis 的配置文件，配置文件需要到安装程序中去复制，即将/usr/local/software/redis-3.0.0 目录下 redis.conf 文件复制到/usr/local/software/redis/bin 目录中

     ```
     cp /usr/local/software/redis-3.0.0/redis.conf /usr/local/software/redis/bin
     ```

   - 修改配置文件（redis.conf）中的一些信息：

     使用编辑命令（vi redis.conf）进入该文件，修改 daemonize no 为 daemonize yes

     ```
     vi redis.conf
     ```

   - 在 bin 目录中执行命令后台启动 redis

     ```
     ./redis-server redis.conf
     ```

如果是使用 docker 进行安装的，需要在保持 docker 运行的情况下执行命令启动

```
docker start 6a54231d1277 #6a54231d1277是docker容器的id，并不一定，可以使用docker ps查看redis的id
```

## 访问 redis

访问 redis 服务器一共有三种方式，分别是使用 redis 客户端和 redis 桌面管理工具以及使用代码连接

1. 使用 redis 客户端建立连接

   redis 客户端在 redis 的 bin 目录（redis-cli)中，进入该目录执行命令启动即可

   ```
   ./redis-cli
   ```

   执行`exit`命令即可退出客户端。

2. 使用 redis 的桌面管理工具，在 Windows 下直接连接 linux 中的 redis，但是要求端口号必须已经注册，如果没有安装 redis 桌面管理工具，需要先安装 redis 桌面管理程序。

3. 使用代码连接

   可以使用 jedis 连接 redis，jedis 是 java 代码连接 redis 的一种技术，在 spring 生态中也提供了不少类似的连接架包。
