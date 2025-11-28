# 快速开始指南

本指南将帮助您在几分钟内开始使用 Kemon_hidy。

## 目录

- [安装](#安装)
- [基础配置](#基础配置)
- [第一个示例](#第一个示例)
- [常见用例](#常见用例)
- [下一步](#下一步)

---

## 安装

### Node.js / JavaScript

```bash
# 使用 npm
npm install kemon-hidy

# 使用 yarn
yarn add kemon-hidy

# 使用 pnpm
pnpm add kemon-hidy
```

### Python

```bash
# 使用 pip
pip install kemon-hidy

# 使用 poetry
poetry add kemon-hidy
```

### Go

```bash
go get github.com/yourusername/kemon_hidy
```

---

## 基础配置

### 获取 API 密钥

1. 访问 [Kemon_hidy 控制台](https://console.kemonhidy.com)
2. 注册或登录您的账号
3. 进入"设置" -> "API 密钥"
4. 创建新的 API 密钥
5. 保存密钥（仅显示一次）

### 环境变量设置

为了安全起见，建议使用环境变量存储 API 密钥：

```bash
# Linux/macOS
export KEMON_HIDY_API_KEY=your_api_key_here

# Windows (命令提示符)
set KEMON_HIDY_API_KEY=your_api_key_here

# Windows (PowerShell)
$env:KEMON_HIDY_API_KEY="your_api_key_here"
```

或者创建 `.env` 文件：

```env
KEMON_HIDY_API_KEY=your_api_key_here
KEMON_HIDY_TIMEOUT=5000
KEMON_HIDY_DEBUG=false
```

---

## 第一个示例

### JavaScript/Node.js

```javascript
const { KemonHidy } = require('kemon-hidy');

// 创建实例
const kemon = new KemonHidy({
  apiKey: process.env.KEMON_HIDY_API_KEY
});

async function main() {
  try {
    // 初始化连接
    await kemon.initialize();
    console.log('✅ 连接成功！');

    // 获取数据
    const data = await kemon.getData({ limit: 5 });
    console.log('📦 数据:', data);

    // 创建新数据
    const newItem = await kemon.setData({
      name: '我的第一个项目',
      value: 100
    });
    console.log('✨ 创建成功:', newItem);

  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    // 断开连接
    await kemon.disconnect();
  }
}

main();
```

### Python

```python
from kemon_hidy import KemonHidy
import os

# 创建实例
kemon = KemonHidy(
    api_key=os.environ.get('KEMON_HIDY_API_KEY')
)

async def main():
    try:
        # 初始化连接
        await kemon.initialize()
        print('✅ 连接成功！')

        # 获取数据
        data = await kemon.get_data(limit=5)
        print('📦 数据:', data)

        # 创建新数据
        new_item = await kemon.set_data({
            'name': '我的第一个项目',
            'value': 100
        })
        print('✨ 创建成功:', new_item)

    except Exception as error:
        print('❌ 错误:', str(error))
    finally:
        # 断开连接
        await kemon.disconnect()

# 运行
import asyncio
asyncio.run(main())
```

### TypeScript

```typescript
import { KemonHidy, KemonHidyConfig } from 'kemon-hidy';

// 配置
const config: KemonHidyConfig = {
  apiKey: process.env.KEMON_HIDY_API_KEY!,
  timeout: 5000
};

// 创建实例
const kemon = new KemonHidy(config);

async function main(): Promise<void> {
  try {
    await kemon.initialize();
    console.log('✅ 连接成功！');

    const data = await kemon.getData({ limit: 5 });
    console.log('📦 数据:', data);

  } catch (error) {
    console.error('❌ 错误:', error);
  } finally {
    await kemon.disconnect();
  }
}

main();
```

---

## 常见用例

### 1. 查询数据

```javascript
// 基础查询
const data = await kemon.getData({
  limit: 10,
  offset: 0
});

// 带筛选条件
const filtered = await kemon.getData({
  filter: 'status:active',
  limit: 20
});

// 排序
const sorted = await kemon.getData({
  sort: 'createdAt:desc',
  limit: 10
});

// 组合条件
const complex = await kemon.getData({
  filter: 'value:>100 AND status:active',
  sort: 'value:asc',
  limit: 50,
  offset: 10
});
```

### 2. 创建和更新数据

```javascript
// 创建单个项目
const item = await kemon.setData({
  name: '新项目',
  value: 200,
  tags: ['important', 'new']
});

// 更新现有项目
const updated = await kemon.setData({
  id: item.id,
  name: '更新的项目',
  value: 300
});

// 批量创建
const items = [
  { name: '项目1', value: 100 },
  { name: '项目2', value: 200 },
  { name: '项目3', value: 300 }
];

for (const data of items) {
  await kemon.setData(data);
}
```

### 3. 删除数据

```javascript
// 删除单个项目
await kemon.delete('item-id-123');

// 批量删除
const itemsToDelete = ['id1', 'id2', 'id3'];
for (const id of itemsToDelete) {
  await kemon.delete(id);
}

// 条件删除（先查询后删除）
const oldItems = await kemon.getData({
  filter: 'createdAt:<2024-01-01'
});

for (const item of oldItems) {
  await kemon.delete(item.id);
}
```

### 4. 事件监听

```javascript
// 连接状态
kemon.on('connected', () => {
  console.log('已连接');
});

kemon.on('disconnected', () => {
  console.log('已断开');
});

// 数据更新
kemon.on('data', (data) => {
  console.log('新数据:', data);
  // 处理实时数据更新
});

// 错误处理
kemon.on('error', (error) => {
  console.error('发生错误:', error);
  // 记录日志或发送告警
});
```

### 5. 错误处理

```javascript
async function safeOperation() {
  try {
    const result = await kemon.getData({ limit: 10 });
    return result;
  } catch (error) {
    // 根据错误类型处理
    if (error.name === 'ConnectionError') {
      console.error('网络连接失败，请检查网络');
      // 可能重试
    } else if (error.name === 'AuthenticationError') {
      console.error('认证失败，请检查 API 密钥');
      // 提示用户更新密钥
    } else if (error.name === 'RateLimitError') {
      console.error('请求太频繁，请稍后再试');
      // 等待后重试
      await sleep(5000);
      return safeOperation();
    } else {
      console.error('未知错误:', error.message);
    }
    throw error;
  }
}
```

---

## 配置选项

### 完整配置示例

```javascript
const kemon = new KemonHidy({
  // 必需 - API 密钥
  apiKey: 'your-api-key',

  // 可选 - 请求超时（毫秒）
  timeout: 5000,

  // 可选 - 自动重试次数
  retries: 3,

  // 可选 - 调试模式
  debug: false,

  // 可选 - 自定义端点
  endpoint: 'https://api.kemonhidy.com/v1',

  // 可选 - 请求头
  headers: {
    'User-Agent': 'MyApp/1.0',
    'X-Custom-Header': 'value'
  },

  // 可选 - 代理设置
  proxy: {
    host: 'proxy.example.com',
    port: 8080,
    auth: {
      username: 'user',
      password: 'pass'
    }
  }
});
```

---

## 实用技巧

### 1. 使用连接池

对于高并发场景，可以创建连接池：

```javascript
class ConnectionPool {
  constructor(size, config) {
    this.pool = [];
    this.size = size;
    this.config = config;
  }

  async initialize() {
    for (let i = 0; i < this.size; i++) {
      const kemon = new KemonHidy(this.config);
      await kemon.initialize();
      this.pool.push(kemon);
    }
  }

  getConnection() {
    // 轮询分配连接
    return this.pool[Math.floor(Math.random() * this.pool.length)];
  }

  async close() {
    for (const kemon of this.pool) {
      await kemon.disconnect();
    }
  }
}

// 使用
const pool = new ConnectionPool(5, { apiKey: process.env.API_KEY });
await pool.initialize();

const kemon = pool.getConnection();
const data = await kemon.getData({ limit: 10 });
```

### 2. 缓存策略

实现简单的缓存机制：

```javascript
class CachedKemonHidy {
  constructor(config) {
    this.kemon = new KemonHidy(config);
    this.cache = new Map();
    this.cacheTTL = 60000; // 1分钟
  }

  async getData(query) {
    const cacheKey = JSON.stringify(query);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log('从缓存返回');
      return cached.data;
    }

    const data = await this.kemon.getData(query);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }
}
```

### 3. 分页辅助函数

简化分页操作：

```javascript
async function* paginateData(kemon, query, pageSize = 100) {
  let offset = 0;

  while (true) {
    const data = await kemon.getData({
      ...query,
      limit: pageSize,
      offset
    });

    if (data.length === 0) break;

    yield data;
    offset += pageSize;
  }
}

// 使用
for await (const page of paginateData(kemon, { filter: 'status:active' })) {
  console.log(`处理 ${page.length} 条记录`);
  // 处理每页数据
}
```

---

## 调试

### 启用调试模式

```javascript
const kemon = new KemonHidy({
  apiKey: process.env.API_KEY,
  debug: true  // 启用详细日志
});
```

### 查看请求详情

```javascript
// 监听所有请求
kemon.on('request', (details) => {
  console.log('请求:', details.method, details.url);
  console.log('参数:', details.params);
});

// 监听响应
kemon.on('response', (details) => {
  console.log('响应:', details.status);
  console.log('数据:', details.data);
});
```

---

## 常见问题

### Q: 如何处理认证失败？

```javascript
try {
  await kemon.initialize();
} catch (error) {
  if (error.name === 'AuthenticationError') {
    console.error('认证失败，请检查您的 API 密钥');
    console.error('错误代码:', error.code);
    // 提示用户更新 API 密钥
  }
}
```

### Q: 如何提高请求性能？

1. 使用批量操作而不是多次单独请求
2. 启用本地缓存
3. 使用连接池
4. 合理设置超时和重试参数

### Q: 支持哪些数据格式？

Kemon_hidy 支持：
- JSON（默认）
- XML
- CSV
- 自定义格式（通过转换器）

---

## 下一步

现在您已经掌握了基础知识，可以：

- 📖 阅读完整的 [API 文档](./API.md)
- 🔧 查看 [函数文档](./FUNCTIONS.md)
- 🎨 探索 [组件文档](./COMPONENTS.md)
- 💡 学习更多[示例代码](../examples/)
- 🤝 了解如何[贡献代码](../CONTRIBUTING.md)

---

## 获取帮助

如果遇到问题：

- 查看 [常见问题](./FAQ.md)
- 搜索 [GitHub Issues](https://github.com/yourusername/kemon_hidy/issues)
- 加入我们的 [社区讨论](https://github.com/yourusername/kemon_hidy/discussions)
- 发送邮件至 support@kemonhidy.com

祝您使用愉快！ 🚀
