---
title: 键(key)命令
tags:
  - redis
  - 数据库
order: "2"
---

## Redis键（key）

Redis 键命令用于管理 redis 的键，其基本语法格式为：

```shell
command key_name
```

**Redis键操作的基本命令：**

- `del key`：key存在时删除key
- `dump key`：序列化key并返回被序列化后的值
- `exists key`：检查key是否存在
- `expire key seconds`：给指定可以设置过期时间，单位秒
- `expireat key timestamp`：给指定key设置过期时间，参数为unix时间戳
- `pexpire key milliseconds`：给指定key设置过期时间，单位毫秒
- `pexpireatat key milliseconds-timestamp`：给指定key设置过期时间，参数为unix时间戳，单位毫秒
- `keys pattern`：查找所有符合`pattern`表达式的key
- `move key db`：将当前数据库的key移动到指定数据库中
- `persist key`：移除key的过期时间，key将永久存在
- `pttl key`：返回key剩余的过期时间，单位毫秒
- `ttl key`：返回key剩余的过期时间，单位秒
- `randomkey`：随机返回一个key
- `rename key newkey`：重命名key
- `renamenx key newkey`：新名称不存在时重命名key
- `type key`：获取key所存储的值类型
