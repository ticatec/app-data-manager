import type {CheckEqual} from "./BaseDataManager";
import type {PagingDataService} from "@ticatec/app-data-service";
import CommonPagedDataManager from "./CommonPagedDataManager";

/**
 * 分页数据管理器，继承自通用分页数据管理器，实现了简单的分页数据处理
 * @template T 继承自PagingDataService的服务类型
 */
export default class PagedDataManager<T extends PagingDataService> extends CommonPagedDataManager<T> {


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
     * 处理查询返回的结果，直接设置为当前列表
     * @param result 查询结果，包含list属性
     * @protected
     */
    protected processDataResult(result: any): void {
        this.list = result.list;
    }

    /**
     * 属性：总页数
     * @returns 总页数
     */
    get pageCount(): number {
        return super.getPageCount();
    }

    /**
     * 属性：当前的页码
     * @returns 当前页码
     */
    get pageNo(): number {
        return super.getPageNo();
    }
}