
# FullListDataManager 类说明文档

## 简介

`FullListDataManager` 继承自 `BaseDataManager`，专门用于管理完整列表数据。它扩展了 `BaseDataManager`，提供了一个 `loadData` 方法，用于从数据服务加载完整的数据列表。

## 类型定义

* `T extends FullListDataService`: 泛型类型，表示继承自 `FullListDataService` 的数据服务类型。

## 属性

`FullListDataManager` 继承了 `BaseDataManager` 的所有属性，包括：

* `service`: `FullListDataService` 实例，用于与底层数据服务交互。
* `checkEqual`: `CheckEqual` 函数，用于比较数据项。
* `convert`: `DataConvert` 函数，用于转换数据项。
* `fromTop`: 布尔值，指示新添加的条目是否添加到列表的顶部，默认为 `true`。
* `tagData`: 附加到数据服务的数据。
* `list`: 当前的数据集。

## 构造函数

`FullListDataManager` 继承了 `BaseDataManager` 的构造函数，因此使用方式相同：

```typescript
constructor(service: T, keyField: string | CheckEqual, options: any = null)
```
* 参数同`BaseDataManager`

## 方法

* `loadData(params?: any)`: 从数据服务加载完整的数据列表，并设置到 list 属性。
  * params: 可选参数，用于传递给 getList 方法。
```ts
async loadData(params?: any): Promise<void>
```

## 使用示例

```ts
import FullListDataManager from './full-list-data-manager';
import { MyFullListDataService } from './my-full-list-data-service';

const service = new MyFullListDataService();

class MyFullListDataManager extends FullListDataManager<MyFullListDataService> {
    constructor() {
        super(service, 'code');
    }
}


const manager = new MyFullListDataManager();

// 加载数据
manager.loadData().then(() => {
    const list = manager.list;
    console.log(list);
});

// 加载带参数的数据
manager.loadData().then(() => {
    const list = manager.list;
    console.log(list);
});

// 保存条目
manager.save(data, true).then(() => {
    // ...
});

// 删除条目
manager.remove(item).then(() => {
    // ...
});
```
