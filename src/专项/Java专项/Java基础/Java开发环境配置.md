---
title: Java 开发环境配置
tags:
  - Java
order: "1"
---

## widow系统安装Java

**安装jdk**

- 到[https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)下载jdk，下载页中根据操作系统位数选择相应的jdk下载，如window 64位的操作系统需要下载64位的jdk。
- 下载后启动安装程序，安装jdk，若下载的是压缩文件，则解压压缩文件配置环境变量即可。默认的安装路径在`C:\Program Files\Java`，如下载`jdk1.8.0_301`版本的jdk，默认安装在`C:\Program Files\Java\jdk1.8.0_301`。安装jdk时jre也会一并安装。

**配置环境变量**

- 安装完成后，右击“我的电脑”，点击“属性”，选择“高级系统设置”，选择“高级”选项卡“，点击”环境变量“。

- 在“系统变量”中设置3项属性，分别为`JAVA_HOME`、`PATH`、`CLASSPATH`（不区分大小写），若已经存在则点击编辑，不存在的点击新建

  > 1.5以上版本的jdk，不用设置CLASSPATH也可以正常编译和运行Java程序

- 变量参数设置

  | 变量名    | 值                                                  | 说明                                                         |
  | --------- | --------------------------------------------------- | ------------------------------------------------------------ |
  | JAVA_HOME | C:\Program Files\Java\jdk1.8.0_301                  | jdk的安装路径，需要根据自己的实际安装路径配置                |
  | CLASSPATH | .;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar; | 固定为该配置即可，**注意前面有个“.”**                        |
  | Path      | %JAVA_HOME%\bin;%JAVA_HOME%\jre\bin                 | 一般系统中已经有该变量配置，直接追加在后面即可，追加时前面需要“;”；在win10以及win11系统中，path变量是分条显示的，需要将**%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin**分开添加 |

- 安装后测试是否安装成功，`win+r`打开运行，键入`cmd`，输入 `java -version`或`java`或`javac`，出现相关信息说明安装配置成功。

## linux系统安装Java