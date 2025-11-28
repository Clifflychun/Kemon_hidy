# 组件文档

本文档详细说明了 Kemon_hidy 项目中所有可重用组件的使用方法。

## 目录

- [UI 组件](#ui-组件)
- [表单组件](#表单组件)
- [数据展示组件](#数据展示组件)
- [布局组件](#布局组件)
- [反馈组件](#反馈组件)
- [导航组件](#导航组件)

---

## UI 组件

### Button 按钮

通用按钮组件，支持多种样式和状态。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| type | String | 'default' | 否 | 按钮类型：'default', 'primary', 'secondary', 'danger' |
| size | String | 'medium' | 否 | 按钮大小：'small', 'medium', 'large' |
| disabled | Boolean | false | 否 | 是否禁用 |
| loading | Boolean | false | 否 | 是否显示加载状态 |
| onClick | Function | - | 否 | 点击事件处理函数 |
| children | ReactNode | - | 是 | 按钮内容 |

#### 示例

```jsx
import { Button } from 'kemon-hidy';

// 基础用法
<Button type="primary" onClick={() => console.log('点击')}>
  点击我
</Button>

// 不同尺寸
<Button size="small">小按钮</Button>
<Button size="medium">中按钮</Button>
<Button size="large">大按钮</Button>

// 加载状态
<Button loading={true}>加载中...</Button>

// 禁用状态
<Button disabled={true}>禁用按钮</Button>

// 危险操作
<Button type="danger" onClick={handleDelete}>
  删除
</Button>
```

#### 样式定制

```css
/* 自定义按钮样式 */
.kh-button {
  --button-bg-color: #007bff;
  --button-text-color: white;
  --button-border-radius: 4px;
}
```

---

### Input 输入框

文本输入组件，支持多种输入类型和验证。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| type | String | 'text' | 否 | 输入类型：'text', 'password', 'email', 'number' |
| value | String/Number | '' | 否 | 输入值 |
| placeholder | String | '' | 否 | 占位符文本 |
| disabled | Boolean | false | 否 | 是否禁用 |
| maxLength | Number | - | 否 | 最大长度 |
| onChange | Function | - | 否 | 值变化时的回调 |
| onBlur | Function | - | 否 | 失焦时的回调 |
| error | String | - | 否 | 错误信息 |
| prefix | ReactNode | - | 否 | 前缀图标或文本 |
| suffix | ReactNode | - | 否 | 后缀图标或文本 |

#### 示例

```jsx
import { Input } from 'kemon-hidy';

// 基础用法
<Input
  placeholder="请输入内容"
  onChange={(e) => setValue(e.target.value)}
/>

// 密码输入
<Input
  type="password"
  placeholder="请输入密码"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// 带错误提示
<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  placeholder="请输入邮箱"
/>

// 带前缀和后缀
<Input
  prefix={<SearchIcon />}
  suffix={<ClearButton onClick={handleClear} />}
  placeholder="搜索..."
/>
```

---

### Card 卡片

容器组件，用于内容分组展示。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| title | String/ReactNode | - | 否 | 卡片标题 |
| extra | ReactNode | - | 否 | 右上角额外内容 |
| bordered | Boolean | true | 否 | 是否显示边框 |
| hoverable | Boolean | false | 否 | 鼠标悬停效果 |
| loading | Boolean | false | 否 | 加载状态 |
| children | ReactNode | - | 是 | 卡片内容 |

#### 示例

```jsx
import { Card } from 'kemon-hidy';

// 基础卡片
<Card title="卡片标题">
  <p>卡片内容</p>
</Card>

// 带额外操作
<Card
  title="用户信息"
  extra={<Button>编辑</Button>}
>
  <div>姓名: 张三</div>
  <div>邮箱: zhangsan@example.com</div>
</Card>

// 可悬停卡片
<Card hoverable={true}>
  <img src="image.jpg" alt="图片" />
  <h3>标题</h3>
  <p>描述信息</p>
</Card>
```

---

## 表单组件

### Form 表单

表单容器组件，提供表单验证和提交功能。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| initialValues | Object | {} | 否 | 初始值 |
| onSubmit | Function | - | 是 | 提交处理函数 |
| onValuesChange | Function | - | 否 | 值变化回调 |
| layout | String | 'vertical' | 否 | 布局方式：'vertical', 'horizontal', 'inline' |
| children | ReactNode | - | 是 | 表单项 |

#### 示例

```jsx
import { Form, FormItem, Input, Button } from 'kemon-hidy';

function LoginForm() {
  const handleSubmit = (values) => {
    console.log('表单值:', values);
    // 处理登录逻辑
  };

  return (
    <Form
      initialValues={{ username: '', password: '' }}
      onSubmit={handleSubmit}
    >
      <FormItem
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" />
      </FormItem>

      <FormItem
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' }
        ]}
      >
        <Input type="password" placeholder="密码" />
      </FormItem>

      <FormItem>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </FormItem>
    </Form>
  );
}
```

---

### Select 选择器

下拉选择组件。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| value | Any | - | 否 | 当前选中值 |
| options | Array | [] | 是 | 选项列表 |
| placeholder | String | '请选择' | 否 | 占位符 |
| disabled | Boolean | false | 否 | 是否禁用 |
| multiple | Boolean | false | 否 | 是否多选 |
| searchable | Boolean | false | 否 | 是否可搜索 |
| onChange | Function | - | 否 | 选择变化回调 |

#### 示例

```jsx
import { Select } from 'kemon-hidy';

const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' }
];

// 单选
<Select
  options={options}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  placeholder="请选择"
/>

// 多选
<Select
  multiple={true}
  options={options}
  value={selectedValues}
  onChange={(values) => setSelectedValues(values)}
/>

// 可搜索
<Select
  searchable={true}
  options={largeOptions}
  placeholder="搜索并选择"
/>
```

---

### Checkbox 复选框

复选框组件。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| checked | Boolean | false | 否 | 是否选中 |
| disabled | Boolean | false | 否 | 是否禁用 |
| onChange | Function | - | 否 | 状态变化回调 |
| children | ReactNode | - | 否 | 标签内容 |

#### 示例

```jsx
import { Checkbox, CheckboxGroup } from 'kemon-hidy';

// 单个复选框
<Checkbox
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
>
  我同意服务条款
</Checkbox>

// 复选框组
<CheckboxGroup
  options={[
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' }
  ]}
  value={selectedFruits}
  onChange={(values) => setSelectedFruits(values)}
/>
```

---

## 数据展示组件

### Table 表格

数据表格组件，支持排序、筛选、分页等功能。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| columns | Array | [] | 是 | 列配置 |
| dataSource | Array | [] | 是 | 数据源 |
| loading | Boolean | false | 否 | 加载状态 |
| pagination | Object/Boolean | true | 否 | 分页配置 |
| onRow | Function | - | 否 | 行事件处理 |
| rowKey | String/Function | 'id' | 否 | 行key |

#### Column 配置

| 属性 | 类型 | 描述 |
|------|------|------|
| title | String | 列标题 |
| dataIndex | String | 数据字段名 |
| key | String | 唯一标识 |
| width | Number | 列宽度 |
| sortable | Boolean | 是否可排序 |
| filterable | Boolean | 是否可筛选 |
| render | Function | 自定义渲染函数 |

#### 示例

```jsx
import { Table } from 'kemon-hidy';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    sortable: true
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Badge status={status}>
        {status === 'active' ? '活跃' : '未激活'}
      </Badge>
    )
  },
  {
    title: '操作',
    key: 'actions',
    render: (_, record) => (
      <>
        <Button onClick={() => handleEdit(record)}>编辑</Button>
        <Button onClick={() => handleDelete(record)}>删除</Button>
      </>
    )
  }
];

const dataSource = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: 'inactive' }
];

<Table
  columns={columns}
  dataSource={dataSource}
  loading={loading}
  pagination={{
    pageSize: 10,
    total: 100,
    current: currentPage,
    onChange: (page) => setCurrentPage(page)
  }}
/>
```

---

### List 列表

通用列表组件。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| dataSource | Array | [] | 是 | 数据源 |
| renderItem | Function | - | 是 | 渲染函数 |
| loading | Boolean | false | 否 | 加载状态 |
| emptyText | String | '暂无数据' | 否 | 空状态文本 |

#### 示例

```jsx
import { List } from 'kemon-hidy';

const data = [
  { id: 1, title: '标题1', description: '描述1' },
  { id: 2, title: '标题2', description: '描述2' },
  { id: 3, title: '标题3', description: '描述3' }
];

<List
  dataSource={data}
  renderItem={(item) => (
    <List.Item key={item.id}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </List.Item>
  )}
  loading={loading}
/>
```

---

### Chart 图表

数据可视化图表组件。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| type | String | 'line' | 是 | 图表类型：'line', 'bar', 'pie', 'area' |
| data | Array | [] | 是 | 图表数据 |
| options | Object | {} | 否 | 图表配置 |
| width | Number/String | '100%' | 否 | 宽度 |
| height | Number/String | 400 | 否 | 高度 |

#### 示例

```jsx
import { Chart } from 'kemon-hidy';

// 折线图
<Chart
  type="line"
  data={[
    { x: '1月', y: 100 },
    { x: '2月', y: 150 },
    { x: '3月', y: 120 }
  ]}
  options={{
    title: '月度销售额',
    xAxis: { label: '月份' },
    yAxis: { label: '销售额' }
  }}
/>

// 饼图
<Chart
  type="pie"
  data={[
    { name: '产品A', value: 40 },
    { name: '产品B', value: 30 },
    { name: '产品C', value: 30 }
  ]}
  options={{
    title: '产品占比'
  }}
/>
```

---

## 布局组件

### Layout 布局

页面布局组件。

#### 子组件

- `Layout.Header`: 头部
- `Layout.Sider`: 侧边栏
- `Layout.Content`: 内容区
- `Layout.Footer`: 底部

#### 示例

```jsx
import { Layout } from 'kemon-hidy';

const { Header, Sider, Content, Footer } = Layout;

<Layout>
  <Header>
    <Logo />
    <Navigation />
  </Header>
  
  <Layout>
    <Sider width={200}>
      <Menu />
    </Sider>
    
    <Content>
      <main>主要内容</main>
    </Content>
  </Layout>
  
  <Footer>
    © 2025 Kemon_hidy
  </Footer>
</Layout>
```

---

### Grid 网格

响应式网格布局。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| columns | Number | 12 | 否 | 列数 |
| gutter | Number | 0 | 否 | 间距 |
| children | ReactNode | - | 是 | 子元素 |

#### 示例

```jsx
import { Grid, Row, Col } from 'kemon-hidy';

<Row gutter={16}>
  <Col span={8}>
    <Card>列1</Card>
  </Col>
  <Col span={8}>
    <Card>列2</Card>
  </Col>
  <Col span={8}>
    <Card>列3</Card>
  </Col>
</Row>

// 响应式布局
<Row>
  <Col xs={24} sm={12} md={8} lg={6}>
    响应式列
  </Col>
</Row>
```

---

## 反馈组件

### Modal 模态框

对话框组件。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| visible | Boolean | false | 是 | 是否显示 |
| title | String/ReactNode | - | 否 | 标题 |
| onOk | Function | - | 否 | 确定回调 |
| onCancel | Function | - | 否 | 取消回调 |
| children | ReactNode | - | 是 | 内容 |

#### 示例

```jsx
import { Modal, Button } from 'kemon-hidy';

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>
        打开模态框
      </Button>

      <Modal
        visible={visible}
        title="确认操作"
        onOk={() => {
          // 执行操作
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      >
        <p>你确定要执行此操作吗？</p>
      </Modal>
    </>
  );
}
```

---

### Toast 提示

轻量级消息提示。

#### API

```javascript
Toast.success(message, duration)
Toast.error(message, duration)
Toast.warning(message, duration)
Toast.info(message, duration)
```

#### 示例

```jsx
import { Toast, Button } from 'kemon-hidy';

<Button onClick={() => Toast.success('操作成功！')}>
  成功提示
</Button>

<Button onClick={() => Toast.error('操作失败！', 5000)}>
  错误提示（5秒）
</Button>

<Button onClick={() => Toast.warning('警告信息')}>
  警告提示
</Button>
```

---

### Loading 加载

加载状态指示器。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| loading | Boolean | false | 是 | 是否加载中 |
| tip | String | '加载中...' | 否 | 加载文本 |
| size | String | 'medium' | 否 | 尺寸：'small', 'medium', 'large' |
| children | ReactNode | - | 否 | 被包裹的内容 |

#### 示例

```jsx
import { Loading } from 'kemon-hidy';

// 包裹内容
<Loading loading={isLoading} tip="数据加载中...">
  <Content />
</Loading>

// 全局加载
{isLoading && <Loading loading={true} />}
```

---

## 导航组件

### Menu 菜单

导航菜单组件。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| items | Array | [] | 是 | 菜单项 |
| mode | String | 'vertical' | 否 | 模式：'vertical', 'horizontal' |
| selectedKeys | Array | [] | 否 | 选中项 |
| onSelect | Function | - | 否 | 选择回调 |

#### 示例

```jsx
import { Menu } from 'kemon-hidy';

const menuItems = [
  {
    key: 'home',
    label: '首页',
    icon: <HomeIcon />
  },
  {
    key: 'products',
    label: '产品',
    icon: <ProductIcon />,
    children: [
      { key: 'product-1', label: '产品1' },
      { key: 'product-2', label: '产品2' }
    ]
  },
  {
    key: 'about',
    label: '关于',
    icon: <AboutIcon />
  }
];

<Menu
  items={menuItems}
  mode="vertical"
  selectedKeys={[selectedKey]}
  onSelect={(key) => handleMenuSelect(key)}
/>
```

---

### Tabs 标签页

标签页组件。

#### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| items | Array | [] | 是 | 标签项 |
| activeKey | String | - | 否 | 当前激活标签 |
| onChange | Function | - | 否 | 切换回调 |

#### 示例

```jsx
import { Tabs } from 'kemon-hidy';

const tabItems = [
  {
    key: 'tab1',
    label: '标签1',
    children: <div>内容1</div>
  },
  {
    key: 'tab2',
    label: '标签2',
    children: <div>内容2</div>
  },
  {
    key: 'tab3',
    label: '标签3',
    children: <div>内容3</div>
  }
];

<Tabs
  items={tabItems}
  activeKey={activeTab}
  onChange={(key) => setActiveTab(key)}
/>
```

---

## 高级用法

### 组件组合

```jsx
import { Form, FormItem, Input, Select, Button, Card } from 'kemon-hidy';

function UserForm() {
  return (
    <Card title="用户信息">
      <Form onSubmit={handleSubmit}>
        <FormItem name="name" label="姓名" rules={[{ required: true }]}>
          <Input placeholder="请输入姓名" />
        </FormItem>

        <FormItem name="role" label="角色">
          <Select
            options={[
              { value: 'admin', label: '管理员' },
              { value: 'user', label: '普通用户' }
            ]}
          />
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
}
```

### 主题定制

```javascript
import { ThemeProvider } from 'kemon-hidy';

const customTheme = {
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  }
};

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

---

## 相关资源

- [API 文档](./API.md)
- [函数文档](./FUNCTIONS.md)
- [示例代码](../examples/)
- [样式指南](./STYLING.md)
