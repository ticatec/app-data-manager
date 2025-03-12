# FullListDataManager

## Introduction

`FullListDataManager` inherits from `BaseDataManager` and is specifically designed to manage complete list data. It extends `BaseDataManager` by providing a `loadData` method to load a full data list from a data service.

## Type Definitions

* `T extends FullListDataService`: A generic type representing a data service type that inherits from `FullListDataService`.

## Properties

`FullListDataManager` inherits all properties from `BaseDataManager`, including:

* `service`: An instance of `FullListDataService` used to interact with the underlying data service.
* `checkEqual`: A `CheckEqual` function used to compare data items.
* `convert`: A `DataConvert` function used to transform data items.
* `fromTop`: A boolean indicating whether newly added entries are added to the top of the list; defaults to `true`.
* `tagData`: Data attached to the data service.
* `list`: The current dataset.

## Constructor

`FullListDataManager` inherits the constructor from `BaseDataManager`, so it is used in the same way:

```typescript
constructor(service: T, keyField: string | CheckEqual, options: any = null)
```
* Parameters are the same as those in `BaseDataManager`.

## Methods

* `loadData(params?: any)`: Loads the complete data list from the data service and sets it to the `list` property.
    * `params`: Optional parameter passed to the `getList` method.
```ts
async loadData(params?: any): Promise<void>
```

## Usage Example

```ts
import FullListDataManager from './full-list-data-manager';
import { MyFullListDataService } from './my-full-list-data-service';

class MyFullListDataManager extends FullListDataManager<MyFullListDataService> {
    constructor() {
        super(new MyFullListDataService(), 'code');
    }
}


const manager = new MyFullListDataManager();

// Load data
manager.loadData().then(() => {
    const list = manager.list;
    console.log(list);
});

// Load data with parameters
manager.loadData().then(() => {
    const list = manager.list;
    console.log(list);
});

// Save an entry
manager.save(data, true).then(() => {
    // ...
});

// Remove an entry
manager.remove(item).then(() => {
    // ...
});
```