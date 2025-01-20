# Data Manager

## BaseDataManager
The BaseDataManager class is a generic class that provides basic CRUD operations for managing a list of data. It defines methods for saving, removing, and modifying data in a local list and database through a specified CommonDataService. The BaseDataManager is designed to be extended and implemented for specific use cases.

### Usage
The BaseDataManager class can be extended and implemented to manage any type of data.

```typescript
import BaseDataManager from "./BaseDataManager";
import MyDataService from "./MyDataService";

export default class MyDataManager extends BaseDataManager<MyDataService> {

    constructor(service: MyDataService) {
        super(service, (e1, e2) => e1.id === e2.id);
    }
}

```

### Constructor
The BaseDataManager constructor requires the following parameters:

**service** - an instance of a CommonDataService subclass for handling the actual CRUD operations  
**checkEqual** - a function that takes two items and returns a boolean indicating whether they are equal. This function is used to identify items in the local list that need to be updated or removed.
Additionally, an optional convert parameter can be provided to convert the returned data before adding it to the local list.

### API

### public methods
**save(data: any, isNew: boolean): Promise<void>**  
saves data to the database and updates the local list. The isNew parameter indicates whether the data is new or an update to an existing item.  

**remove(item: any): Promise<void>**  
removes the specified item from the database and the local list.  

**list: Array<any>**  
returns a copy of the current local list.

### protected methods
**removeItem(item: any): void**  
removes the specified item from the local list.  

**append(item: any): void**  
adds the specified item to the beginning of the local list.  

**set list(value: Array<any>): void**  
sets the local list to the specified value.

## Common Pagination Data Manager
This module provides a CommonPaginationDataManager class that extends the BaseDataManager class. It is used for managing data that can be displayed on a paginated table.


Usage
To use this module, first import the CommonPaginationDataManager class and any required dependencies:
```typescript
import {BaseDataManager, DataConvert} from "@ticatec/app-data-manager";
import type {CheckEqual} from "@ticatec/data-manager";
import type {CommonPaginationDataService} from "@ticatec/app-data-manager";
import {utils} from "@ticatec/enhanced-utils";
```
Then, extend the CommonPaginationDataManager class and implement the processDataResult method:
```typescript
export default abstract class CommonPaginationDataManager<T extends CommonPaginationDataService> extends BaseDataManager<T> {
    
    constructor(service:T, checkEqual: CheckEqual, convert?: DataConvert) {
        super(service, checkEqual, convert);
    }
}

```

### Methods
The CommonPaginationDataManager class provides the following methods:

**setRowsPerPage(value: number)**: 
sets the number of rows per page.

**searchData(criteria: any, pageNo: number = 1)**: 
searches for data based on the specified criteria and page number.

**setPageNo(value: number)**: 
sets the current page number to the specified value.

**initialize()**: 
initializes the data manager.

**resetSearch()**: 
resets the search criteria.

**search(criteria)**: 
searches for data based on the specified criteria.

**refresh()**: 
refreshes the data.

**getPageNo():number**: 
gets the current page number.

**getPageCount(): number**: 
gets the total number of pages.

**getPageCount():number:**  
the total number of pages.

### Properties
The CommonPaginationDataManager class provides the following properties:

**criteria**: the current search criteria.


## StackDataManager

StackDataManager is an abstract class that extends CommonPaginationDataManager and adds the ability to load more data from the server.

### Usage

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

**constructor(service: T, checkEqual: CheckEqual, convert?: DataConvert)**
Constructs a new StackDataManager instance.  
**service** - The service to use for querying data.  
**checkEqual** - The function to use for comparing two objects.  
**convert** - The function to use for converting data from the server.  

#### methods

**loadMore(): Promise<void>**
Loads the next page of data from the server.

**hasMore(): boolean**
Returns a boolean indicating if there is more data to be loaded.
