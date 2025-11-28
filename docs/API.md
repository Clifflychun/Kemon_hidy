# API 参考文档

本文档提供了 Kemon_hidy 项目所有公共 API 的详细说明。

## 目录

- [核心类](#核心类)
  - [KemonHidy](#kemonhidy)
- [工具函数](#工具函数)
- [类型定义](#类型定义)
- [错误处理](#错误处理)

---

## 核心类

### KemonHidy

主要的类，提供核心功能。

#### 构造函数

```javascript
new KemonHidy(options)
```

创建一个新的 KemonHidy 实例。

**参数:**

| 参数名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| options | Object | 是 | - | 配置选项对象 |
| options.apiKey | String | 是 | - | API 密钥 |
| options.timeout | Number | 否 | 5000 | 请求超时时间（毫秒） |
| options.retries | Number | 否 | 3 | 重试次数 |
| options.debug | Boolean | 否 | false | 是否启用调试模式 |

**返回值:**
- `KemonHidy`: 返回一个新的 KemonHidy 实例

**示例:**

```javascript
const kemon = new KemonHidy({
  apiKey: 'your-api-key',
  timeout: 10000,
  retries: 5,
  debug: true
});
```

**异常:**
- `Error`: 当必需参数缺失时抛出

---

#### 方法

##### `initialize()`

初始化实例并建立连接。

```javascript
kemon.initialize()
```

**返回值:**
- `Promise<Boolean>`: 返回一个 Promise，成功时解析为 `true`

**示例:**

```javascript
await kemon.initialize();
console.log('初始化成功');
```

**异常:**
- `ConnectionError`: 连接失败时抛出
- `AuthenticationError`: 认证失败时抛出

---

##### `connect(endpoint)`

连接到指定的端点。

```javascript
kemon.connect(endpoint)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| endpoint | String | 是 | 要连接的端点 URL |

**返回值:**
- `Promise<Connection>`: 返回一个 Promise，解析为连接对象

**示例:**

```javascript
const connection = await kemon.connect('https://api.example.com/v1');
console.log('已连接:', connection.id);
```

**异常:**
- `InvalidEndpointError`: 端点格式无效时抛出
- `NetworkError`: 网络错误时抛出

---

##### `getData(query)`

根据查询参数获取数据。

```javascript
kemon.getData(query)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| query | Object | 是 | 查询参数对象 |
| query.filter | String | 否 | 筛选条件 |
| query.limit | Number | 否 | 返回结果数量限制 |
| query.offset | Number | 否 | 结果偏移量 |
| query.sort | String | 否 | 排序字段 |

**返回值:**
- `Promise<Array>`: 返回一个 Promise，解析为数据数组

**示例:**

```javascript
const data = await kemon.getData({
  filter: 'status:active',
  limit: 10,
  offset: 0,
  sort: 'createdAt:desc'
});

console.log(`获取到 ${data.length} 条记录`);
data.forEach(item => console.log(item));
```

**异常:**
- `QueryError`: 查询参数无效时抛出
- `RateLimitError`: 超过速率限制时抛出

---

##### `setData(data)`

设置或更新数据。

```javascript
kemon.setData(data)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| data | Object/Array | 是 | 要设置的数据 |

**返回值:**
- `Promise<Object>`: 返回一个 Promise，解析为操作结果对象

**示例:**

```javascript
const result = await kemon.setData({
  id: '123',
  name: '示例',
  value: 42
});

console.log('数据已保存:', result.id);
```

**异常:**
- `ValidationError`: 数据验证失败时抛出
- `PermissionError`: 没有写入权限时抛出

---

##### `delete(id)`

删除指定 ID 的数据。

```javascript
kemon.delete(id)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| id | String | 是 | 要删除的数据 ID |

**返回值:**
- `Promise<Boolean>`: 返回一个 Promise，成功时解析为 `true`

**示例:**

```javascript
const deleted = await kemon.delete('123');
if (deleted) {
  console.log('删除成功');
}
```

**异常:**
- `NotFoundError`: 指定 ID 不存在时抛出
- `PermissionError`: 没有删除权限时抛出

---

##### `on(event, callback)`

注册事件监听器。

```javascript
kemon.on(event, callback)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| event | String | 是 | 事件名称 |
| callback | Function | 是 | 事件回调函数 |

**支持的事件:**
- `'connected'`: 连接建立时触发
- `'disconnected'`: 连接断开时触发
- `'data'`: 接收到数据时触发
- `'error'`: 发生错误时触发

**返回值:**
- `void`

**示例:**

```javascript
kemon.on('connected', () => {
  console.log('已连接到服务器');
});

kemon.on('data', (data) => {
  console.log('接收到数据:', data);
});

kemon.on('error', (error) => {
  console.error('错误:', error.message);
});
```

---

##### `off(event, callback)`

移除事件监听器。

```javascript
kemon.off(event, callback)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| event | String | 是 | 事件名称 |
| callback | Function | 否 | 要移除的回调函数（不提供则移除所有） |

**返回值:**
- `void`

**示例:**

```javascript
const handler = (data) => console.log(data);

// 添加监听器
kemon.on('data', handler);

// 移除特定监听器
kemon.off('data', handler);

// 移除所有 'data' 事件的监听器
kemon.off('data');
```

---

##### `disconnect()`

断开连接并清理资源。

```javascript
kemon.disconnect()
```

**返回值:**
- `Promise<void>`: 返回一个 Promise，完成时解析

**示例:**

```javascript
await kemon.disconnect();
console.log('已断开连接');
```

---

## 工具函数

### `createInstance(config)`

创建一个预配置的 KemonHidy 实例的快捷方法。

```javascript
createInstance(config)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| config | Object | 是 | 配置对象 |

**返回值:**
- `KemonHidy`: 返回配置好的实例

**示例:**

```javascript
const kemon = createInstance({
  apiKey: 'your-api-key',
  timeout: 10000
});
```

---

### `validateConfig(config)`

验证配置对象是否有效。

```javascript
validateConfig(config)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| config | Object | 是 | 要验证的配置对象 |

**返回值:**
- `Object`: 返回验证结果对象
  - `valid` (Boolean): 是否有效
  - `errors` (Array): 错误信息数组

**示例:**

```javascript
const result = validateConfig({
  apiKey: 'test',
  timeout: -1  // 无效值
});

if (!result.valid) {
  console.error('配置错误:', result.errors);
}
```

---

### `formatData(data, format)`

将数据格式化为指定格式。

```javascript
formatData(data, format)
```

**参数:**

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| data | Any | 是 | 要格式化的数据 |
| format | String | 是 | 目标格式 ('json', 'xml', 'csv') |

**返回值:**
- `String`: 返回格式化后的字符串

**示例:**

```javascript
const jsonData = { name: 'test', value: 123 };
const xml = formatData(jsonData, 'xml');
console.log(xml);
// 输出: <root><name>test</name><value>123</value></root>
```

---

## 类型定义

### Connection

连接对象的类型定义。

```typescript
interface Connection {
  id: string;
  endpoint: string;
  status: 'connected' | 'disconnected' | 'connecting';
  timestamp: number;
}
```

---

### QueryOptions

查询选项的类型定义。

```typescript
interface QueryOptions {
  filter?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}
```

---

### DataItem

数据项的类型定义。

```typescript
interface DataItem {
  id: string;
  name: string;
  value: any;
  createdAt: number;
  updatedAt: number;
}
```

---

## 错误处理

### 错误类型

所有自定义错误都继承自 `KemonHidyError` 基类。

#### `KemonHidyError`

基础错误类。

```javascript
class KemonHidyError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'KemonHidyError';
    this.code = code;
  }
}
```

#### `ConnectionError`

连接相关错误。

**错误代码:**
- `CONN_001`: 无法连接到服务器
- `CONN_002`: 连接超时
- `CONN_003`: 连接被拒绝

#### `AuthenticationError`

认证相关错误。

**错误代码:**
- `AUTH_001`: 无效的 API 密钥
- `AUTH_002`: 认证过期
- `AUTH_003`: 权限不足

#### `ValidationError`

数据验证错误。

**错误代码:**
- `VALID_001`: 必需字段缺失
- `VALID_002`: 字段类型错误
- `VALID_003`: 字段值超出范围

#### `RateLimitError`

速率限制错误。

**错误代码:**
- `RATE_001`: 超过请求速率限制
- `RATE_002`: 超过数据量限制

---

### 错误处理示例

```javascript
try {
  await kemon.getData({ limit: 1000 });
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('连接错误:', error.message);
    // 重试逻辑
  } else if (error instanceof AuthenticationError) {
    console.error('认证错误:', error.message);
    // 重新认证
  } else if (error instanceof RateLimitError) {
    console.error('速率限制:', error.message);
    // 等待后重试
  } else {
    console.error('未知错误:', error);
  }
}
```

---

## 版本历史

### v1.0.0
- 初始版本发布
- 基础 CRUD 功能
- 事件系统

---

## 相关资源

- [函数文档](./FUNCTIONS.md)
- [组件文档](./COMPONENTS.md)
- [示例代码](../examples/)
- [贡献指南](../CONTRIBUTING.md)
