# Data Manager

[中文文档](./README-CN.md)

This library provides a series of data managers to simplify data management and operations in frontend applications. It primarily includes the following core classes:

### Detailed Introduction

1. `BaseDataManager` **(Base Data Manager)**:

* This is an abstract base class for managing data collections.
* It provides a series of common data operation methods, such as saving, deleting, replacing, and appending data.
* It relies on `CommonDataService` to interact with backend data services.
* It uses the `checkEqual` function to compare the equality of data items and allows data transformation via the `convert` function.
* It is suitable for managing any type of data collection but requires subclasses to inherit and implement specific data service interaction logic.

2. `FullListDataManager` **(Full List Data Manager)**:

* It inherits from `BaseDataManager` and is specifically designed to manage complete data lists.
* It provides a `loadData` method to load all data from the backend data service in a single request.
* It is suitable for scenarios where an entire dataset needs to be loaded at once, such as dropdown lists or static data displays.

3. `CommonPagedDataManager` **(Common Paged Data Manager)**:

* It inherits from `BaseDataManager` and is used to manage paginated data.
* It provides a series of methods for querying paginated data, setting pagination parameters, and refreshing data.
* It depends on `PagingDataService` to interact with backend data services that support pagination.
* It requires subclasses to implement specific data processing logic through the abstract `processDataResult` method.
* It is suitable for scenarios requiring paginated data loading, such as tables or list displays.

4. `PagedDataManager` **(Paged Data Manager)**:

* It inherits from `CommonPagedDataManager` and serves as a concrete paginated data manager.
* It simplifies the use of `CommonPagedDataManager` and provides more direct property access, making it easier for developers to retrieve pagination information.
* It overrides the `processDataResult` method to directly set the data list returned from the backend as the local data collection.
* It provides convenient access to pagination information through the `pageCount` and `pageNo` properties.
* It is suitable for most paginated data management scenarios, offering a simple and easy-to-use API.

5. `StackDataManager` **(Stacked Paged Data Manager)**:

* It inherits from `CommonPagedDataManager` and is used to manage stacked paginated data.
* It provides `loadMore` and `hasMore` methods to implement logic for stacking and loading more data.
* In the `processDataResult` method, it uses the `union` method to merge newly loaded data into the existing data collection, avoiding duplicates.
* It is suitable for scenarios requiring "load more" or "infinite scrolling" with stacked paginated loading.

### Purpose:
These data manager classes provide a structured way to manage data in frontend applications, simplifying operations such as data loading, storage, updating, and deletion. They abstract the interaction details with backend data services, allowing frontend developers to focus more on implementing business logic.

### Usage:
* First, create the appropriate data service class (e.g., `MyDataService`, `MyFullListDataService`, `MyPagingDataService`) based on the specific data service type.
* Then, inherit from the corresponding data manager class (e.g., `BaseDataManager`, `FullListDataManager`, `PagedDataManager`, `StackDataManager`) and implement necessary methods (e.g., `processDataResult`).
* When creating a data manager instance, pass in the data service instance and the `checkEqual` function.
* Use the methods provided by the data manager to load, save, delete, and update data.
* For paginated data managers, set query conditions, page numbers, and rows per page to perform paginated queries.
* For stacked data managers, use the `loadMore` and `hasMore` methods to implement lazy loading.

### Overall
This library provides a flexible and extensible data management solution, allowing developers to choose the appropriate manager class based on different data management needs. It simplifies the complexity of frontend data management, improving development efficiency and code quality.

### Related Documents

* [Base Data Manager](./README-BASE.md)
* [Full Dataset Manager](./README-FULL.md)
* [Paged Data Collection Manager](./README-PAGED.md)


## Dependencies

* [app-data-service](https://www.npmjs.com/package/@ticatec/app-data-service)

## Contributions

Issues and pull requests are welcome.

## Copyright

Copyright © 2023 Ticatec. All rights reserved.

This library is released under the MIT License. For more details about the license, please refer to the [LICENSE](LICENSE) file.

## Contact

huili.f@gmail.com

https://github.com/henryfeng/app