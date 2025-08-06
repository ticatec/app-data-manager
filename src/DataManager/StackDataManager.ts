
import {PagingDataService} from "@ticatec/app-data-service";
import CommonPagedDataManager from "./CommonPagedDataManager";
import {CheckEqual} from "./BaseDataManager";

/**
 * 堆叠数据管理器，继承自通用分页数据管理器，实现了堆叠式数据加载
 * 新数据会与现有数据合并，用于实现“加载更多”功能
 * @template T 继承自PagingDataService的服务类型
 */
export default class StackDataManager<T extends PagingDataService> extends CommonPagedDataManager<T> {

    /**
     * 构造函数
     * @param service 分页数据服务实例
     * @param keyField 主键字段名或相等性检查函数
     * @param options 配置选项
     */
    constructor(service:T, keyField: string | CheckEqual, options: any = null) {
        super(service, keyField, options);
    }


    /**
     * 处理查询返回的结果，将新数据与现有数据合并
     * @param result 查询结果，包含list属性
     * @protected
     */
    protected processDataResult(result: any) {
        this.list.union(result.list, this.checkEqual);
    }

    /**
     * 加载新的一页数据（下一页）
     */
    async loadMore(): Promise<void> {
        if (this.getPageNo() < this.getPageCount()) {
            await this.setPageNo(this.getPageNo() + 1);
        }
    }

    /**
     * 是否有更多的记录
     * @returns 如果还有更多页可以加载，返回true
     */
    hasMore(): boolean {
        return this.getPageNo() < this.getPageCount();
    }


}