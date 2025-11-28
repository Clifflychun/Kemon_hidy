# 贡献指南

感谢您考虑为 Kemon_hidy 项目做出贡献！本文档将指导您完成贡献流程。

## 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试要求](#测试要求)
- [文档编写](#文档编写)

---

## 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们作为贡献者和维护者承诺：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 人身攻击或政治攻击
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他在专业环境中被认为不适当的行为

---

## 如何贡献

### 报告 Bug

如果您发现了 bug，请创建一个 Issue，并包含以下信息：

1. **Bug 描述**：清晰简洁地描述问题
2. **复现步骤**：详细列出重现问题的步骤
3. **预期行为**：描述您期望发生什么
4. **实际行为**：描述实际发生了什么
5. **环境信息**：
   - 操作系统和版本
   - 项目版本
   - 相关依赖版本
6. **截图**：如果适用，添加截图帮助说明问题

#### Bug 报告模板

```markdown
## Bug 描述
[清晰简洁地描述 bug]

## 复现步骤
1. [第一步]
2. [第二步]
3. [第三步]

## 预期行为
[描述您期望发生什么]

## 实际行为
[描述实际发生了什么]

## 环境信息
- 操作系统: [如 macOS 13.0]
- 项目版本: [如 1.0.0]
- Node.js 版本: [如 18.0.0]

## 截图
[如果适用，添加截图]

## 额外信息
[添加其他相关信息]
```

---

### 提出新功能

在提出新功能之前，请：

1. 搜索现有的 Issues，确认该功能尚未被提议
2. 考虑该功能是否符合项目的范围和目标
3. 创建一个 Issue，使用以下模板：

```markdown
## 功能描述
[清晰描述建议的功能]

## 动机
[解释为什么需要这个功能]

## 建议的实现
[如果有具体想法，描述如何实现]

## 替代方案
[描述您考虑过的其他替代方案]

## 额外信息
[添加其他相关信息、模拟图等]
```

---

## 开发流程

### 1. Fork 项目

点击 GitHub 页面右上角的 "Fork" 按钮。

### 2. 克隆仓库

```bash
git clone https://github.com/your-username/kemon_hidy.git
cd kemon_hidy
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

分支命名规范：
- `feature/功能名称`: 新功能
- `fix/问题描述`: Bug 修复
- `docs/文档说明`: 文档更新
- `refactor/重构说明`: 代码重构
- `test/测试说明`: 测试相关
- `chore/任务说明`: 构建或辅助工具变动

### 4. 安装依赖

```bash
# Node.js 项目
npm install

# Python 项目
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Go 项目
go mod download
```

### 5. 进行开发

- 遵循项目的代码规范
- 编写清晰的代码和注释
- 添加必要的测试
- 更新相关文档

### 6. 运行测试

```bash
# Node.js
npm test
npm run lint

# Python
pytest
flake8 .

# Go
go test ./...
go vet ./...
```

### 7. 提交更改

```bash
git add .
git commit -m "feat: 添加新功能描述"
```

请遵循[提交规范](#提交规范)。

### 8. 推送到 Fork

```bash
git push origin feature/your-feature-name
```

### 9. 创建 Pull Request

1. 访问您的 Fork 页面
2. 点击 "New Pull Request"
3. 填写 PR 描述，使用以下模板：

```markdown
## 变更说明
[描述此 PR 的主要变更]

## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 测试相关
- [ ] 其他

## 相关 Issue
关闭 #[issue 编号]

## 测试
[描述您如何测试这些变更]

## 截图（如适用）
[添加截图]

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已添加必要的测试
- [ ] 所有测试通过
- [ ] 已更新相关文档
- [ ] 已添加/更新必要的注释
```

---

## 代码规范

### JavaScript/TypeScript

遵循 ESLint 和 Prettier 配置：

```javascript
// 使用 const 和 let，避免 var
const API_KEY = 'xxx';
let count = 0;

// 使用箭头函数
const add = (a, b) => a + b;

// 使用解构
const { name, age } = user;

// 使用模板字符串
const message = `Hello, ${name}!`;

// 使用 async/await
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 函数注释
/**
 * 计算两个数的和
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b;
}
```

### Python

遵循 PEP 8 规范：

```python
# 导入顺序：标准库、第三方库、本地模块
import os
import sys

import requests
import numpy as np

from .utils import helper_function

# 类命名使用大驼峰
class UserManager:
    """用户管理类"""
    
    def __init__(self, config):
        """初始化用户管理器
        
        Args:
            config (dict): 配置字典
        """
        self.config = config
    
    def get_user(self, user_id):
        """获取用户信息
        
        Args:
            user_id (int): 用户ID
            
        Returns:
            dict: 用户信息字典
            
        Raises:
            ValueError: 当用户ID无效时
        """
        if not isinstance(user_id, int):
            raise ValueError("用户ID必须是整数")
        # 实现逻辑
        return {}

# 函数命名使用小写加下划线
def process_data(data):
    """处理数据"""
    pass

# 常量使用全大写
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30
```

### 通用规范

#### 命名规范

- **变量和函数**：使用描述性名称
  ```javascript
  // 好
  const userCount = 10;
  function calculateTotalPrice() {}
  
  // 不好
  const n = 10;
  function calc() {}
  ```

- **类和组件**：使用大驼峰命名
  ```javascript
  class UserManager {}
  function UserProfile() {}
  ```

- **常量**：使用全大写加下划线
  ```javascript
  const MAX_RETRY_COUNT = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

#### 注释规范

```javascript
// 单行注释：解释为什么这样做，而不是做了什么

/**
 * 多行注释：函数/类的文档注释
 * 包含参数、返回值、异常等信息
 */

// TODO: 待办事项
// FIXME: 需要修复的问题
// NOTE: 重要说明
```

#### 代码组织

```javascript
// 1. 导入语句
import React from 'react';
import { Button } from './components';

// 2. 常量定义
const MAX_COUNT = 100;

// 3. 类型定义
interface User {
  id: number;
  name: string;
}

// 4. 主要逻辑
function Component() {
  // 实现
}

// 5. 导出
export default Component;
```

---

## 提交规范

使用 Conventional Commits 规范：

### 格式

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

### 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动
- `ci`: CI 配置变更
- `revert`: 回滚提交

### 示例

```bash
# 新功能
git commit -m "feat(auth): 添加用户登录功能"

# Bug 修复
git commit -m "fix(api): 修复数据获取时的空指针异常"

# 文档更新
git commit -m "docs(readme): 更新安装说明"

# 代码格式
git commit -m "style: 格式化代码，统一缩进"

# 重构
git commit -m "refactor(utils): 重构数据处理函数"

# 性能优化
git commit -m "perf(render): 优化列表渲染性能"

# 测试
git commit -m "test(api): 添加API单元测试"

# 破坏性变更
git commit -m "feat(api): 重构API接口

BREAKING CHANGE: API端点从 /v1 改为 /v2"
```

---

## 测试要求

### 单元测试

每个函数和类都应该有对应的单元测试：

```javascript
// utils.js
export function add(a, b) {
  return a + b;
}

// utils.test.js
import { add } from './utils';

describe('add', () => {
  it('should add two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(-1, 1)).toBe(0);
  });
  
  it('should handle edge cases', () => {
    expect(add(0, 0)).toBe(0);
    expect(add(Infinity, 1)).toBe(Infinity);
  });
});
```

### 集成测试

测试多个组件的协作：

```javascript
describe('User Registration Flow', () => {
  it('should register a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await api.register(userData);
    expect(response.status).toBe(201);
    expect(response.data.user.username).toBe(userData.username);
  });
});
```

### 测试覆盖率

- 目标：至少 80% 的代码覆盖率
- 关键路径必须 100% 覆盖
- 运行覆盖率报告：
  ```bash
  npm run test:coverage
  ```

---

## 文档编写

### API 文档

每个公共 API 都需要详细文档：

```javascript
/**
 * 获取用户信息
 * 
 * @param {string} userId - 用户ID
 * @param {Object} options - 选项对象
 * @param {boolean} [options.includeProfile=false] - 是否包含详细信息
 * @param {number} [options.timeout=5000] - 请求超时时间（毫秒）
 * @returns {Promise<User>} 返回用户对象
 * @throws {NotFoundError} 当用户不存在时
 * @throws {NetworkError} 当网络请求失败时
 * 
 * @example
 * const user = await getUser('123', { includeProfile: true });
 * console.log(user.name);
 */
async function getUser(userId, options = {}) {
  // 实现
}
```

### README 更新

如果您的更改影响用户使用方式，请更新 README：

- 添加新功能的使用示例
- 更新安装说明
- 添加配置说明
- 更新 FAQ

### 变更日志

重要更改应记录在 CHANGELOG.md 中：

```markdown
## [1.2.0] - 2025-01-15

### 新增
- 添加用户认证功能
- 支持数据导出为 CSV 格式

### 修复
- 修复分页组件的边界问题
- 修复内存泄漏

### 变更
- 升级依赖版本
- 改进错误消息

### 废弃
- `oldFunction()` 将在 v2.0 中移除，请使用 `newFunction()`
```

---

## 代码审查

### 审查清单

提交 PR 后，维护者会审查以下方面：

- [ ] 代码质量和可读性
- [ ] 是否遵循项目规范
- [ ] 测试覆盖是否充分
- [ ] 文档是否完整
- [ ] 性能影响
- [ ] 安全问题
- [ ] 向后兼容性

### 回应反馈

- 积极回应审查意见
- 如有不同意见，礼貌地讨论
- 及时更新代码
- 感谢审查者的时间和建议

---

## 发布流程

### 版本号规范

遵循语义化版本 (Semantic Versioning)：

- **主版本号 (MAJOR)**：不兼容的 API 变更
- **次版本号 (MINOR)**：向下兼容的功能新增
- **修订号 (PATCH)**：向下兼容的问题修正

示例：`1.2.3`
- 1: 主版本号
- 2: 次版本号
- 3: 修订号

### 发布步骤

1. 更新版本号
2. 更新 CHANGELOG.md
3. 提交变更
4. 创建标签
5. 推送到远程
6. 创建 Release

```bash
# 更新版本
npm version patch  # 或 minor、major

# 提交和推送
git push origin main --tags

# 发布（如果是 npm 包）
npm publish
```

---

## 获取帮助

如果您有任何问题：

- 查看[文档](./docs/)
- 搜索[现有 Issues](https://github.com/yourusername/kemon_hidy/issues)
- 加入我们的[讨论区](https://github.com/yourusername/kemon_hidy/discussions)
- 发送邮件至: your.email@example.com

---

## 许可证

通过贡献代码，您同意您的贡献将在与项目相同的许可证下发布。

---

再次感谢您的贡献！ 🎉
