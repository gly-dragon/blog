---
title: 统一controller
---

在进行项目开发时，为了方便前端对请求结果进行校验，需要对后端返回的数据进行包装，一般情况下需要返回的结果有`状态码+状态信息+请求结果`，这样前端就可以根据不同的状态码判断响应状态。

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "userId": 1,
    "username": "admin"
  }
}
```

## 统一响应

### 统一状态码

1. 定义状态码接口，所有状态码都需要实现这个接口才行

   ```java
   public interface StatusCode {
       public int getCode();
       public String getMsg();
   }
   ```

2. 使用枚举来预先定义状态码，比如请求结果状态码`ResultCode`或者系统异常状态码`SysErrorCode`或是其他状态码。

   ```java
   @Getter
   public enum ResultCode implements StatusCode{
       SUCCESS(200, "请求成功"),
       FAILED(400, "请求失败");

       private int code;
       private String msg;

       ResultCode(int code, String msg) {
           this.code = code;
           this.msg = msg;
       }
   }
   ```

### 统一返回结果

定义好枚举后，创建一个包装类`Result`来将返回结果处理为我们需要的类型。可以预设几种不同的构造方法来适应不同的情况。

```java
@Data
public class Result {
    // 状态码
    private int code;

    // 状态信息
    private String msg;

    // 返回对象
    private Object data;

    // 手动设置返回
    public Result(int code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    // 默认返回成功状态码，数据对象
    public Result(Object data) {
        this.code = ResultCode.SUCCESS.getCode();
        this.msg = ResultCode.SUCCESS.getMsg();
        this.data = data;
    }

    // 返回指定状态码，数据对象
    public Result(StatusCode statusCode, Object data) {
        this.code = statusCode.getCode();
        this.msg = statusCode.getMsg();
        this.data = data;
    }

    // 只返回状态码
    public Result(StatusCode statusCode) {
        this.code = statusCode.getCode();
        this.msg = statusCode.getMsg();
        this.data = null;
    }
}
```

对于 Result 的定义，如果需要保证类型安全，也可以将其定义为泛型类。

```java
@Data
public class Result<T> {
	private Integer code;
	private String msg;
	private T data;
}
```

定义好统一返回格式后，在 controller 中就不能直接返回 data，而是使用定义好的包装类`Result`。

```java
@GetMapping("/find/{id}")
public Result findById(@PathVariable Integer id) {
    return new Result(service.getById(id));
}
```

当然，后端每个方法都写一遍`new Result()`肯定不符合实际，这样虽然统一了返回结果，但也使后端的结构变得冗余，有一个方法就是使用 AOP 拦截所有的 controller，然后在`@After`，即请求结束的时候统一处理一下。虽然 AOP 能实现这样的处理功能，但是使用 AOP 需要显示的定义切点、切面、通知等，他更适合于处理横切关注点（如日志、性能监控等）而不是响应格式和异常的处理。对于此，SpringBoot 提供了更好的处理方法`@RestControllerAdvice`。

`@RestControllerAdvice`自动扫描了指定包下的 controller 并在响应时进行统一处理，只需要实现一个`ResponseBodyAdvice`就可以将响应结果进行统一。

```java
@RestControllerAdvice(basePackages = {"xxx"})
@Slf4j
public class ResponseAdvice implements ResponseBodyAdvice<Object> {
	@Override
	public boolean supports(MethodParameter methodParameter, @Nullable Class aClass) {
        // 响应类型已经是Result了就不再进行包装
		return !methodParameter.getParameterType().isAssignableFrom(Result.class);
	}

	@Override
	public Object beforeBodyWrite(Object o, MethodParameter methodParameter,
								  @Nullable MediaType mediaType,
								  @Nullable Class aClass,
								  @Nullable ServerHttpRequest serverHttpRequest,
								  @Nullable ServerHttpResponse serverHttpResponse) {
        // String类型不能直接包装成json
		if (methodParameter.getGenericParameterType().equals(String.class) || o instanceof String) {
			ObjectMapper objectMapper = new ObjectMapper();
			try {
                // 将数据包装在Result中返回
				return objectMapper.writeValueAsString(new Result(o));
			} catch (JsonProcessingException e) {
				throw new APIException(ResultCode.RESPONSE_PACK_ERROR, e.getMessage());
			}
		}
		return new Result(o);
	}
}
```

之后 controller 中的方法就可以不返回`Result`，使用自定义 vo 或 po 也可以达到相同的包装效果。

```java
@GetMapping("/find/{id}")
public Users findById(@PathVariable Integer id) {
    return new Result(service.getById(id));
}
```

### NotResponseAdvice

在项目中可能会存在个别请求不需要进行统一封装，新增一个注解`NotResponseAdvice`进行处理即可。

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotResponseAdvice {
}
```

然后在`ResponseAdvice`的`supports`方法中加入`NotResponseAdvice`不进行包装，此时该方法

```java
@Override
public boolean supports(MethodParameter methodParameter, @Nullable Class aClass) {
    return !(methodParameter.getParameterType().isAssignableFrom(Result.class)
    	|| methodParameter.hasMethodAnnotation(NotResponseAdvice.class));
}
```

最后在不需要进行包装的 controller 方法上加上`NotResponseAdvice`注解即可。

```java
@GetMapping("/health")
@NotControllerResponseAdvice
    public String health() {
    return "success";
}
```

## 统一校验

假设现在有一个添加用户的接口，我们需要对用户名和密码进行校验，那么这个原始接口应该长这样：

```java
// 实体类
@Data
public class User{
    private Integer id;
    private String username;
    private String password;
}

// controller接口
@PostMapper("/user/add")
public User (User user){
    String username = user.getUserName();
    String password = user.getPassword();
    if(null == username || "".eqauls(username){
        throw new ApiException("用户名不能为空");
    }

    if(null == password || "".equals(password)){
        throw new ApiException("密码不能为空");
    }

    return service.add(user);
}
```

显然，这种写法过于繁杂，不利于代码的维护、阅读，在实际项目中我们也不会这样进行参数校验。针对参数校验，可以使用`@Validated`或者`@Valid`，`@Validated` 和 `@Valid `的提供者不同，但是两者都是由 hibernate-validator 来提供实现的，可以理解为@Validated 是 Spring 对@Valid 的封装，增强了其功能。

**`@Validated` 和 `@Valid `的区别**

| 区别         | @Valid                                         | @Validate               |
| ------------ | ---------------------------------------------- | ----------------------- |
| 提供者       | JSR-303 规范                                   | Spring                  |
| 是否支持分组 | 不支持                                         | 支持                    |
| 标注位置     | METHOD, FIELD,CONSTRUCTOR, PARAMETER, TYPE_USE | TYPE, METHOD, PARAMETER |
| 嵌套校验     | 支持                                           | 不支持                  |

**注意：如果 spring-boot 版本小于 2.3.x，spring-boot-starter-web 会自动传入 hibernate-validator 依赖，否则需要手动引入依赖。如果写法正确，但是校验机制没有生效，那么可能是 hibernate-validator 依赖的版本不对，可以百度查询当前 Spring 的版本适用的 hibernate-validator 版本号**

- 引入依赖

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
  ```

- 校验注解及说明

  | 注解                      | 校验数据类型                         | 作用描述                                                                                                                                                    |
  | ------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | @NotNull                  | 任意类型                             | 验证属性不能为 null                                                                                                                                         |
  | @NotBlank                 | 字符串                               | 验证字符串属性不能为空且长度必须大于 0                                                                                                                      |
  | @Size(min,max )           | CharSequence、Collection、Map、Array | 字符串：字符串长度必须在指定的范围内<br/>Collection：集合大小必须在指定的范围内<br/>Map：map 的大小必须在指定的范围内<br/>Array：数组长度必须在指定的范围内 |
  | @Min                      | 整型类型                             | 验证数字属性的最小值                                                                                                                                        |
  | @Max                      | 整型类型                             | 验证数字属性的最大值                                                                                                                                        |
  | @DecimalMin               | 数字类型                             | 验证数字属性的最小值（包括小数）                                                                                                                            |
  | @DecimalMax               | 数字类型                             | 验证数字属性的最大值（包括小数）                                                                                                                            |
  | @Digits(integer,fraction) | 数字类型                             | 验证数字属性的整数位数和小数位数                                                                                                                            |
  | @Email                    | 字符串类型                           | 验证字符串属性是否符合 Email 格式                                                                                                                           |
  | @Pattern                  | 字符串                               | 验证字符串属性是否符合指定的正则表达式                                                                                                                      |
  | @Positive                 | 数字类型                             | 验证数值为正数                                                                                                                                              |
  | @PositiveOrZero           | 数字类型                             | 验证数值为正数或 0                                                                                                                                          |
  | @Negative                 | 数字类型                             | 验证数值为负数                                                                                                                                              |
  | @NegativeOrZero           | 数字类型                             | 验证数值为负数或 0                                                                                                                                          |
  | @AssertTrue               | 布尔类型                             | 参数值必须为 true                                                                                                                                           |
  | @AssertFalse              | 布尔类型                             | 参数值必须为 false                                                                                                                                          |
  | @Past                     | 时间类型(Date)                       | 参数值为时间，且必须小于 当前时间                                                                                                                           |
  | @PastOrPresent            | 时间类型(Date)                       | 参数值为时间，且必须小于或等于 当前时间                                                                                                                     |
  | @Future                   | 时间类型(Date)                       | 参数值为时间，且必须大于 当前时间                                                                                                                           |
  | @FutureOrPresent          | 时间类型(Date)                       | 参数值为时间，且必须大于或等于 当前日期                                                                                                                     |

  有了校验注解，只需要在 dto 类中加入相应注解并在 controller 中的方法上加入`@Validate`或者`@Valid`。

```java
// 实体类
@Data
public class User{
    private Integer id;
    @NotBlank(message = "用户名不能为空")
    private String username;
    @NotBlank(message = "密码不能为空")
    private String password;
}

// controller接口
@PostMapper("/user/add")
public User (@Validate User user){
    return service.add(user);
}
```
