# BaseDataManager

## Introduction

`BaseDataManager` is an abstract base class used to manage data collections. It provides a series of methods for manipulating data, including saving, deleting, replacing, and more. This class is based on `CommonDataService` to interact with the underlying data service.

## Type Definitions

* `CheckEqual`: A function type used to compare whether two data items are equal.
* `DataConvert`: A function type used to convert data items.

## Properties

* `service`: An instance of `CommonDataService`, used to interact with the underlying data service.
* `checkEqual`: A `CheckEqual` function used to compare data items.
* `convert`: A `DataConvert` function used to convert data items.
* `fromTop`: A boolean value indicating whether newly added entries are added to the top of the list; defaults to `true`.
* `tagData`: Data attached to the data service.
* `list`: The current dataset.

## Constructor

```typescript
protected constructor(service: T, keyField: string | CheckEqual, options: any = null)
```
* `service`: An instance of `CommonDataService`.
* `keyField`: The primary key of the data elements in the array or a function to compare equality.
* `options`: Optional parameter, containing the following properties:
    * `convert`: A `DataConvert` function.
    * `fromTop`: A boolean value indicating whether newly added entries are added to the top of the list.
    * `tagData`: Data attached to the data service.

## Methods

* `buildNewEntry()`: Constructs a new data entry and returns it.
```ts
async buildNewEntry(): Promise<any>
```

* `save(data: any, isNew: boolean)`: Calls the remote save or update interface and updates the local data collection.
    * `data`: The data to be saved.
    * `isNew`: A boolean value indicating whether the data is new.
```ts
async save(data: any, isNew: boolean): Promise<void>
```

* `remove(item: any)`: Calls the remote delete interface and removes a data record from the local data collection.
    * `item`: The data item to be deleted.
```ts
async remove(item: any): Promise<void>
```

* `removeItem(item: any)`: Removes a data record from the local data collection. This method allows subclasses to directly remove a record from the local list without sending a delete request to the server.
    * `item`: The data item to be deleted.
```ts
protected removeItem(item: any): void
```

* `replace(item: any)`: Replaces a data record in the local data collection with a matching primary key, typically used in subclasses to directly replace data entries.
    * `item`: The data item to replace with.
```ts
protected replace(item: any): void
```

* `append(item: any)`: Adds a data record to the beginning of the local data collection.
    * `item`: The data item to be added.
```ts
protected append(item: any): void
```

* `set list(value: Array<any>)`: Sets the local data collection.
    * `value`: The data collection to be set.
```ts
protected set list(value: Array<any>)
```

* `get list(): any`: Retrieves a copy of the local data collection.
```ts
get list(): any
```

## Usage Example

```ts
import { BaseDataManager } from '@ticate/BaseDataManager';
import { MyDataService } from './my-data-service';

class MyDataManager extends BaseDataManager<MyDataService> {
    constructor(service: MyDataService, options: any = null) {
        super(service, (e1: any, e2: any) => e1.id == e2.id, options);
    }
}

const service = new MyDataService();

const manager = new MyDataManager(service);

// Build a new entry
manager.buildNewEntry().then(newItem => {
    // ...
});

// Save an entry
manager.save(data, true).then(() => {
    // ...
});

// Remove an entry
manager.remove(item).then(() => {
    // ...
});

// Get the list
const list = manager.list;
```

## Notes

* `BaseDataManager` is an abstract class and must be inherited to be used.
* `CommonDataService` needs to be implemented based on specific requirements.
* The `checkEqual` function needs to be implemented based on specific requirements to compare whether data items are equal.
* The `convert` function can be used to transform data when saving or loading.
