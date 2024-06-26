---
title: Redis配置
order: 1
---

Redis 的配置文件位于 Redis 安装目录下，文件名为 redis.conf，也可以启动 Redis 后通过**CONFIG**命令查看或设置配置项，**CONFIG**命令格式：

```shell
CONFIG GET CONFIG_SETTING_NAME
```

如查看日志级别和使用**\***获取所有配置项

```shell
CONFIG GET loglevel

CONFIG GET *
```

如果需要修改 Redis 配置，可以通过修改 redis.conf 配置文件或者使用 CONFIG 命令来实现，CONFIG 命令修改配置格式：

```shell
CONFIG SET CONFIG_SETTING_NAME NEW_CONFIG_VALUE
```

## 配置项

Redis 配置项说明如下：

| 序号 | 配置项                                             | 说明                                                         |
| :--- | :------------------------------------------------- | :----------------------------------------------------------- |
| 1    | daemonize                                          | Redis 默认不是以守护进程的方式运行，可以通过该配置项修改，使用 yes 启用守护进程（Windows 不支持守护线程的配置为 no ） |
| 2    | pidfile                                            | 当 Redis 以守护进程方式运行时，Redis 默认会把 pid 写入 /var/run/redis.pid 文件，可以通过 pidfile 指定 |
| 3    | port                                               | 指定 Redis 监听端口，默认端口为 6379                         |
| 4    | bind                                               | 绑定的主机地址                                               |
| 5    | timeout                                            | 当客户端闲置多长秒后关闭连接，如果指定为 0 ，表示关闭该功能  |
| 6    | loglevel                                           | 指定日志记录级别，Redis 总共支持四个级别：debug、verbose、notice、warning，默认为 notice |
| 7    | logfile                                            | 日志记录方式，默认为标准输出                                 |
| 8    | databases                                          | 设置数据库的数量，默认数据库为 0，可以使用 SELECT 命令在连接上指定数据库 id |
| 9    | save &lt;seconds> &lt;changes>                     | 指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合,Redis 默认配置文件中提供了三个条件：<br>**save 900 1**<br>**save 300 10**<br>**save 60 10000**<br>分别表示 900 秒（15 分钟）内有 1 个更改，300 秒（5 分钟）内有 10 个更改以及 60 秒内有 10000 个更改。 |
| 10   | rdbcompression                                     | 指定存储至本地数据库时是否压缩数据，默认为 yes，Redis 采用 LZF 压缩，如果为了节省 CPU 时间，可以关闭该选项，但会导致数据库文件变的巨大 |
| 11   | dbfilename                                         | 指定本地数据库文件名，默认值为 dump.rdb                      |
| 12   | dir                                                | 指定本地数据库存放目录，默认为./表示同级目录下               |
| 13   | slaveof &lt;masterip> &lt;masterport>              | 设置当本机为 slave 服务时，设置 master 服务的 IP 地址及端口，在 Redis 启动时，它会自动从 master 进行数据同步 |
| 14   | masterauth &lt;master-password>                    | 当 master 服务设置了密码保护时，slave 服务连接 master 的密码 |
| 15   | requirepass                                        | 设置 Redis 连接密码，如果配置了连接密码，客户端在连接 Redis 时需要通过 AUTH \<password\> 命令提供密码，默认关闭 |
| 16   | maxclients                                         | 设置同一时间最大客户端连接数，默认无限制，Redis 可以同时打开的客户端连接数为 Redis 进程可以打开的最大文件描述符数，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis 会关闭新的连接并向客户端返回 max number of clients reached 错误信息 |
| 17   | maxmemory &lt;bytes>                               | 指定 Redis 最大内存限制，Redis 在启动时会把数据加载到内存中，达到最大内存后，Redis 会先尝试清除已到期或即将到期的 Key，当此方法处理 后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis 新的 vm 机制，会把 Key 存放内存，Value 会存放在 swap 区 |
| 18   | appendonly                                         | 指定是否在每次更新操作后进行日志记录，Redis 在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为 redis 本身同步数据文件是按上面 save 条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为 no |
| 19   | appendfilename                                     | 指定更新日志文件名，默认为 appendonly.aof                    |
| 20   | appendfsync                                        | 指定更新日志条件，共有 3 个可选值： <br>**no**：表示等操作系统进行数据缓存同步到磁盘（快）<br>**always**：表示每次更新操作后手动调用 fsync() 将数据写到磁盘（慢，安全） <br>**everysec**：表示每秒同步一次（折中，默认值） |
| 21   | vm-enabled                                         | 指定是否启用虚拟内存机制，默认值为 no，VM 机制将数据分页存放，由 Redis 将访问量较少的页即冷数据 swap 到磁盘上，访问多的页面由磁盘自动换出到内存中 |
| 22   | vm-swap-file                                       | 虚拟内存文件路径，默认值为 /tmp/redis.swap，不可多个 Redis 实例共享 |
| 23   | vm-max-memory                                      | 将所有大于 vm-max-memory 的数据存入虚拟内存，无论 vm-max-memory 设置多小，所有索引数据都是内存存储的(Redis 的索引数据 就是 keys)，也就是说，当 vm-max-memory 设置为 0 的时候，其实是所有 value 都存在于磁盘。默认值为 0 |
| 24   | vm-page-size                                       | Redis swap 文件分成了很多的 page，一个对象可以保存在多个 page 上面，但一个 page 上不能被多个对象共享，vm-page-size 是要根据存储的 数据大小来设定的，作者建议如果存储很多小对象，page 大小最好设置为 32 或者 64bytes；如果存储很大大对象，则可以使用更大的 page，如果不确定，就使用默认值 |
| 25   | vm-pages                                           | 设置 swap 文件中的 page 数量，由于页表（一种表示页面空闲或使用的 bitmap）是在放在内存中的，，在磁盘上每 8 个 pages 将消耗 1byte 的内存 |
| 26   | vm-max-threads                                     | 设置访问swap文件的线程数,最好不要超过机器的核数,如果设置为0,那么所有对swap文件的操作都是串行的，可能会造成比较长时间的延迟。默认值为4 |
| 27   | glueoutputbuf                                      | 设置在向客户端应答时，是否把较小的包合并为一个包发送，默认为开启 |
| 28   | hash-max-zipmap-entries <br/>hash-max-zipmap-value | 指定在超过一定的数量或者最大的元素超过某一临界值时，采用一种特殊的哈希算法 |
| 29   | activerehashing                                    | 指定是否激活重置哈希，默认为开启                             |
| 30   | include                                            | 指定包含其它的配置文件，可以在同一主机上多个Redis实例之间使用同一份配置文件，而同时各个实例又拥有自己的特定配置文件 |
