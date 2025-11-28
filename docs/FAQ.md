# 常见问题 (FAQ)

本文档汇总了使用 Kemon_hidy 时的常见问题和解决方案。

## 目录

- [安装和设置](#安装和设置)
- [认证和权限](#认证和权限)
- [数据操作](#数据操作)
- [性能优化](#性能优化)
- [错误处理](#错误处理)
- [部署相关](#部署相关)

---

## 安装和设置

### Q: 支持哪些 Node.js 版本？

**A:** Kemon_hidy 支持 Node.js 14.x 及以上版本。推荐使用 LTS 版本（18.x 或 20.x）以获得最佳性能和稳定性。

```bash
# 检查 Node.js 版本
node --version
```

---

### Q: 如何在 TypeScript 项目中使用？

**A:** Kemon_hidy 内置了 TypeScript 类型定义：

```typescript
import { KemonHidy, KemonHidyConfig, DataItem } from 'kemon-hidy';

const config: KemonHidyConfig = {
  apiKey: process.env.API_KEY!,
  timeout: 5000
};

const kemon = new KemonHidy(config);

// 类型安全的数据操作
const data: DataItem[] = await kemon.getData({ limit: 10 });
```

---

### Q: 安装时出现依赖错误怎么办？

**A:** 尝试以下解决方案：

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 或使用 yarn
yarn install --force
```

---

### Q: 是否支持浏览器环境？

**A:** 是的，Kemon_hidy 支持浏览器环境。对于浏览器使用，推荐通过 CDN 引入：

```html
<script src="https://cdn.kemonhidy.com/v1/kemon-hidy.min.js"></script>
<script>
  const kemon = new KemonHidy.default({
    apiKey: 'your-api-key'
  });
</script>
```

或使用打包工具（webpack、vite 等）：

```javascript
import { KemonHidy } from 'kemon-hidy/browser';
```

---

## 认证和权限

### Q: 如何获取 API 密钥？

**A:** 按照以下步骤获取：

1. 访问 https://console.kemonhidy.com
2. 注册或登录账号
3. 进入"设置" -> "API 密钥"
4. 点击"创建新密钥"
5. 复制并安全保存密钥（只显示一次）

---

### Q: API 密钥泄露了怎么办？

**A:** 立即采取以下措施：

1. 登录控制台
2. 进入"API 密钥"页面
3. 撤销泄露的密钥
4. 创建新密钥
5. 更新应用中的密钥配置
6. 检查日志，确认是否有异常访问

---

### Q: 如何限制 API 密钥的权限？

**A:** 在控制台创建密钥时可以设置权限：

- **只读**: 只能查询数据
- **读写**: 可以查询和修改数据
- **管理**: 拥有所有权限

```javascript
// 使用只读密钥
const readOnlyKemon = new KemonHidy({
  apiKey: process.env.READ_ONLY_API_KEY
});

// 只能执行读取操作
const data = await readOnlyKemon.getData({ limit: 10 });

// 写入操作会失败
// await readOnlyKemon.setData({...}); // ❌ 权限错误
```

---

### Q: 认证失败错误码说明？

**A:** 常见认证错误码：

| 错误码 | 含义 | 解决方案 |
|--------|------|----------|
| AUTH_001 | 无效的 API 密钥 | 检查密钥是否正确 |
| AUTH_002 | API 密钥已过期 | 创建新密钥 |
| AUTH_003 | 权限不足 | 使用具有足够权限的密钥 |
| AUTH_004 | IP 地址被限制 | 在控制台添加 IP 白名单 |

---

## 数据操作

### Q: 单次查询最多返回多少条数据？

**A:** 默认最大限制是 1000 条。如需获取更多数据，请使用分页：

```javascript
async function getAllData() {
  const allData = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const page = await kemon.getData({
      limit: pageSize,
      offset: offset
    });

    if (page.length === 0) break;

    allData.push(...page);
    offset += pageSize;
  }

  return allData;
}
```

---

### Q: 如何进行复杂查询？

**A:** 使用查询语法：

```javascript
// AND 条件
await kemon.getData({
  filter: 'status:active AND value:>100'
});

// OR 条件
await kemon.getData({
  filter: 'category:A OR category:B'
});

// 组合条件
await kemon.getData({
  filter: '(status:active OR status:pending) AND value:>100'
});

// 模糊匹配
await kemon.getData({
  filter: 'name:*test*'
});

// 范围查询
await kemon.getData({
  filter: 'createdAt:>=2025-01-01 AND createdAt:<=2025-12-31'
});
```

---

### Q: 如何批量插入数据？

**A:** 有两种方式：

**方式一：循环插入（适合少量数据）**

```javascript
const items = [/* ... */];

for (const item of items) {
  await kemon.setData(item);
}
```

**方式二：批量API（推荐，适合大量数据）**

```javascript
const items = [/* ... */];

// 分批处理
const batchSize = 100;
for (let i = 0; i < items.length; i += batchSize) {
  const batch = items.slice(i, i + batchSize);
  await kemon.batchSetData(batch);
}
```

---

### Q: 删除操作可以撤销吗？

**A:** 默认情况下删除是永久性的。但可以：

1. **使用软删除**：不真正删除，只标记为已删除

```javascript
// 软删除
await kemon.setData({
  id: itemId,
  deleted: true,
  deletedAt: new Date().toISOString()
});

// 查询时过滤已删除项
const data = await kemon.getData({
  filter: 'deleted:false OR deleted:null'
});
```

2. **启用数据备份**：在控制台开启自动备份功能

---

### Q: 如何处理大文件上传？

**A:** 使用分块上传：

```javascript
async function uploadLargeFile(file) {
  const chunkSize = 1024 * 1024; // 1MB
  const chunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await kemon.uploadChunk({
      fileId: file.id,
      chunkIndex: i,
      totalChunks: chunks,
      data: chunk
    });

    console.log(`上传进度: ${((i + 1) / chunks * 100).toFixed(2)}%`);
  }

  // 完成上传
  await kemon.finalizeUpload(file.id);
}
```

---

## 性能优化

### Q: 如何提高查询性能？

**A:** 使用以下优化策略：

1. **添加索引**（在控制台配置）
2. **使用缓存**

```javascript
const cache = new Map();
const CACHE_TTL = 60000; // 1分钟

async function getCachedData(query) {
  const key = JSON.stringify(query);
  const cached = cache.get(key);

  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const data = await kemon.getData(query);
  cache.set(key, { data, time: Date.now() });
  return data;
}
```

3. **减少返回字段**

```javascript
await kemon.getData({
  limit: 100,
  fields: ['id', 'name', 'value'] // 只返回需要的字段
});
```

4. **使用连接池**（见[快速开始指南](./QUICKSTART.md#使用连接池)）

---

### Q: 并发请求数量有限制吗？

**A:** 是的，默认限制：

- **免费版**: 每秒 10 个请求
- **专业版**: 每秒 100 个请求
- **企业版**: 每秒 1000 个请求

超过限制会返回 `RateLimitError`。建议实现请求队列：

```javascript
class RequestQueue {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async add(fn) {
    while (this.running >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
    }
  }
}

const queue = new RequestQueue(10);

// 使用队列
const results = await Promise.all(
  items.map(item => queue.add(() => kemon.setData(item)))
);
```

---

### Q: 数据量很大时如何优化？

**A:** 采用以下策略：

1. **流式处理**

```javascript
async function* streamData(query) {
  let offset = 0;
  const limit = 100;

  while (true) {
    const batch = await kemon.getData({ ...query, limit, offset });
    if (batch.length === 0) break;

    for (const item of batch) {
      yield item;
    }

    offset += limit;
  }
}

// 使用
for await (const item of streamData({ filter: 'status:active' })) {
  processItem(item);
}
```

2. **数据分片**

```javascript
// 按时间分片
const ranges = [
  { start: '2025-01-01', end: '2025-03-31' },
  { start: '2025-04-01', end: '2025-06-30' },
  // ...
];

const results = await Promise.all(
  ranges.map(range => 
    kemon.getData({
      filter: `createdAt:>=${range.start} AND createdAt:<=${range.end}`
    })
  )
);
```

---

## 错误处理

### Q: 如何优雅地处理错误？

**A:** 使用错误处理中间件：

```javascript
class KemonHidyWrapper {
  constructor(config) {
    this.kemon = new KemonHidy(config);
  }

  async safeExecute(operation, fallback = null) {
    try {
      return await operation();
    } catch (error) {
      console.error('操作失败:', error.message);

      // 根据错误类型处理
      if (error.name === 'NetworkError') {
        // 网络错误：重试
        console.log('网络错误，3秒后重试...');
        await sleep(3000);
        return this.safeExecute(operation, fallback);
      } else if (error.name === 'RateLimitError') {
        // 速率限制：等待后重试
        const waitTime = error.retryAfter || 60;
        console.log(`速率限制，${waitTime}秒后重试...`);
        await sleep(waitTime * 1000);
        return this.safeExecute(operation, fallback);
      } else {
        // 其他错误：返回fallback值
        return fallback;
      }
    }
  }
}

// 使用
const wrapper = new KemonHidyWrapper({ apiKey: process.env.API_KEY });
const data = await wrapper.safeExecute(
  () => kemon.getData({ limit: 10 }),
  [] // fallback值
);
```

---

### Q: 如何记录错误日志？

**A:** 集成日志系统：

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 监听错误事件
kemon.on('error', (error) => {
  logger.error('Kemon_hidy错误', {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
});
```

---

### Q: 连接超时如何处理？

**A:** 配置超时和重试：

```javascript
const kemon = new KemonHidy({
  apiKey: process.env.API_KEY,
  timeout: 10000,  // 10秒超时
  retries: 3       // 自动重试3次
});

// 或手动实现重试
async function fetchWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await kemon.getData({ limit: 10 });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`尝试 ${i + 1} 失败，重试中...`);
      await sleep(1000 * Math.pow(2, i)); // 指数退避
    }
  }
}
```

---

## 部署相关

### Q: 如何在生产环境中部署？

**A:** 生产环境部署清单：

1. **环境变量**

```bash
# .env.production
KEMON_HIDY_API_KEY=prod_xxxxx
KEMON_HIDY_TIMEOUT=10000
KEMON_HIDY_RETRIES=3
NODE_ENV=production
```

2. **错误监控**

```javascript
// 集成 Sentry
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });

kemon.on('error', (error) => {
  Sentry.captureException(error);
});
```

3. **健康检查**

```javascript
app.get('/health', async (req, res) => {
  try {
    await kemon.getData({ limit: 1 });
    res.json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
```

4. **优雅关闭**

```javascript
process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM，开始优雅关闭...');
  
  // 停止接受新请求
  server.close();
  
  // 断开 Kemon_hidy 连接
  await kemon.disconnect();
  
  console.log('优雅关闭完成');
  process.exit(0);
});
```

---

### Q: Docker 部署示例？

**A:** Dockerfile 示例：

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "index.js"]
```

docker-compose.yml:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - KEMON_HIDY_API_KEY=${KEMON_HIDY_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

### Q: 如何监控性能？

**A:** 添加性能监控：

```javascript
// 请求计时
kemon.on('request', (details) => {
  details.startTime = Date.now();
});

kemon.on('response', (details) => {
  const duration = Date.now() - details.startTime;
  console.log(`请求耗时: ${duration}ms`);
  
  // 上报到监控系统
  metrics.recordTiming('kemon_hidy.request.duration', duration);
});

// 统计错误率
let totalRequests = 0;
let errorRequests = 0;

kemon.on('response', () => totalRequests++);
kemon.on('error', () => errorRequests++);

setInterval(() => {
  const errorRate = (errorRequests / totalRequests * 100).toFixed(2);
  console.log(`错误率: ${errorRate}%`);
  metrics.recordGauge('kemon_hidy.error_rate', errorRate);
}, 60000); // 每分钟统计
```

---

## 其他问题

### Q: 支持离线模式吗？

**A:** 可以实现离线队列：

```javascript
class OfflineQueue {
  constructor(kemon) {
    this.kemon = kemon;
    this.queue = [];
    this.online = true;

    // 监听网络状态
    window.addEventListener('online', () => this.goOnline());
    window.addEventListener('offline', () => this.goOffline());
  }

  async execute(operation) {
    if (!this.online) {
      this.queue.push(operation);
      return { queued: true };
    }

    try {
      return await operation();
    } catch (error) {
      if (error.name === 'NetworkError') {
        this.queue.push(operation);
        this.goOffline();
      }
      throw error;
    }
  }

  goOffline() {
    this.online = false;
    console.log('离线模式');
  }

  async goOnline() {
    this.online = true;
    console.log('在线模式，处理队列...');

    while (this.queue.length > 0) {
      const operation = this.queue.shift();
      try {
        await operation();
      } catch (error) {
        console.error('队列操作失败:', error);
        this.queue.unshift(operation);
        break;
      }
    }
  }
}
```

---

### Q: 如何迁移数据？

**A:** 使用导出和导入工具：

```javascript
// 导出数据
async function exportData(filename) {
  const allData = [];
  let offset = 0;

  while (true) {
    const batch = await kemon.getData({ limit: 1000, offset });
    if (batch.length === 0) break;
    
    allData.push(...batch);
    offset += 1000;
  }

  fs.writeFileSync(filename, JSON.stringify(allData, null, 2));
  console.log(`导出完成: ${allData.length} 条记录`);
}

// 导入数据
async function importData(filename) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  
  for (const item of data) {
    await kemon.setData(item);
  }

  console.log(`导入完成: ${data.length} 条记录`);
}
```

---

## 获取更多帮助

如果您的问题未在此列出：

- 📖 查看[完整文档](./API.md)
- 💬 访问[社区论坛](https://community.kemonhidy.com)
- 🐛 提交[GitHub Issue](https://github.com/yourusername/kemon_hidy/issues)
- ✉️ 发送邮件至 support@kemonhidy.com

---

**文档持续更新中，欢迎贡献！**
