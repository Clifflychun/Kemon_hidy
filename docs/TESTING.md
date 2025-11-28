# 测试指南

本文档说明如何为 Kemon_hidy 项目编写和运行测试。

## 目录

- [测试框架](#测试框架)
- [测试类型](#测试类型)
- [编写测试](#编写测试)
- [运行测试](#运行测试)
- [测试覆盖率](#测试覆盖率)
- [最佳实践](#最佳实践)

---

## 测试框架

### JavaScript/TypeScript

我们使用以下测试框架：

- **Jest**: 单元测试和集成测试框架
- **Supertest**: HTTP API 测试
- **Testing Library**: React 组件测试
- **Cypress**: 端到端测试

### 安装测试依赖

```bash
npm install --save-dev jest @types/jest
npm install --save-dev supertest @types/supertest
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev cypress
```

### 配置 Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## 测试类型

### 1. 单元测试

测试单个函数或类的功能。

#### 示例：测试工具函数

```javascript
// src/utils/formatters.ts
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

// tests/utils/formatters.test.ts
import { formatPrice } from '../../src/utils/formatters';

describe('formatPrice', () => {
  it('should format USD correctly', () => {
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('should handle other currencies', () => {
    expect(formatPrice(100, 'EUR')).toBe('€100.00');
    expect(formatPrice(100, 'GBP')).toBe('£100.00');
  });

  it('should handle zero and negative values', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(-50)).toBe('-$50.00');
  });
});
```

#### 示例：测试类方法

```javascript
// src/services/DataService.ts
export class DataService {
  private cache: Map<string, any>;

  constructor() {
    this.cache = new Map();
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// tests/services/DataService.test.ts
import { DataService } from '../../src/services/DataService';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    service = new DataService();
  });

  afterEach(() => {
    service.clear();
  });

  describe('get and set', () => {
    it('should store and retrieve values', () => {
      service.set('key1', 'value1');
      expect(service.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent keys', () => {
      expect(service.get('nonexistent')).toBeUndefined();
    });

    it('should overwrite existing values', () => {
      service.set('key1', 'value1');
      service.set('key1', 'value2');
      expect(service.get('key1')).toBe('value2');
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      service.set('key1', 'value1');
      expect(service.has('key1')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(service.has('nonexistent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.clear();
      expect(service.has('key1')).toBe(false);
      expect(service.has('key2')).toBe(false);
    });
  });
});
```

---

### 2. 集成测试

测试多个组件的协作。

#### 示例：测试 API 端点

```javascript
// tests/integration/api.test.ts
import request from 'supertest';
import app from '../../src/app';
import { KemonHidy } from '../../src';

describe('API Integration Tests', () => {
  let kemon: KemonHidy;

  beforeAll(async () => {
    kemon = new KemonHidy({ apiKey: process.env.TEST_API_KEY });
    await kemon.initialize();
  });

  afterAll(async () => {
    await kemon.disconnect();
  });

  describe('GET /api/items', () => {
    it('should return list of items', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/items?limit=5&offset=0')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should support filtering', async () => {
      const response = await request(app)
        .get('/api/items?filter=status:active')
        .expect(200);

      const items = response.body.data;
      items.forEach((item: any) => {
        expect(item.status).toBe('active');
      });
    });
  });

  describe('POST /api/items', () => {
    it('should create new item', async () => {
      const newItem = {
        name: 'Test Item',
        value: 100
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(newItem);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/items/:id', () => {
    let itemId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Test', value: 100 });
      itemId = response.body.data.id;
    });

    it('should update existing item', async () => {
      const updates = { name: 'Updated', value: 200 };

      const response = await request(app)
        .put(`/api/items/${itemId}`)
        .send(updates)
        .expect(200);

      expect(response.body.data).toMatchObject(updates);
    });

    it('should return 404 for non-existent item', async () => {
      await request(app)
        .put('/api/items/nonexistent')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('DELETE /api/items/:id', () => {
    let itemId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Test', value: 100 });
      itemId = response.body.data.id;
    });

    it('should delete existing item', async () => {
      await request(app)
        .delete(`/api/items/${itemId}`)
        .expect(200);

      // 验证已删除
      await request(app)
        .get(`/api/items/${itemId}`)
        .expect(404);
    });
  });
});
```

---

### 3. React 组件测试

测试 React 组件的渲染和交互。

#### 示例：测试按钮组件

```jsx
// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  type?: 'default' | 'primary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'default',
  disabled = false,
  loading = false,
  onClick,
  children
}) => {
  return (
    <button
      className={`btn btn-${type}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// tests/components/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply correct type class', () => {
    const { rerender } = render(<Button type="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');

    rerender(<Button type="danger">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not trigger onClick when loading', () => {
    const handleClick = jest.fn();
    render(<Button loading onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

### 4. 端到端测试 (E2E)

使用 Cypress 测试完整的用户流程。

#### 示例：用户登录流程

```javascript
// cypress/e2e/login.cy.js
describe('User Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('请输入用户名').should('be.visible');
    cy.contains('请输入密码').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // 验证重定向到首页
    cy.url().should('include', '/dashboard');
    cy.contains('欢迎, testuser').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.contains('用户名或密码错误').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should persist session after page refresh', () => {
    // 先登录
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');

    // 刷新页面
    cy.reload();

    // 验证仍然登录
    cy.url().should('include', '/dashboard');
    cy.contains('欢迎, testuser').should('be.visible');
  });
});
```

---

## 测试异步代码

### 使用 async/await

```javascript
describe('Async Operations', () => {
  it('should fetch data successfully', async () => {
    const data = await kemon.getData({ limit: 10 });
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should handle errors', async () => {
    await expect(
      kemon.getData({ invalidParam: true })
    ).rejects.toThrow('Invalid parameter');
  });
});
```

### 使用 done 回调

```javascript
describe('Callback-based Operations', () => {
  it('should complete async operation', (done) => {
    kemon.getData({ limit: 10 }, (error, data) => {
      expect(error).toBeNull();
      expect(data).toBeDefined();
      done();
    });
  });
});
```

---

## Mock 和 Stub

### Mock 函数

```javascript
describe('With Mocks', () => {
  it('should call API with correct parameters', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    });

    global.fetch = mockFetch;

    await kemon.getData({ limit: 10 });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('limit=10'),
      expect.any(Object)
    );
  });
});
```

### Mock 模块

```javascript
// tests/mocks/kemon-hidy.ts
export const mockGetData = jest.fn();
export const mockSetData = jest.fn();

jest.mock('kemon-hidy', () => ({
  KemonHidy: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    getData: mockGetData,
    setData: mockSetData,
    disconnect: jest.fn()
  }))
}));

// tests/mytest.test.ts
import { mockGetData } from './mocks/kemon-hidy';

describe('My Test', () => {
  it('should use mocked getData', async () => {
    mockGetData.mockResolvedValue([{ id: 1, name: 'Test' }]);

    const result = await kemon.getData({ limit: 10 });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test');
  });
});
```

---

## 测试覆盖率

### 生成覆盖率报告

```bash
# Jest
npm test -- --coverage

# 查看 HTML 报告
open coverage/lcov-report/index.html
```

### 覆盖率配置

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,ts}',
    '!src/**/index.{js,ts}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // 特定文件的要求
    './src/core/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

---

## 运行测试

### 命令行

```bash
# 运行所有测试
npm test

# 运行特定文件
npm test -- path/to/test.test.ts

# 监听模式
npm test -- --watch

# 仅运行失败的测试
npm test -- --onlyFailures

# 更新快照
npm test -- --updateSnapshot

# 生成覆盖率
npm test -- --coverage

# 运行 E2E 测试
npm run cypress:open   # 打开 Cypress UI
npm run cypress:run    # 无头模式运行
```

### package.json 脚本

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:all": "npm test && npm run test:e2e"
  }
}
```

---

## 最佳实践

### 1. 测试命名

使用清晰描述性的名称：

```javascript
// ❌ 不好
it('test 1', () => {});

// ✅ 好
it('should return empty array when no data exists', () => {});
```

### 2. AAA 模式

遵循 Arrange-Act-Assert 模式：

```javascript
it('should calculate total price correctly', () => {
  // Arrange - 准备测试数据
  const items = [
    { price: 10, quantity: 2 },
    { price: 20, quantity: 1 }
  ];

  // Act - 执行被测试的代码
  const total = calculateTotal(items);

  // Assert - 验证结果
  expect(total).toBe(40);
});
```

### 3. 测试隔离

每个测试应该独立：

```javascript
describe('DataService', () => {
  let service: DataService;

  // 每个测试前创建新实例
  beforeEach(() => {
    service = new DataService();
  });

  // 每个测试后清理
  afterEach(() => {
    service.clear();
  });

  it('test 1', () => {
    // 不会影响其他测试
  });

  it('test 2', () => {
    // 独立运行
  });
});
```

### 4. 避免测试实现细节

测试行为而不是实现：

```javascript
// ❌ 测试实现细节
it('should call internal method', () => {
  const spy = jest.spyOn(service, 'internalMethod');
  service.publicMethod();
  expect(spy).toHaveBeenCalled();
});

// ✅ 测试行为
it('should return correct result', () => {
  const result = service.publicMethod();
  expect(result).toBe(expectedValue);
});
```

### 5. 使用测试数据工厂

创建可重用的测试数据：

```javascript
// tests/factories/user.factory.ts
export function createUser(overrides = {}) {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  };
}

// 使用
const admin = createUser({ role: 'admin' });
const user = createUser({ email: 'custom@example.com' });
```

### 6. 参数化测试

测试多种输入情况：

```javascript
describe.each([
  [1, 2, 3],
  [10, 20, 30],
  [-1, -2, -3]
])('add(%i, %i)', (a, b, expected) => {
  it(`should return ${expected}`, () => {
    expect(add(a, b)).toBe(expected);
  });
});
```

### 7. 快照测试

用于 UI 组件回归测试：

```javascript
it('should render correctly', () => {
  const { container } = render(<MyComponent />);
  expect(container).toMatchSnapshot();
});
```

### 8. 测试边界情况

```javascript
describe('divide', () => {
  it('should divide positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  it('should handle decimal results', () => {
    expect(divide(10, 3)).toBeCloseTo(3.33, 2);
  });
});
```

---

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 调试测试

### VSCode 配置

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

---

## 相关资源

- [Jest 文档](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Cypress 文档](https://www.cypress.io/)
- [测试最佳实践](https://testingjavascript.com/)

---

**记住：好的测试是代码质量的保障！**
