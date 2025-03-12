# 分批数据管理

通常用于大数据的管理，可以根据要求根据检索条件分批返回。根据需求可以使用`PagedDataManager`（分页展示数据）或者`StackDataManager`（可堆叠增加数据集）。如果有特殊的需求，可以直接继承`CommonPagedDataManager`

# CommonPagedDataManager 

## 简介

`CommonPagedDataManager` 继承自 `BaseDataManager`，专门用于管理分页数据。它扩展了 `BaseDataManager`，提供了一系列方法，用于分页查询数据、设置分页参数、刷新数据等。

## 类型定义

* `T extends PagingDataService`: 泛型类型，表示继承自 `PagingDataService` 的数据服务类型。

## 属性

`CommonPagedDataManager` 继承了 `BaseDataManager` 的所有属性，并新增了以下属性：

* `#criteria`: 当前的查询条件。
* `#pageCount`: 总页数。
* `#pageNo`: 当前页码。
* `#count`: 总记录数。
* `#rows`: 每页行数。

## 静态属性

* `rowsCount`: 默认每页行数，默认为 `25`。
* `rowsKey`: 每页行数对应的查询参数名称，默认为 `'rows'`。
* `pageNoKey`: 页码对应的查询参数名称，默认为 `'page'`。

## 构造函数

```typescript
constructor(service: T, keyField: string | CheckEqual, options: any = null)
```
* 参数同`BaseDataManager`

## 静态方法

* `setRowsPerPage(value: number)`: 设置默认的每页行数。
  * value: 每页行数。

```ts
static setRowsPerPage(value: number): void
```

* `setRowsKey(value: string)`: 设置每页行数对应的查询参数名称。
  * value: 查询参数中每页行数的字段名称。
```ts
static setRowsKey(value: string): void
```

* `setPageNoKey(value: string)`: 设置页码对应的查询参数名称。
  * value: 查询参数中页码对应的字段名称

```ts
static setPageNoKey(value: string): void
```

### 方法
* `remove(item: any)`: 删除一条记录，并从本地集合中删除。
  * item: 要删除的数据项。
```ts
async remove(item: any): Promise<void>
```

* `searchViaProxy(criteria: any)`: 通过接口代理查询数据。
  * criteria: 查询条件。

```ts
protected async searchViaProxy(criteria: any)
```

* `searchData(criteria: any, pageNo: number = 1)`: 根据条件查询数据。
  * criteria: 查询条件。
  * pageNo: 页码，默认为 1。

```ts
protected async searchData(criteria: any, pageNo: number = 1): Promise<void>
```

* `processDataResult(result: any)`: 处理查询返回的结果，需要子类实现。
  * result: 查询结果。
```ts
protected abstract processDataResult(result: any): void
```

* `setPageNo(value: number)`: 设置当前页码。
  * value: 页码。
```ts
async setPageNo(value: number): Promise<void>
```

* `setRowsPage(value: number)`: 设置每页行数，并从首页查询。
  * value: 每页行数。
```ts
async setRowsPage(value: number): Promise<void>
```

* `resetCriteria()`: 重置查询条件。

```ts
resetCriteria(): any
```
* `resetSearch()`: 重置查询条件并查询数据。

```ts
async resetSearch(): Promise<void>
```

* `search(criteria: any)`: 按照条件重新查询数据。
  * criteria: 查询条件。
```ts
async search(criteria: any): Promise<void>
```

* `setCriteria(criteria: any)`: 设置查询条件并查询数据。
  * criteria: 查询条件。
```ts
async setCriteria(criteria: any): Promise<void>
```

* `refresh()`: 刷新查询数据。

```ts
async refresh(): Promise<void>
```

* `get criteria(): any`: 获取当前的查询条件。

```ts
get criteria(): any
```

* `getPageNo(): number`: 获取当前页码。

```ts
protected getPageNo(): number
```

* `getPageCount(): number`: 获取总页数。

```ts
protected getPageCount(): number
```

* `get count(): number`: 获取总记录数。

```ts
get count(): number
```

## 使用示例：

```ts
import CommonPagedDataManager from './common-paged-data-manager';
import { MyPagingDataService } from './my-paging-data-service';

class MyPagedDataManager extends CommonPagedDataManager<MyPagingDataService> {
    constructor(service: MyPagingDataService, checkEqual: (e1: any, e2: any) => boolean, options: any = null) {
        super(service, checkEqual, options);
    }

    protected processDataResult(result: any): void {
        this.list = result.data;
    }
}

const service = new MyPagingDataService();
const checkEqual = (e1: any, e2: any) => e1.id === e2.id;
const manager = new MyPagedDataManager(service, checkEqual);

// 设置查询条件并查询
manager.setCriteria({ name: 'test' }).then(() => {
    const list = manager.list;
    console.log(list);
});

// 设置页码
manager.setPageNo(2).then(() => {
    const list = manager.list;
    console.log(list);
});

// 设置每页行数
manager.setRowsPage(10).then(() => {
    const list = manager.list;
    console.log(list);
});

// 刷新数据
manager.refresh().then(() => {
    const list = manager.list;
    console.log(list);
});
```

## 注意事项
* `CommonPagedDataManager` 是一个抽象类，需要继承后才能使用。
* `PagingDataService` 需要根据实际情况进行实现，并提供 `search` 方法用于分页查询数据。
* `processDataResult` 方法需要子类实现，用于处理查询返回的结果，并将数据设置到 `list` 属性。

# PagedDataManager 类说明文档

## 简介

`PagedDataManager` 继承自 `CommonPagedDataManager`，是一个具体的分页数据管理器，用于管理分页数据。它简化了 `CommonPagedDataManager` 的使用，并提供了更直接的属性访问方式，使得开发者能够更方便地获取分页信息。


## 类型定义

* `T extends PagingDataService`: 泛型类型，表示继承自 `PagingDataService` 的数据服务类型。

## 属性

`PagedDataManager` 继承了 `CommonPagedDataManager` 的所有属性，包括：

* `service`: `PagingDataService` 实例，用于与底层数据服务交互。
* `checkEqual`: `CheckEqual` 函数，用于比较数据项。
* `convert`: `DataConvert` 函数，用于转换数据项。
* `fromTop`: 布尔值，指示新添加的条目是否添加到列表的顶部，默认为 `true`。
* `tagData`: 附加到数据服务的数据。
* `list`: 当前的数据集。
* `#criteria`: 当前的查询条件。
* `#pageCount`: 总页数。
* `#pageNo`: 当前页码。
* `#count`: 总记录数。
* `#rows`: 每页行数。

此外，`PagedDataManager` 还提供了以下属性的 getter 方法：

* `pageCount`: 总页数。
* `pageNo`: 当前页码。

## 构造函数

```typescript
constructor(service: T, checkEqual: CheckEqual, options: any = null)
```
* service: PagingDataService 实例。
* checkEqual: CheckEqual 函数。
* options: 可选参数，包含以下属性：
  * convert: DataConvert 函数。
  * fromTop: 布尔值，指示新添加的条目是否添加到列表的顶部。
  * tagData: 附加到数据服务的数据。

## 方法

* `processDataResult(result: any)`: 处理查询返回的结果，并将数据设置到 list 属性。
  * result: 查询结果，包含 list 属性，表示数据列表。
```ts
protected processDataResult(result: any): void
```

* **`PagedDataManager` 继承了 `CommonPagedDataManager` 的所有其他方法**，包括：
  * `remove(item: any)`
  * `searchViaProxy(criteria: any)`
  * `searchData(criteria: any, pageNo: number = 1)`
  * `setPageNo(value: number)`
  * `setRowsPage(value: number)`
  * `resetCriteria()`
  * `resetSearch()`
  * `search(criteria: any)`
  * `setCriteria(criteria: any)`
  * `refresh()`
  * `get criteria(): any`
  * `getPageNo(): number`
  * `getPageCount(): number`
  * `get count(): number`

## 属性访问器
* `get pageCount(): number`: 获取总页数。

```ts
get pageCount(): number
```

* `get pageNo(): number`: 获取当前页码。

```ts
get pageNo(): number
```

## 使用示例
```ts
import PagedDataManager from './paged-data-manager';
import { MyPagingDataService } from './my-paging-data-service';

class MyDataManager extends PagedDataManager<MyPagingDataService> {
    constructor(service: MyPagingDataService, checkEqual: (e1: any, e2: any) => boolean, options: any = null) {
        super(service, checkEqual, options);
    }
}

const service = new MyPagingDataService();
const checkEqual = (e1: any, e2: any) => e1.id === e2.id;
const manager = new MyDataManager(service, checkEqual);

// 设置查询条件并查询
manager.setCriteria({ name: 'test' }).then(() => {
    const list = manager.list;
    console.log(list);
    console.log('Page Count:', manager.pageCount);
    console.log('Page No:', manager.pageNo);
});

// 设置页码
manager.setPageNo(2).then(() => {
    const list = manager.list;
    console.log(list);
});

// 设置每页行数
manager.setRowsPage(10).then(() => {
    const list = manager.list;
    console.log(list);
});

// 刷新数据
manager.refresh().then(() => {
    const list = manager.list;
    console.log(list);
});
```

## 注意事项
* `PagedDataManager` 继承自 `CommonPagedDataManager`，因此可以使用 `CommonPagedDataManager` 的所有方法。
* `PagingDataService` 需要根据实际情况进行实现，并提供 `search` 方法用于分页查询数据。
* `processDataResult` 方法简化了数据处理，直接将 result.list 设置为 this.list。
* `pageCount` 和 `pageNo` 属性提供了更方便的访问方式。


# StackDataManager 类说明文档

## 简介

`StackDataManager` 继承自 `CommonPagedDataManager`，专门用于管理堆叠式分页数据。它扩展了 `CommonPagedDataManager`，提供了 `loadMore` 和 `hasMore` 方法，用于实现堆叠式加载更多数据的逻辑。


## 类型定义

* `T extends PagingDataService`: 泛型类型，表示继承自 `PagingDataService` 的数据服务类型。

## 属性

`StackDataManager` 继承了 `CommonPagedDataManager` 的所有属性，包括：

* `service`: `PagingDataService` 实例，用于与底层数据服务交互。
* `checkEqual`: `CheckEqual` 函数，用于比较数据项。
* `convert`: `DataConvert` 函数，用于转换数据项。
* `fromTop`: 布尔值，指示新添加的条目是否添加到列表的顶部，默认为 `true`。
* `tagData`: 附加到数据服务的数据。
* `list`: 当前的数据集。
* `#criteria`: 当前的查询条件。
* `#pageCount`: 总页数。
* `#pageNo`: 当前页码。
* `#count`: 总记录数。
* `#rows`: 每页行数。

## 构造函数

```typescript
constructor(service: T, checkEqual: CheckEqual, options: any = null)
```
* service: PagingDataService 实例。
* checkEqual: CheckEqual 函数。
* options: 可选参数，包含以下属性：
    * convert: DataConvert 函数。
    * fromTop: 布尔值，指示新添加的条目是否添加到列表的顶部。
    * tagData: 附加到数据服务的数据。

## 方法

* `processDataResult(result: any)`: 处理查询返回的结果，并将新加载的数据合并到现有的 list 中，使用 union 方法和 checkEqual 函数来避免重复数据。
  * result: 查询结果，包含 list 属性，表示新加载的数据列表。
```ts
protected processDataResult(result: any): void
```

* `loadMore()`: 加载新的一页数据，如果当前页码小于总页数，则加载下一页。

```ts
async loadMore(): Promise<void>
```

* `hasMore()`: 检查是否还有更多的记录可以加载。
  * 返回值：如果当前页码小于总页数，则返回 true，否则返回 false。
```ts
hasMore(): boolean
```

* **`StackDataManager` 继承了 `CommonPagedDataManager` 的所有其他方法**
## 使用示例

```ts
import StackDataManager from './stack-data-manager';
import { MyPagingDataService } from './my-paging-data-service';

class MyStackDataManager extends StackDataManager<MyPagingDataService> {
    constructor(service: MyPagingDataService, checkEqual: (e1: any, e2: any) => boolean, options: any = null) {
        super(service, checkEqual, options);
    }
}

const service = new MyPagingDataService();
const checkEqual = (e1: any, e2: any) => e1.id === e2.id;
const manager = new MyStackDataManager(service, checkEqual);

// 设置查询条件并查询
manager.setCriteria({ name: 'test' }).then(() => {
    const list = manager.list;
    console.log(list);

    // 加载更多数据
    if (manager.hasMore()) {
        manager.loadMore().then(() => {
            const newList = manager.list;
            console.log(newList);
        });
    }
});

// 刷新数据
manager.refresh().then(() => {
    const list = manager.list;
    console.log(list);
});
```

## 注意事项
* `StackDataManager` 继承自 `CommonPagedDataManager`，因此可以使用 `CommonPagedDataManager` 的所有方法。
* `PagingDataService` 需要根据实际情况进行实现，并提供 search 方法用于分页查询数据。
* `pocessDataResult` 方法使用 `union` 方法合并新加载的数据，避免重复数据。
* `loadMore` 和 `hasMore` 方法提供了堆叠式加载更多数据的逻辑。



