import {CheckEqual} from "./BaseDataManager";
import {CommonPaginationDataService} from "@ticatec/app-data-service";
import CommonPaginationDataManager from "./CommonPaginationDataManager";

export default class StackDataManager<T extends CommonPaginationDataService> extends CommonPaginationDataManager<T> {

    #total: number;
    #hasMore: boolean;

    constructor(service:T, checkEqual: CheckEqual, options: any = null) {
        super(service, checkEqual, options);
    }


    protected processDataResult(result: any) {
        this.list.union(result.list, this.checkEqual);
    }

    /**
     * 加载新的一页数据
     */
    async loadMore(): Promise<void> {
        if (this.getPageNo() < this.getPageCount()) {
            await this.setPageNo(this.getPageNo() + 1);
        }
    }

    /**
     * 是否有更多的记录
     */
    hasMore(): boolean {
        return this.getPageNo() < this.getPageCount();
    }


}