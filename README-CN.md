# App Data Manager (应用数据管理器)

[![npm version](https://badge.fury.io/js/@ticatec%2Fapp-data-manager.svg)](https://badge.fury.io/js/@ticatec%2Fapp-data-manager)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English Documentation](./README.md)

一个全面的 TypeScript 类库，提供分层的数据管理器类集合，用于处理 CRUD 操作和通过 HTTP 请求进行分页数据检索。该库通过抽象数据操作的复杂性并为管理不同类型的数据集提供结构化方法，简化了前端应用程序中的数据管理。

## 特性

- **类型安全**: 完整的 TypeScript 支持，具有全面的类型定义
- **分层架构**: 针对不同数据管理需求的良好结构化继承层次
- **分页支持**: 内置分页处理，支持标准分页和堆叠分页
- **CRUD 操作**: 完整的创建、读取、更新、删除功能
- **数据转换**: 内置数据转换和验证支持
- **可扩展**: 易于扩展和自定义特定用例
- **依赖注入**: 基于服务的架构，提供更好的可测试性

## 安装

```bash
npm install @ticatec/app-data-manager
```

## 架构概览

该库基于以下核心类的分层结构构建：

```
BaseDataManager (抽象类)
├── FullListDataManager
└── CommonPagedDataManager (抽象类)
    ├── PagedDataManager
    └── StackDataManager
```

## 核心类

### 1. BaseDataManager (基础数据管理器)

用于管理数据集合和通用 CRUD 操作的**抽象基类**。

**主要特性:**
- 带本地缓存的数据集合管理
- 自动本地同步的 CRUD 操作
- 通过 `convert` 函数支持数据转换
- 通过 `checkEqual` 函数进行相等性检查
- 基于服务的数据操作架构

**属性:**
- `service: CommonDataService` - 数据服务实例
- `checkEqual: CheckEqual` - 比较数据项的函数
- `convert?: DataConvert` - 可选的数据转换函数
- `list: Array<any>` - 当前数据集（只读副本）

**方法:**
- `save(data: any, isNew: boolean): Promise<void>` - 保存/更新数据
- `remove(item: any): Promise<void>` - 删除数据
- `append(item: any): void` - 将项目添加到列表开头
- `replace(item: any): void` - 替换具有匹配键的现有项目
- `removeItem(item: any): void` - 仅从本地集合中删除项目

### 2. FullListDataManager (完整列表数据管理器)

继承自 `BaseDataManager` 的**具体类**，用于管理完整数据集。

**使用场景:**
- 下拉列表
- 静态参考数据
- 中小型完整数据集
- 配置列表

**构造函数:**
```typescript
protected constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: ManagerOptions = null
)
```

**附加方法:**
- `loadData(): Promise<void>` - 使用 tagData 作为过滤条件从服务加载完整数据集

**示例:**
```typescript
import { FullListDataManager } from '@ticatec/app-data-manager';
import { MyFullListDataService } from './services';

class CategoryManager extends FullListDataManager<MyFullListDataService> {
  constructor() {
    super(
      new MyFullListDataService(), 
      'id', 
      {
        tagData: { status: 'active', type: 'public' } // getList 的过滤条件
      }
    );
  }
}

const manager = new CategoryManager();
await manager.loadData(); // 使用 tagData 作为过滤条件
console.log(manager.list); // 已过滤的分类列表
```

### 3. CommonPagedDataManager (通用分页数据管理器)

具有全面分页支持的分页数据管理**抽象基类**。

**构造函数:**
```typescript
protected constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: any = null
)
```

**主要特性:**
- 分页状态管理（pageNo、pageCount、totalCount）
- 基于 tagData 初始化的查询条件处理
- 可配置的分页参数
- 用于自定义数据处理的抽象 `processDataResult` 方法

**静态配置:**
- `CommonPagedDataManager.setRowsPerPage(25)` - 设置默认每页行数
- `CommonPagedDataManager.setRowsKey('rows')` - 设置行数参数名称
- `CommonPagedDataManager.setPageNoKey('page')` - 设置页码参数名称

**属性:**
- `criteria: any` - 当前查询条件（从 options.tagData 初始化，或空对象）
- `count: number` - 记录总数

**方法:**
- `search(criteria: any): Promise<void>` - 根据条件搜索
- `setPageNo(pageNo: number): Promise<void>` - 导航到特定页面
- `setRowsPage(rows: number): Promise<void>` - 更改页面大小
- `refresh(): Promise<void>` - 刷新当前数据
- `resetSearch(): Promise<void>` - 重置为默认条件

### 4. PagedDataManager (分页数据管理器)

用于标准分页的 `CommonPagedDataManager` 的**具体实现**。

**使用场景:**
- 带分页的数据表格
- 带页面导航的搜索结果
- 标准分页列表

**附加属性:**
- `pageCount: number` - 总页数
- `pageNo: number` - 当前页码

**数据处理:**
- 用新页面数据替换整个数据集
- 简单直接的分页

**构造函数:**
```typescript
constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: any = null
)
```

**示例:**
```typescript
import { PagedDataManager } from '@ticatec/app-data-manager';
import { MyPagingDataService } from './services';

class UserManager extends PagedDataManager<MyPagingDataService> {
  constructor() {
    super(
      new MyPagingDataService(), 
      'userId',
      {
        tagData: { status: 'active' } // 通过 tagData 设置默认查询条件
      }
    );
  }
}

const manager = new UserManager();
// 将使用 tagData 中的默认条件 { status: 'active' } 进行搜索
await manager.resetSearch(); 
console.log(`第 ${manager.pageNo} 页，共 ${manager.pageCount} 页`);
console.log(`用户总数: ${manager.count}`);
console.log(manager.list); // 当前页用户

// 导航到下一页
await manager.setPageNo(2);

// 使用其他条件搜索
await manager.search({ status: 'active', role: 'admin' });
```

### 5. StackDataManager (堆叠数据管理器)

用于可堆叠分页（"无限滚动"）的 `CommonPagedDataManager` 的**具体实现**。

**使用场景:**
- 社交媒体源
- 无限滚动实现
- "加载更多"功能
- 渐进式数据加载

**主要特性:**
- 跨页面累积数据
- 使用 `union` 方法自动防止重复
- `loadMore()` 和 `hasMore()` 方法用于渐进式加载

**附加方法:**
- `loadMore(): Promise<void>` - 加载下一页并追加到现有数据
- `hasMore(): boolean` - 检查是否有更多页面可用

**数据处理:**
- 将新数据与现有数据集合并
- 使用 `checkEqual` 函数防止重复

**构造函数:**
```typescript
constructor(
  service: T, 
  keyField: string | CheckEqual, 
  options: any = null
)
```

**示例:**
```typescript
import { StackDataManager } from '@ticatec/app-data-manager';
import { MyPagingDataService } from './services';

class FeedManager extends StackDataManager<MyPagingDataService> {
  constructor() {
    super(
      new MyPagingDataService(), 
      'postId',
      {
        tagData: { category: 'technology' } // 通过 tagData 设置默认查询条件
      }
    );
  }
}

const manager = new FeedManager();
// 将使用 tagData 中的默认条件 { category: 'technology' } 进行搜索
await manager.resetSearch();

// 加载更多内容
while (manager.hasMore()) {
  await manager.loadMore();
  console.log(`已加载 ${manager.list.length} 篇文章`);
}

// 使用不同条件搜索
await manager.search({ category: 'science', featured: true });
```

## 类型定义

### CheckEqual
```typescript
type CheckEqual = (e1: any, e2: any) => boolean;
```
用于确定两个数据项是否相等的函数（通常通过比较主键）。

### DataConvert
```typescript
type DataConvert = (item: any, isNew: boolean) => any;
```
在保存/加载操作期间转换数据项的可选函数。

### ManagerOptions
```typescript
interface ManagerOptions {
  convert?: DataConvert;    // 数据转换函数
  fromTop?: boolean;        // 将新项目添加到列表顶部（默认: true）
  tagData?: any;           // 默认查询条件/过滤条件
}
```

**tagData 用法:**
- **对于分页管理器**: 作为搜索的默认查询条件
- **对于 FullListDataManager**: 作为 getList 方法的过滤条件

## 高级用法

### 自定义数据管理器

```typescript
import { BaseDataManager } from '@ticatec/app-data-manager';

class CustomDataManager extends BaseDataManager<MyDataService> {
  constructor(service: MyDataService) {
    super(service, 'id', {
      convert: (item, isNew) => ({
        ...item,
        timestamp: isNew ? Date.now() : item.timestamp
      }),
      fromTop: true
    });
  }
  
  // 自定义业务逻辑
  async archiveItem(item: any): Promise<void> {
    const archived = { ...item, archived: true };
    await this.save(archived, false);
  }
}
```

### 服务实现示例

```typescript
import {PagingDataService} from '@ticatec/app-data-service';

class MyPagingService extends PagingDataService {
    constructor() {
        super('/api/users');
    }
}
```

## 最佳实践

1. **选择正确的管理器:**
   - 对于小型静态数据集使用 `FullListDataManager`
   - 对于传统分页表格使用 `PagedDataManager`
   - 对于无限滚动或类似动态源的界面使用 `StackDataManager`

2. **实现适当的相等性检查:**
   ```typescript
   // 好: 使用唯一标识符
   const manager = new PagedDataManager(service, 'id');
   
   // 更好: 复合键的自定义比较
   const manager = new PagedDataManager(service, (a, b) => 
     a.companyId === b.companyId && a.userId === b.userId
   );
   ```

3. **优雅地处理错误:**
   ```typescript
   try {
     await manager.search({ username: '王*' });
   } catch (error) {
     console.error('搜索失败:', error);
     // 适当处理错误
   }
   ```

4. **使用数据转换保持一致性:**
   ```typescript
   const options = {
     convert: (item, isNew) => ({
       ...item,
       createdAt: isNew ? new Date().toISOString() : item.createdAt,
       updatedAt: new Date().toISOString()
     })
   };
   ```

## 依赖项

- **[@ticatec/app-data-service](https://www.npmjs.com/package/@ticatec/app-data-service)** - 数据服务接口和基础实现
- **[@ticatec/enhanced-utils](https://www.npmjs.com/package/@ticatec/enhanced-utils)** - 实用函数，包括数组扩展

## 浏览器支持

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Node.js 14+

## 贡献

欢迎提交问题和拉取请求。请确保：

1. 所有测试通过
2. 代码遵循 TypeScript 最佳实践
3. 新功能更新了文档
4. 为新功能提供了示例

## 许可证

版权所有 © 2023 Ticatec。保留所有权利。

本库在 MIT 许可证下发布。详细信息请参阅 [LICENSE](LICENSE) 文件。

## 联系方式

- **邮箱:** huili.f@gmail.com
- **GitHub:** https://github.com/ticatec/app-data-manager
- **问题反馈:** https://github.com/ticatec/app-data-manager/issues