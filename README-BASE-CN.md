# BaseDataManager 

## 简介

`BaseDataManager` 是一个抽象基类，用于管理数据集合。它提供了一系列方法，用于操作数据，包括保存、删除、替换等。该类基于 `CommonDataService`，用于与底层数据服务交互。

## 类型定义

* `CheckEqual`: 用于比较两个数据项是否相等的函数类型。
* `DataConvert`: 用于转换数据项的函数类型。

## 属性

* `service`: `CommonDataService` 实例，用于与底层数据服务交互。
* `checkEqual`: `CheckEqual` 函数，用于比较数据项。
* `convert`: `DataConvert` 函数，用于转换数据项。
* `fromTop`: 布尔值，指示新添加的条目是否添加到列表的顶部，默认为 `true`。
* `tagData`: 附加到数据服务的数据。
* `list`: 当前的数据集。

## 构造函数

```typescript
protected constructor(service: T, keyField: string | CheckEqual, options: any = null)
```
* service: CommonDataService 实例。
* keyField: 数组中数据元素的主键或者是比较相等的函数。
* options: 可选参数，包含以下属性：
  * convert: DataConvert 函数。
  * fromTop: 布尔值，指示新添加的条目是否添加到列表的顶部。
  * tagData: 附加到数据服务的数据。

## 方法
* `buildNewEntry()`" 构造一个新的数据条目，并返回。
```ts
async buildNewEntry(): Promise<any>
```

* `save(data: any, isNew: boolean)`: 调用远程的保存或者更新接口，并更新本地数据集合。
  * data: 要保存的数据。
  * isNew: 布尔值，指示是否为新数据。
```ts
async save(data: any, isNew: boolean): Promise<void>
```

* `remove(item: any)`: 调用远程的删除接口并且从本地数据集合中删除一条数据记录。
  * item: 要删除的数据项。

```ts
async remove(item: any): Promise<void>
```

* `removeItem(item: any)`: 从本地数据集合中删除一条数据记录，该方法运行子类直接从本地列表中删除一条记录而不发送删除请求到服务器
  * item: 要删除的数据项。
```ts
protected removeItem(item: any): void
```
* `replace(item: any)`: 替换本地数据集合中主键相同的数据记录，通常用于子类中直接替换数据条目。
  * item: 要替换的数据项。

```ts
protected replace(item: any): void
```

* `append(item: any)`: 在本地数据集合的开头添加一条数据记录。
  * item: 要添加的数据项。

```ts
protected append(item: any): void
```

* `set list(value: Array<any>)`: 设置本地数据集合。
  * value: 要设置的数据集合。
```ts
protected set list(value: Array<any>)
```

* `get list(): any`: 获取本地数据集合的副本。

```ts
get list(): any
```

## 使用示例

```ts
import {BaseDataManager} from '@ticate/BaseDataManager';
import { MyDataService } from './my-data-service';

class MyDataManager extends BaseDataManager<MyDataService> {
    constructor(service: MyDataService, options: any = null) {
        super(service, (e1: any, e2: any) => e1.id == e2.id, options);
    }
}

const service = new MyDataService();

const manager = new MyDataManager(service);

// 构建新条目
manager.buildNewEntry().then(newItem => {
    // ...
});

// 保存条目
manager.save(data, true).then(() => {
    // ...
});

// 删除条目
manager.remove(item).then(() => {
    // ...
});

// 获取列表
const list = manager.list;
```

## 注意事项
* `BaseDataManager` 是一个抽象类，需要继承后才能使用。
* `CommonDataService` 需要根据实际情况进行实现。
* `checkEqual` 函数需要根据实际情况进行实现，用于比较数据项是否相等。
* `convert` 函数可以用于在保存或加载数据时进行数据转换。
