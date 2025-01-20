import type {CheckEqual} from "./BaseDataManager";
import type {CommonPaginationDataService} from "@ticatec/app-data-service";
import CommonPaginationDataManager from "./CommonPaginationDataManager";

export default class PaginationDataManager<T extends CommonPaginationDataService> extends CommonPaginationDataManager<T> {


    constructor(service:T, checkEqual: CheckEqual, options: any = null) {
        super(service, checkEqual, options);
    }

    protected processDataResult(result: any): void {
        this.list = result.list;
    }

    /**
     * 属性：总页数
     */
    get pageCount(): number {
        return super.getPageCount();
    }

    /**
     * 属性：当前的页码
     */
    get pageNo(): number {
        return super.getPageNo();
    }
}