# 数据管理器

[English](./README.md)

这个类库提供了一系列数据管理器，用于简化前端应用中数据的管理和操作。它主要包含以下几个核心类：

### 分项介绍

1. `BaseDataManager` **(基础数据管理器)**：

* 这是一个抽象基类，用于管理数据集合。
* 它提供了一系列通用的数据操作方法，如保存、删除、替换和追加数据。
* 它依赖于 `CommonDataService`，用于与后端数据服务进行交互。
* 它通过 `checkEqual` 函数来比较数据项的相等性，并允许通过 `convert` 函数进行数据转换。
* 它适用于管理任何类型的数据集合，但需要子类继承并实现特定的数据服务交互逻辑。

2. `FullListDataManager` **(完整列表数据管理器)**：

* 它继承自 `BaseDataManager`，专门用于管理完整的数据列表。
* 它提供了一个 `loadData` 方法，用于从后端数据服务一次性加载所有数据。
* 它适用于需要一次性加载完整数据集的场景，例如下拉列表或静态数据展示。

3. `CommonPagedDataManager` **(通用分页数据管理器)**：

* 它继承自 `BaseDataManager`，用于管理分页数据。
* 它提供了一系列方法，用于分页查询数据、设置分页参数和刷新数据。
* 它依赖于 `PagingDataService`，用于与支持分页的后端数据服务交互。
* 它通过 `processDataResult` 抽象方法，要求子类实现特定的数据处理逻辑。
* 它适用于需要分页加载数据的场景，例如表格或列表展示。

4. `PagedDataManager` **(分页数据管理器)**：

* 它继承自 CommonPagedDataManager，是一个具体的分页数据管理器。
* 它简化了 CommonPagedDataManager 的使用，并提供了更直接的属性访问方式，使得开发者能够更方便地获取分页信息。
* 它重写了 processDataResult 方法，直接将后端返回的数据列表设置为本地数据集合。
* 它通过 pageCount 和 pageNo 属性，提供了更方便的分页信息访问方式。
* 它适用于大多数分页数据管理的场景，提供了简洁易用的API。

5. `StackDataManager` **(堆叠式分页数据管理器)**：

* 它继承自 CommonPagedDataManager，用于管理堆叠式分页数据。
* 它提供了 loadMore 和 hasMore 方法，用于实现堆叠式加载更多数据的逻辑。
* 它在 processDataResult 方法中使用 union 方法，将新加载的数据合并到现有数据集合中，避免重复数据。
* 它适用于需要实现“加载更多”或“无限滚动”等堆叠式分页加载的场景。

### 用途：
这些数据管理器类提供了一种结构化的方式来管理前端应用中的数据，简化了数据加载、存储、更新和删除等操作。它们抽象了与后端数据服务的交互细节，使得前端开发者可以更专注于业务逻辑的实现。
### 用法：
* 首先，需要根据具体的数据服务类型，创建相应的数据服务类（例如 `MyDataService`、`MyFullListDataService`、`MyPagingDataService`）。
* 然后，继承相应的数据管理器类（例如 `BaseDataManager`、`FullListDataManager`、`PagedDataManager`、`StackDataManager`），并实现必要的方法（例如 processDataResult）。
* 在创建数据管理器实例时，需要传入数据服务实例和 `checkEqual` 函数。
* 通过调用数据管理器提供的方法，可以加载、保存、删除和更新数据。
* 对于分页数据管理器，可以通过设置查询条件、页码和每页行数，来实现分页查询。
* 对于堆叠数据管理器，可以使用`loadMore`方法和`hasMore`方法实现懒加载。

### 总体而言
这个类库提供了一套灵活且可扩展的数据管理解决方案，可以根据不同的数据管理需求选择合适的管理器类。它简化了前端数据管理的复杂性，提高了开发效率和代码质量。

### 关联文档

* [基础数据管理器](./README-BASE-CN.md)
* [全数据集管理器](./README-FULL-CN.md)
* [分页数据集合管理器](./README-PAGED-CN.md)

## 依赖

* [app-data-service](https://www.npmjs.com/package/@ticatec/app-data-service)

## 贡献

欢迎提交 issue 和 pull request。

## 版权信息

Copyright © 2023 Ticatec。保留所有权利。

本类库遵循 MIT 许可证发布。有关许可证的详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 联系方式

huili.f@gmail.com

https://github.com/henryfeng/app-data-manager
