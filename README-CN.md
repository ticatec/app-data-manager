# Data Manager

## BaseDataManager
BaseDataManager是一个通用类，提供了用于管理数据列表的基本CRUD操作。它定义了在本地列表和数据库中保存、删除和修改数据的方法，并通过指定的CommonDataService。BaseDataManager被设计为针对特定用例进行扩展和实现。


### 用法
BaseDataManager类可以被扩展和实现来管理任何类型的数据。

```typescript
import BaseDataManager from "./BaseDataManager";
import MyDataService from "./MyDataService";

export default class MyDataManager extends BaseDataManager<MyDataService> {

    constructor(service: MyDataService) {
        super(service, (e1, e2) => e1.id === e2.id);
    }
}

```

### 构造函数
BaseDataManager构造函数需要以下参数：

**service** - 用于处理实际CRUD操作的CommonDataService子类的实例
**checkEqual** - 一个函数，它接受两个项并返回一个布尔值，指示它们是否相等。该函数用于识别需要更新或删除的本地列表中的项。
此外，还可以提供可选的**convert**参数以将返回的数据转换为添加到本地列表中。

### 方法

| 名称 | 修饰符       | 参数                         | 返回值 | 说明         | 备注 |
|---|-----------|----------------------------|---|------------|----|
| save   | public    | data:any<br/>isNew:boolean | 无   |            | 异步 |
| remove | public    | data:any                   | 无   |            | 异步 |
| removeItem   | protected | item:any                   | 无   | 从列表中删除一条记录 |  |
| append | protected    | item:any                  | 无   | 新增一条记录到列表头 |  |
| save   | public    | data:any<br/>isNew:boolean | 无   |            | 异步 |
| remove | public    | data:any                   | 无   |            | 异步 |


### 属性
| 名称 | 修饰符                            | 类型               | 说明         | 备注 |
|---|--------------------------------|------------------|------------|----|
| list | public(get)<br/>protected(set) | Array&lt;any&gt; | 无  |             |



## Common Pagination Data Manager
这个模块提供了一个CommonPaginationDataManager类，它继承了BaseDataManager类。它用于管理可以在分页表格上显示的数据。

### 用法
要使用这个模块，首先导入CommonPaginationDataManager类和任何必需的依赖项：

```typescript
import {BaseDataManager, DataConvert} from "@ticatec/app-data-manager";
import type {CheckEqual} from "@ticatec/data-manager";
import type {CommonPaginationDataService} from "@ticatec/app-data-manager";
import {utils} from "@ticatec/enhanced-utils";
```
然后，扩展CommonPaginationDataManager类并实现processDataResult方法：

```typescript
export default abstract class CommonPaginationDataManager<T extends CommonPaginationDataService> extends BaseDataManager<T> {

    constructor(service:T, checkEqual: CheckEqual, convert?: DataConvert) {
        super(service, checkEqual, convert);
    }
}

```

### 方法

| 名称 | 修饰符       | 参数                       | 返回值 | 说明                          | 备注  |
|---|-----------|--------------------------|---|-----------------------------|-----|
| setRowsPerPage   | public    | value:number             | 无   | 设置分页的最多行数                   |     |
| searchData | public    | criteria: any, pageNo: number = 1 | 无   | 基于指定的搜索条件和页码搜索数据            | 异步  |
| setPageNo   | public    | value: number            | 无   | 设置新的页吗                      |     |
| initialize | public    | options:any              | 无   | 初始化分页数据管理器，options是初始化的条件   | 异步  |
| resetSearch   | public    | 无                        | 无   | 重置查询条件                      | 异步  |
| search | public    | criteria:any             | 无   | 根据条件查询(废弃，新版更改为setCriteria) | 异步  |
| setCriteria | public    | criteria:any             | 无   | 设置查询条件                      | 异步  |
| refresh | public    |                          | 无   | 更加当前条件重新读取                  | 异步  |
| getPageNo | protected |                          | 无   | 获取当前页吗          |   |
| getPageCount | protected |                          | 无   | 获取当前总页数  |   |


### 属性
| 名称 | 修饰符                       | 类型  | 说明         | 备注 |
|---|---------------------------|-----|------------|----|
| criteria | public | 对象  | 查询条件  |      只读       |


## PaginationDataManager
PaginationDataManager 是一个实例类，它扩展了 CommonPaginationDataManager 实现从服务器分页读取数据。

### 属性
| 名称 | 修饰符                       | 类型  | 说明         | 备注 |
|---|---------------------------|-----|------------|----|
| pageNo | public | 数字  | 当前页数  |      只读       |
| pageCount | public | 数字  | 总页数  |      只读       |


## StackDataManager

StackDataManager 是一个实例类，它扩展了 CommonPaginationDataManager 并添加了从服务器加载更多数据的功能。

### 使用方法

```typescript
import {StackDataManager} from "@ticatec/app-data-manager";
import type {CheckEqual} from "@ticatec/app-data-manager";
import type {CommonPaginationDataService} from "@ticatec/app-data-manager";

class ExampleDataManager extends StackDataManager<CommonPaginationDataService> {
    constructor(service: CommonPaginationDataService, checkEqual: CheckEqual) {
        super(service, checkEqual);
    }
}
```

### API

### constructor
**StackDataManager(service: T, checkEqual: CheckEqual, convert?: DataConvert)**
构造一个新的 StackDataManager 实例。  
**service** - 用于查询数据的服务。  
**checkEqual** - 用于比较两个对象的函数。  
**convert** - 用于将服务器上的数据转换的函数。  

### 方法

| 名称 | 修饰符    | 参数  | 返回值 | 说明        | 备注  |
|---|--------|-----|---|-----------|-----|
| loadMore   | public | -   | 无   | 抓取更多的行    |  异步   |
| hasMore | public | -   | 无   | 是否还有更多的记录 |   |

