---
title: Java简介
index: false
tags:
  - Java
dir:
  text: Java基础
  link: true
---

## 简介

Java 是由 Sun Microsystems 公司于 1995 年 5 月推出的 Java 面向对象程序设计语言和 Java 平台的总称。由 James Gosling 和同事们共同研发，并在 1995 年正式推出。

后来 Sun 公司被 Oracle （甲骨文）公司收购，Java 也随之成为 Oracle 公司的产品。

Java 分为三个体系：

- JavaSE（J2SE）（Java2 Platform Standard Edition，java 平台标准版）
- JavaEE(J2EE)(Java 2 Platform,Enterprise Edition，java 平台企业版)
- JavaME(J2ME)(Java 2 Platform Micro Edition，java 平台微型版)。

2005 年 6 月，JavaOne 大会召开，SUN 公司公开 Java SE 6。此时，Java 的各种版本已经更名，以取消其中的数字 "2"：J2EE 更名为 Java EE，J2SE 更名为 Java SE，J2ME 更名为 Java ME。

## Java 的主要特性

**Java 语言是简单的：**

Java 语言的语法与 C 语言和 C++语言很接近，使得大多数程序员很容易学习和使用。另一方面，Java 丢弃了 C++中很少使用的、很难理解的、令人迷惑的那些特性，如操作符重载、多继承、自动的强制类型转换。特别地，Java 语言不使用指针，而是引用。并提供了自动的废料收集，使得程序员不必为内存管理而担忧。

**Java 语言是面向对象的：**

Java 语言提供类、接口和继承等面向对象的特性，为了简单起见，只支持类之间的单继承，但支持接口之间的多继承，并支持类与接口之间的实现机制（关键字为 implements）。Java 语言全面支持动态绑定，而 C++语言只对虚函数使用动态绑定。总之，Java 语言是一个纯的面向对象程序设计语言。

**Java 语言是分布式的：**

Java 语言支持 Internet 应用的开发，在基本的 Java 应用编程接口中有一个网络应用编程接口（java net），它提供了用于网络应用编程的类库，包括 URL、URLConnection、Socket、ServerSocket 等。Java 的 RMI（远程方法激活）机制也是开发分布式应用的重要手段。

**Java 语言是健壮的：**

Java 的强类型机制、异常处理、垃圾的自动收集等是 Java 程序健壮性的重要保证。对指针的丢弃是 Java 的明智选择。Java 的安全检查机制使得 Java 更具健壮性。

**Java 语言是安全的：**

Java 通常被用在网络环境中，为此，Java 提供了一个安全机制以防恶意代码的攻击。除了 Java 语言具有的许多安全特性以外，Java 对通过网络下载的类具有一个安全防范机制（类 ClassLoader），如分配不同的名字空间以防替代本地的同名类、字节代码检查，并提供安全管理机制（类 SecurityManager）让 Java 应用设置安全哨兵。

**Java 语言是体系结构中立的：**

Java 程序（后缀为 java 的文件）在 Java 平台上被编译为体系结构中立的字节码格式（后缀为 class 的文件），然后可以在实现这个 Java 平台的任何系统中运行。这种途径适合于异构的网络环境和软件的分发。

**Java 语言是可移植的：**

这种可移植性来源于体系结构中立性，另外，Java 还严格规定了各个基本数据类型的长度。Java 系统本身也具有很强的可移植性，Java 编译器是用 Java 实现的，Java 的运行环境是用 ANSI C 实现的。

**Java 语言是解释型的：**

如前所述，Java 程序在 Java 平台上被编译为字节码格式，然后可以在实现这个 Java 平台的任何系统中运行。在运行时，Java 平台中的 Java 解释器对这些字节码进行解释执行，执行过程中需要的类在联接阶段被载入到运行环境中。

**Java 是高性能的：**

与那些解释型的高级脚本语言相比，Java 的确是高性能的。事实上，Java 的运行速度随着 JIT(Just-In-Time）编译器技术的发展越来越接近于 C++。

**Java 语言是多线程的：**

在 Java 语言中，线程是一种特殊的对象，它必须由 Thread 类或其子（孙）类来创建。通常有两种方法来创建线程：其一，使用型构为 Thread(Runnable)的构造子类将一个实现了 Runnable 接口的对象包装成一个线程，其二，从 Thread 类派生出子类并重写 run 方法，使用该子类创建的对象即为线程。值得注意的是 Thread 类已经实现了 Runnable 接口，因此，任何一个线程均有它的 run 方法，而 run 方法中包含了线程所要运行的代码。线程的活动由一组方法来控制。Java 语言支持多个线程的同时执行，并提供多线程之间的同步机制（关键字为 synchronized）。

**Java 语言是动态的：**

Java 语言的设计目标之一是适应于动态变化的环境。Java 程序需要的类能够动态地被载入到运行环境，也可以通过网络来载入所需要的类。这也有利于软件的升级。另外，Java 中的类有一个运行时刻的表示，能进行运行时刻的类型检查。

**Unicode**

Java 使用 Unicode 作为它的标准字符，这项特性使得 Java 的程序能在不同语言的平台上都能撰写和执行。简单的说，你可以把程序中的变量、类别名称使用中文来表示<注>，当你的程序移植到其它语言平台时，还是可以正常的执行。Java 也是目前所有计算机语言当中，唯一天生使用 Unicode 的语言。

## Java 中的几个核心概念

**jdk**

**DK(Java Development Kit)** 又称 J2SDK(Java2 Software Development Kit)，是 Java 开发工具包，它提供了 Java 的开发环境(提供了编译器 javac 等工具，用于将 java 文件编译为 class 文件)和运行环境(提 供了 JVM 和 Runtime 辅助包，用于解析 class 文件使其得到运行)。如果你下载并安装了 JDK，那么你不仅可以开发 Java 程序，也同时拥有了运行 Java 程序的平台。JDK 是整个 Java 的核心，包括了 Java 运行环境(JRE)，一堆 Java 工具 tools.jar 和 Java 标准类库 (rt.jar)

**jre**

**JRE(Java Runtime Enviroment)** 是 Java 的运行环境。面向 Java 程序的使用者，而不是开发者。如果你仅下载并安装了 JRE，那么你的系统只能运行 Java 程序。JRE 是运行 Java 程序所必须环境的集合，包含 JVM 标准实现及 Java 核心类库。它包括 Java 虚拟机、Java 平台核心类和支持文件。它不包含开发工具(编译器、调试器等)。

**jvm**

**JVM(JavaVirtualMachine)** 即 Java 虚拟机，是一种用于计算设备的规范，它是一个虚构出来的计算机，用于解释执行 class 文件，有了 JVM 之后，Java 就可以实现跨平台。JVM 只需要保证能够正确执行.class 文件，就可以运行在诸如 Linux、Windows、MacOS 等平台上。

**jvm、jre、jdk 的关系**

JVM 是 Java 程序能够运行的核心。但需要注意，JVM 自己什么也干不了，你需要给它提供生产原料（.class 文件）。 仅仅是 JVM，是无法完成一次编译，处处运行的。它需要一个基本的类库，比如怎么操作文件、怎么连接网络等。而 Java 体系很慷慨，会一次性将 JVM 运行所需的类库都传递给它。JVM 标准加上实现的一大堆基础类库，就组成了 Java 的运行时环境，也就是我们常说的 JRE（JavaRuntimeEnvironment）。 对于 JDK 来说，就更庞大了一些。除了 JRE，JDK 还提供了一些非常好用的小工具，比如 javac、java、jar 等，它是 Java 开发的核心。

<img src="https://gly-blog-file.oss-cn-shanghai.aliyuncs.com/img/33915cf9680efb39d2c846f00647e72a.png" alt="33915cf9680efb39d2c846f00647e72a.png" style="zoom:80%;" />
