# 函数文档

本文档详细说明了 Kemon_hidy 项目中所有公共函数的使用方法。

## 目录

- [数据处理函数](#数据处理函数)
- [验证函数](#验证函数)
- [转换函数](#转换函数)
- [工具函数](#工具函数)
- [异步函数](#异步函数)

---

## 数据处理函数

### `processData(data, options)`

处理原始数据并返回格式化结果。

**参数:**
- `data` (Array|Object): 要处理的数据
- `options` (Object): 处理选项
  - `transform` (Function): 转换函数
  - `filter` (Function): 过滤函数
  - `sort` (String): 排序字段

**返回值:**
- `Array|Object`: 处理后的数据

**示例:**

```javascript
const rawData = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 20 }
];

const processed = processData(rawData, {
  filter: (item) => item.age >= 25,
  transform: (item) => ({ ...item, category: 'adult' }),
  sort: 'age'
});

console.log(processed);
// [
//   { id: 1, name: 'Alice', age: 25, category: 'adult' },
//   { id: 2, name: 'Bob', age: 30, category: 'adult' }
// ]
```

---

### `aggregateData(data, groupBy, aggregator)`

对数据进行分组聚合。

**参数:**
- `data` (Array): 数据数组
- `groupBy` (String|Function): 分组依据
- `aggregator` (Function): 聚合函数

**返回值:**
- `Object`: 分组聚合结果

**示例:**

```javascript
const sales = [
  { product: 'A', amount: 100, region: 'North' },
  { product: 'B', amount: 150, region: 'North' },
  { product: 'A', amount: 200, region: 'South' }
];

const result = aggregateData(
  sales,
  'region',
  (items) => items.reduce((sum, item) => sum + item.amount, 0)
);

console.log(result);
// { North: 250, South: 200 }
```

---

### `mergeData(target, source, strategy)`

合并两个数据集。

**参数:**
- `target` (Array|Object): 目标数据
- `source` (Array|Object): 源数据
- `strategy` (String): 合并策略 ('overwrite'|'merge'|'concat')

**返回值:**
- `Array|Object`: 合并后的数据

**示例:**

```javascript
const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };

const merged = mergeData(target, source, 'merge');
console.log(merged);
// { a: 1, b: 3, c: 4 }
```

---

## 验证函数

### `validateEmail(email)`

验证电子邮件地址格式。

**参数:**
- `email` (String): 要验证的电子邮件地址

**返回值:**
- `Boolean`: 格式是否有效

**示例:**

```javascript
console.log(validateEmail('user@example.com'));  // true
console.log(validateEmail('invalid-email'));     // false
```

---

### `validateURL(url)`

验证 URL 格式。

**参数:**
- `url` (String): 要验证的 URL

**返回值:**
- `Boolean`: 格式是否有效

**示例:**

```javascript
console.log(validateURL('https://example.com'));  // true
console.log(validateURL('not a url'));            // false
```

---

### `validateSchema(data, schema)`

根据 schema 验证数据结构。

**参数:**
- `data` (Object): 要验证的数据
- `schema` (Object): Schema 定义

**返回值:**
- `Object`: 验证结果
  - `valid` (Boolean): 是否通过验证
  - `errors` (Array): 错误列表

**示例:**

```javascript
const schema = {
  name: { type: 'string', required: true },
  age: { type: 'number', min: 0, max: 150 },
  email: { type: 'string', pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }
};

const data = {
  name: 'John',
  age: 25,
  email: 'john@example.com'
};

const result = validateSchema(data, schema);
console.log(result);
// { valid: true, errors: [] }
```

---

### `validateRange(value, min, max)`

验证值是否在指定范围内。

**参数:**
- `value` (Number): 要验证的值
- `min` (Number): 最小值
- `max` (Number): 最大值

**返回值:**
- `Boolean`: 是否在范围内

**示例:**

```javascript
console.log(validateRange(5, 0, 10));   // true
console.log(validateRange(15, 0, 10));  // false
```

---

## 转换函数

### `toJSON(data)`

将数据转换为 JSON 字符串。

**参数:**
- `data` (Any): 要转换的数据

**返回值:**
- `String`: JSON 字符串

**示例:**

```javascript
const obj = { name: 'test', value: 123 };
const json = toJSON(obj);
console.log(json);
// '{"name":"test","value":123}'
```

---

### `fromJSON(jsonString)`

从 JSON 字符串解析数据。

**参数:**
- `jsonString` (String): JSON 字符串

**返回值:**
- `Any`: 解析后的数据

**异常:**
- `SyntaxError`: JSON 格式无效时抛出

**示例:**

```javascript
const json = '{"name":"test","value":123}';
const obj = fromJSON(json);
console.log(obj);
// { name: 'test', value: 123 }
```

---

### `toBase64(data)`

将数据编码为 Base64。

**参数:**
- `data` (String|Buffer): 要编码的数据

**返回值:**
- `String`: Base64 编码的字符串

**示例:**

```javascript
const encoded = toBase64('Hello World');
console.log(encoded);
// 'SGVsbG8gV29ybGQ='
```

---

### `fromBase64(base64String)`

从 Base64 解码数据。

**参数:**
- `base64String` (String): Base64 字符串

**返回值:**
- `String`: 解码后的字符串

**示例:**

```javascript
const decoded = fromBase64('SGVsbG8gV29ybGQ=');
console.log(decoded);
// 'Hello World'
```

---

### `convertCase(str, targetCase)`

转换字符串大小写风格。

**参数:**
- `str` (String): 源字符串
- `targetCase` (String): 目标风格
  - `'camelCase'`: 驼峰命名
  - `'snake_case'`: 蛇形命名
  - `'kebab-case'`: 短横线命名
  - `'PascalCase'`: 帕斯卡命名

**返回值:**
- `String`: 转换后的字符串

**示例:**

```javascript
console.log(convertCase('hello_world', 'camelCase'));    // 'helloWorld'
console.log(convertCase('helloWorld', 'snake_case'));    // 'hello_world'
console.log(convertCase('hello-world', 'PascalCase'));   // 'HelloWorld'
```

---

## 工具函数

### `debounce(func, delay)`

创建一个防抖函数。

**参数:**
- `func` (Function): 要防抖的函数
- `delay` (Number): 延迟时间（毫秒）

**返回值:**
- `Function`: 防抖后的函数

**示例:**

```javascript
const searchAPI = (query) => {
  console.log('搜索:', query);
};

const debouncedSearch = debounce(searchAPI, 300);

// 只有最后一次调用会执行
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc');  // 300ms 后执行
```

---

### `throttle(func, interval)`

创建一个节流函数。

**参数:**
- `func` (Function): 要节流的函数
- `interval` (Number): 间隔时间（毫秒）

**返回值:**
- `Function`: 节流后的函数

**示例:**

```javascript
const handleScroll = () => {
  console.log('滚动事件');
};

const throttledScroll = throttle(handleScroll, 100);

// 每 100ms 最多执行一次
window.addEventListener('scroll', throttledScroll);
```

---

### `memoize(func)`

创建一个记忆化函数（缓存计算结果）。

**参数:**
- `func` (Function): 要记忆化的函数

**返回值:**
- `Function`: 记忆化后的函数

**示例:**

```javascript
const expensiveCalculation = (n) => {
  console.log('计算中...');
  return n * n;
};

const memoized = memoize(expensiveCalculation);

console.log(memoized(5));  // 计算中... 25
console.log(memoized(5));  // 25 (从缓存返回)
```

---

### `retry(func, maxAttempts, delay)`

创建一个自动重试的函数。

**参数:**
- `func` (Function): 要执行的函数（返回 Promise）
- `maxAttempts` (Number): 最大尝试次数
- `delay` (Number): 重试间隔（毫秒）

**返回值:**
- `Promise`: 返回函数执行结果

**示例:**

```javascript
const unreliableAPI = async () => {
  if (Math.random() < 0.7) {
    throw new Error('请求失败');
  }
  return '成功';
};

try {
  const result = await retry(unreliableAPI, 3, 1000);
  console.log(result);
} catch (error) {
  console.error('所有尝试都失败了');
}
```

---

### `deepClone(obj)`

深度克隆一个对象。

**参数:**
- `obj` (Object): 要克隆的对象

**返回值:**
- `Object`: 克隆后的对象

**示例:**

```javascript
const original = {
  name: 'test',
  nested: {
    value: 123
  }
};

const cloned = deepClone(original);
cloned.nested.value = 456;

console.log(original.nested.value);  // 123
console.log(cloned.nested.value);    // 456
```

---

### `deepEqual(obj1, obj2)`

深度比较两个对象是否相等。

**参数:**
- `obj1` (Any): 第一个对象
- `obj2` (Any): 第二个对象

**返回值:**
- `Boolean`: 是否相等

**示例:**

```javascript
const a = { x: 1, y: { z: 2 } };
const b = { x: 1, y: { z: 2 } };
const c = { x: 1, y: { z: 3 } };

console.log(deepEqual(a, b));  // true
console.log(deepEqual(a, c));  // false
```

---

### `getNestedValue(obj, path)`

从嵌套对象中获取值。

**参数:**
- `obj` (Object): 源对象
- `path` (String): 属性路径（使用点号分隔）

**返回值:**
- `Any`: 获取到的值，不存在则返回 undefined

**示例:**

```javascript
const obj = {
  user: {
    profile: {
      name: 'John',
      age: 25
    }
  }
};

console.log(getNestedValue(obj, 'user.profile.name'));  // 'John'
console.log(getNestedValue(obj, 'user.profile.email')); // undefined
```

---

### `setNestedValue(obj, path, value)`

设置嵌套对象中的值。

**参数:**
- `obj` (Object): 目标对象
- `path` (String): 属性路径（使用点号分隔）
- `value` (Any): 要设置的值

**返回值:**
- `Object`: 修改后的对象

**示例:**

```javascript
const obj = {};
setNestedValue(obj, 'user.profile.name', 'John');

console.log(obj);
// { user: { profile: { name: 'John' } } }
```

---

## 异步函数

### `fetchWithTimeout(url, timeout)`

带超时的 HTTP 请求。

**参数:**
- `url` (String): 请求 URL
- `timeout` (Number): 超时时间（毫秒）

**返回值:**
- `Promise<Response>`: 返回响应对象

**异常:**
- `TimeoutError`: 请求超时时抛出

**示例:**

```javascript
try {
  const response = await fetchWithTimeout('https://api.example.com/data', 5000);
  const data = await response.json();
  console.log(data);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('请求超时');
  } else {
    console.error('请求失败:', error);
  }
}
```

---

### `parallel(tasks)`

并行执行多个异步任务。

**参数:**
- `tasks` (Array<Function>): 任务函数数组（返回 Promise）

**返回值:**
- `Promise<Array>`: 返回所有任务的结果

**示例:**

```javascript
const tasks = [
  () => fetch('/api/users'),
  () => fetch('/api/posts'),
  () => fetch('/api/comments')
];

const results = await parallel(tasks);
console.log('所有请求完成:', results);
```

---

### `sequential(tasks)`

顺序执行多个异步任务。

**参数:**
- `tasks` (Array<Function>): 任务函数数组（返回 Promise）

**返回值:**
- `Promise<Array>`: 返回所有任务的结果

**示例:**

```javascript
const tasks = [
  () => processStep1(),
  () => processStep2(),
  () => processStep3()
];

const results = await sequential(tasks);
console.log('所有步骤完成:', results);
```

---

### `sleep(ms)`

暂停执行指定毫秒。

**参数:**
- `ms` (Number): 暂停时间（毫秒）

**返回值:**
- `Promise<void>`: 返回一个在指定时间后解析的 Promise

**示例:**

```javascript
console.log('开始');
await sleep(2000);
console.log('2秒后');
```

---

### `timeout(promise, ms)`

为 Promise 添加超时限制。

**参数:**
- `promise` (Promise): 源 Promise
- `ms` (Number): 超时时间（毫秒）

**返回值:**
- `Promise`: 返回包装后的 Promise

**异常:**
- `TimeoutError`: 超时时抛出

**示例:**

```javascript
try {
  const result = await timeout(
    fetch('https://slow-api.com/data'),
    5000
  );
  console.log(result);
} catch (error) {
  console.error('操作超时');
}
```

---

### `retryAsync(asyncFunc, options)`

异步函数重试包装器。

**参数:**
- `asyncFunc` (Function): 异步函数
- `options` (Object): 重试选项
  - `maxAttempts` (Number): 最大尝试次数
  - `delay` (Number): 重试间隔（毫秒）
  - `backoff` (Boolean): 是否使用指数退避

**返回值:**
- `Promise`: 返回函数执行结果

**示例:**

```javascript
const result = await retryAsync(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('请求失败');
    return response.json();
  },
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: true
  }
);
```

---

## 最佳实践

### 1. 错误处理

始终为异步函数添加适当的错误处理：

```javascript
try {
  const result = await fetchWithTimeout(url, 5000);
  // 处理结果
} catch (error) {
  // 处理错误
  console.error('操作失败:', error);
}
```

### 2. 性能优化

使用 `memoize` 缓存昂贵的计算结果：

```javascript
const expensiveFunc = memoize((data) => {
  // 复杂计算
  return result;
});
```

### 3. 防抖和节流

在处理高频事件时使用防抖或节流：

```javascript
// 搜索输入
const handleSearch = debounce((query) => {
  // 执行搜索
}, 300);

// 滚动事件
const handleScroll = throttle(() => {
  // 处理滚动
}, 100);
```

### 4. 并行处理

当任务之间没有依赖关系时，使用并行处理提高性能：

```javascript
// 并行执行
const [users, posts, comments] = await parallel([
  fetchUsers,
  fetchPosts,
  fetchComments
]);

// 顺序执行（有依赖关系时）
const results = await sequential([
  createUser,
  createProfile,
  sendWelcomeEmail
]);
```

---

## 相关资源

- [API 文档](./API.md)
- [组件文档](./COMPONENTS.md)
- [示例代码](../examples/)
