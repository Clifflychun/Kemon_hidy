# 示例代码

本目录包含 Kemon_hidy 项目的各种使用示例。

## 目录

- [基础示例](#基础示例)
- [高级示例](#高级示例)
- [集成示例](#集成示例)
- [真实场景](#真实场景)

---

## 基础示例

### 1. 快速开始

最简单的使用方式：

```javascript
// examples/01-quick-start.js
const { KemonHidy } = require('kemon-hidy');

// 创建实例
const kemon = new KemonHidy({
  apiKey: 'your-api-key-here',
  timeout: 5000
});

// 初始化
async function main() {
  try {
    await kemon.initialize();
    console.log('初始化成功！');
    
    // 执行操作
    const result = await kemon.getData({ limit: 10 });
    console.log('数据:', result);
    
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await kemon.disconnect();
  }
}

main();
```

### 2. 基本 CRUD 操作

```javascript
// examples/02-crud-operations.js
const { KemonHidy } = require('kemon-hidy');

const kemon = new KemonHidy({ apiKey: process.env.API_KEY });

async function crudDemo() {
  await kemon.initialize();
  
  // Create - 创建数据
  const newItem = await kemon.setData({
    name: '测试项目',
    value: 100,
    tags: ['demo', 'test']
  });
  console.log('创建:', newItem);
  
  // Read - 读取数据
  const items = await kemon.getData({
    filter: 'tags:demo',
    limit: 10
  });
  console.log('读取:', items);
  
  // Update - 更新数据
  const updated = await kemon.setData({
    id: newItem.id,
    name: '更新后的项目',
    value: 200
  });
  console.log('更新:', updated);
  
  // Delete - 删除数据
  await kemon.delete(newItem.id);
  console.log('删除成功');
  
  await kemon.disconnect();
}

crudDemo();
```

### 3. 事件监听

```javascript
// examples/03-event-listeners.js
const { KemonHidy } = require('kemon-hidy');

const kemon = new KemonHidy({ apiKey: process.env.API_KEY });

// 连接事件
kemon.on('connected', () => {
  console.log('✅ 已连接到服务器');
});

// 断开事件
kemon.on('disconnected', () => {
  console.log('❌ 连接已断开');
});

// 数据事件
kemon.on('data', (data) => {
  console.log('📦 接收到数据:', data);
});

// 错误事件
kemon.on('error', (error) => {
  console.error('❗ 错误:', error.message);
});

async function eventDemo() {
  await kemon.initialize();
  
  // 执行一些操作
  await kemon.getData({ limit: 5 });
  
  // 等待一段时间
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await kemon.disconnect();
}

eventDemo();
```

---

## 高级示例

### 4. 错误处理和重试

```javascript
// examples/04-error-handling.js
const { KemonHidy, retry } = require('kemon-hidy');

const kemon = new KemonHidy({
  apiKey: process.env.API_KEY,
  retries: 3,
  timeout: 10000
});

async function robustOperation() {
  try {
    await kemon.initialize();
    
    // 使用重试机制
    const result = await retry(
      async () => {
        return await kemon.getData({ limit: 100 });
      },
      3,    // 最多重试3次
      1000  // 每次间隔1秒
    );
    
    console.log('成功获取数据:', result.length, '条');
    
  } catch (error) {
    // 分类处理不同类型的错误
    if (error.name === 'ConnectionError') {
      console.error('连接错误，请检查网络');
    } else if (error.name === 'AuthenticationError') {
      console.error('认证失败，请检查 API 密钥');
    } else if (error.name === 'RateLimitError') {
      console.error('请求过于频繁，请稍后再试');
    } else {
      console.error('未知错误:', error);
    }
  } finally {
    await kemon.disconnect();
  }
}

robustOperation();
```

### 5. 批量操作

```javascript
// examples/05-batch-operations.js
const { KemonHidy, parallel } = require('kemon-hidy');

const kemon = new KemonHidy({ apiKey: process.env.API_KEY });

async function batchDemo() {
  await kemon.initialize();
  
  // 批量创建数据
  const items = [
    { name: '项目1', value: 100 },
    { name: '项目2', value: 200 },
    { name: '项目3', value: 300 }
  ];
  
  console.log('批量创建中...');
  const results = await parallel(
    items.map(item => () => kemon.setData(item))
  );
  console.log('创建完成:', results);
  
  // 批量读取
  console.log('批量读取中...');
  const allData = await parallel([
    () => kemon.getData({ filter: 'value:>100' }),
    () => kemon.getData({ filter: 'value:<=100' }),
    () => kemon.getData({ sort: 'createdAt:desc', limit: 10 })
  ]);
  console.log('读取结果:', allData);
  
  // 批量删除
  console.log('批量删除中...');
  await parallel(
    results.map(item => () => kemon.delete(item.id))
  );
  console.log('删除完成');
  
  await kemon.disconnect();
}

batchDemo();
```

### 6. 数据流式处理

```javascript
// examples/06-streaming.js
const { KemonHidy } = require('kemon-hidy');

const kemon = new KemonHidy({ apiKey: process.env.API_KEY });

async function streamingDemo() {
  await kemon.initialize();
  
  let processedCount = 0;
  const batchSize = 50;
  let offset = 0;
  
  console.log('开始流式处理...');
  
  while (true) {
    // 分批获取数据
    const batch = await kemon.getData({
      limit: batchSize,
      offset: offset
    });
    
    if (batch.length === 0) {
      break; // 没有更多数据
    }
    
    // 处理当前批次
    for (const item of batch) {
      // 处理每个项目
      await processItem(item);
      processedCount++;
    }
    
    console.log(`已处理 ${processedCount} 条记录...`);
    offset += batchSize;
    
    // 避免请求过快
    await sleep(100);
  }
  
  console.log(`流式处理完成，共处理 ${processedCount} 条记录`);
  await kemon.disconnect();
}

async function processItem(item) {
  // 模拟数据处理
  // 实际应用中可以是：数据转换、验证、存储等
  return item;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

streamingDemo();
```

---

## 集成示例

### 7. 与 Express 集成

```javascript
// examples/07-express-integration.js
const express = require('express');
const { KemonHidy } = require('kemon-hidy');

const app = express();
const kemon = new KemonHidy({ apiKey: process.env.API_KEY });

app.use(express.json());

// 初始化
kemon.initialize().then(() => {
  console.log('Kemon_hidy 已初始化');
});

// GET - 获取所有数据
app.get('/api/items', async (req, res) => {
  try {
    const { limit = 10, offset = 0, filter } = req.query;
    const data = await kemon.getData({ limit, offset, filter });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - 获取单个项目
app.get('/api/items/:id', async (req, res) => {
  try {
    const data = await kemon.getData({ filter: `id:${req.params.id}` });
    if (data.length === 0) {
      return res.status(404).json({ success: false, error: '未找到' });
    }
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - 创建新项目
app.post('/api/items', async (req, res) => {
  try {
    const result = await kemon.setData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - 更新项目
app.put('/api/items/:id', async (req, res) => {
  try {
    const result = await kemon.setData({
      id: req.params.id,
      ...req.body
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - 删除项目
app.delete('/api/items/:id', async (req, res) => {
  try {
    await kemon.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM，关闭服务器...');
  await kemon.disconnect();
  process.exit(0);
});
```

### 8. React 集成

```jsx
// examples/08-react-integration.jsx
import React, { useState, useEffect } from 'react';
import { KemonHidy } from 'kemon-hidy';

// 创建全局实例
const kemon = new KemonHidy({ apiKey: process.env.REACT_APP_API_KEY });

// 自定义 Hook
function useKemonData(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        await kemon.initialize();
        const result = await kemon.getData(query);
        
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [query]);

  return { data, loading, error };
}

// 数据列表组件
function DataList() {
  const { data, loading, error } = useKemonData({ limit: 10 });
  const [newItem, setNewItem] = useState({ name: '', value: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await kemon.setData(newItem);
      setNewItem({ name: '', value: '' });
      // 刷新列表
      window.location.reload();
    } catch (error) {
      alert('创建失败: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除吗？')) {
      try {
        await kemon.delete(id);
        window.location.reload();
      } catch (error) {
        alert('删除失败: ' + error.message);
      }
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <h1>数据列表</h1>
      
      {/* 创建表单 */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名称"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="值"
          value={newItem.value}
          onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
          required
        />
        <button type="submit">添加</button>
      </form>

      {/* 数据列表 */}
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <span>{item.name}: {item.value}</span>
            <button onClick={() => handleDelete(item.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataList;
```

---

## 真实场景

### 9. 实时数据同步

```javascript
// examples/09-real-time-sync.js
const { KemonHidy } = require('kemon-hidy');

class DataSynchronizer {
  constructor(apiKey) {
    this.kemon = new KemonHidy({ apiKey });
    this.localCache = new Map();
    this.syncInterval = null;
  }

  async start() {
    await this.kemon.initialize();
    
    // 监听数据更新
    this.kemon.on('data', (data) => {
      this.handleDataUpdate(data);
    });

    // 初始数据加载
    await this.syncAll();

    // 定期同步
    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, 30000); // 每30秒同步一次

    console.log('数据同步器已启动');
  }

  async syncAll() {
    try {
      const data = await this.kemon.getData({ limit: 1000 });
      
      // 更新本地缓存
      data.forEach(item => {
        this.localCache.set(item.id, item);
      });
      
      console.log(`同步完成: ${data.length} 条记录`);
    } catch (error) {
      console.error('同步失败:', error.message);
    }
  }

  handleDataUpdate(data) {
    console.log('接收到数据更新:', data);
    
    if (Array.isArray(data)) {
      data.forEach(item => {
        this.localCache.set(item.id, item);
      });
    } else {
      this.localCache.set(data.id, data);
    }
  }

  getLocal(id) {
    return this.localCache.get(id);
  }

  getAllLocal() {
    return Array.from(this.localCache.values());
  }

  async stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    await this.kemon.disconnect();
    console.log('数据同步器已停止');
  }
}

// 使用示例
async function main() {
  const sync = new DataSynchronizer(process.env.API_KEY);
  
  await sync.start();
  
  // 运行一段时间
  setTimeout(async () => {
    console.log('本地缓存数据:', sync.getAllLocal());
    await sync.stop();
  }, 60000);
}

main();
```

### 10. 数据导出工具

```javascript
// examples/10-data-export.js
const { KemonHidy, formatData } = require('kemon-hidy');
const fs = require('fs');

class DataExporter {
  constructor(apiKey) {
    this.kemon = new KemonHidy({ apiKey });
  }

  async exportToJSON(filename, filter = {}) {
    await this.kemon.initialize();
    
    console.log('开始导出到 JSON...');
    const data = await this.getAllData(filter);
    
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filename, json);
    
    console.log(`导出完成: ${filename} (${data.length} 条记录)`);
    await this.kemon.disconnect();
  }

  async exportToCSV(filename, filter = {}) {
    await this.kemon.initialize();
    
    console.log('开始导出到 CSV...');
    const data = await this.getAllData(filter);
    
    if (data.length === 0) {
      console.log('没有数据可导出');
      return;
    }

    // CSV 标题行
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';

    // 数据行
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // 处理包含逗号的值
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      });
      csv += values.join(',') + '\n';
    });

    fs.writeFileSync(filename, csv);
    
    console.log(`导出完成: ${filename} (${data.length} 条记录)`);
    await this.kemon.disconnect();
  }

  async getAllData(filter) {
    const allData = [];
    const batchSize = 100;
    let offset = 0;

    while (true) {
      const batch = await this.kemon.getData({
        ...filter,
        limit: batchSize,
        offset: offset
      });

      if (batch.length === 0) break;

      allData.push(...batch);
      offset += batchSize;

      console.log(`已获取 ${allData.length} 条记录...`);
    }

    return allData;
  }
}

// 使用示例
async function main() {
  const exporter = new DataExporter(process.env.API_KEY);

  // 导出为 JSON
  await exporter.exportToJSON('data-export.json', {
    filter: 'status:active'
  });

  // 导出为 CSV
  await exporter.exportToCSV('data-export.csv', {
    filter: 'createdAt:>2025-01-01'
  });
}

main();
```

---

## 运行示例

### 前置要求

1. 安装依赖:
```bash
npm install
```

2. 设置环境变量:
```bash
export API_KEY=your-api-key-here
```

### 运行单个示例

```bash
node examples/01-quick-start.js
node examples/02-crud-operations.js
# ... 依此类推
```

### 运行所有示例

```bash
npm run examples
```

---

## 更多资源

- [API 文档](../docs/API.md)
- [函数文档](../docs/FUNCTIONS.md)
- [组件文档](../docs/COMPONENTS.md)
- [贡献指南](../CONTRIBUTING.md)

---

如有问题，请[提交 Issue](https://github.com/yourusername/kemon_hidy/issues)。
