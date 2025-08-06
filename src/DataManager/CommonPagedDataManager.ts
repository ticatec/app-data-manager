import BaseDataManager from "./BaseDataManager";
import type {CheckEqual} from "./BaseDataManager";
import type {PagingDataService} from "@ticatec/app-data-service";
import {utils} from "@ticatec/enhanced-utils";

/**
 * 通用分页数据管理器抽象类，提供分页查询和数据管理功能
 * @template T 继承自PagingDataService的服务类型
 */
export default abstract class CommonPagedDataManager<T extends PagingDataService> extends BaseDataManager<T> {

    private static rowsCount: number = 25;
    private static rowsKey: string = 'rows';
    private static pageNoKey: string = 'page';

    #criteria: any;
    #pageCount: number = 1;
    #pageNo: number = 1;
    #count: number = 0;
    #rows: number; //

    /**
     * 构造函数
     * @param service 分页数据服务实例
     * @param keyField 主键字段名或相等性检查函数
     * @param options 配置选项
     * @protected
     */
    protected constructor(service:T, keyField: string | CheckEqual, options: any = null) {
        super(service, keyField, options);
        this.list = [];
        this.#rows = CommonPagedDataManager.rowsCount;
        this.#criteria = this.tagData == null ? {} : utils.clone(this.tagData);
    }

    /**
     * 设置分页查询时每页行数的属性名称
     * @param value 每页行数
     */
    static setRowsPerPage(value: number):void {
        CommonPagedDataManager.rowsCount = value;
    }

    /**
     * 设置默认的每页行数
     * @param value 行数对应的属性名
     */
    static setRowsKey(value: string): void {
        CommonPagedDataManager.rowsKey = value
    }

    /**
     * 设置分页查询时候页吗对应的属性名称
     * @param value 页码对应的属性名
     */
    static setPageNoKey(value: string): void {
        CommonPagedDataManager.pageNoKey = value;
    }

    /**
     * 根据条件通过接口代理查询
     * @param criteria 查询条件
     * @returns 查询结果
     * @protected
     */
    protected async searchViaProxy(criteria:any) {
        return this.service.search(criteria);
    }

    /**
     * 根据条件查询数据
     * @param criteria 查询条件
     * @param pageNo 页码，默认为1
     */
    protected async searchData(criteria: any, pageNo: number = 1): Promise<void> {
        if (pageNo > this.#pageCount) {
            pageNo = this.#pageCount;
        }
        if (pageNo <= 0) {
            pageNo = 1;
        }
        if (pageNo != this.#pageNo) {
            this.#pageNo = pageNo;
        }
        criteria[CommonPagedDataManager.pageNoKey] = pageNo;
        criteria[CommonPagedDataManager.rowsKey] = this.#rows;
        let result = await this.searchViaProxy(criteria);
        this.processDataResult(result);
        this.#pageCount = Math.floor((result.count -1) / criteria.rows) + 1;
        this.#pageNo = pageNo || 1;
        this.#count = result.count;
        this.#criteria = utils.clone(criteria);
    }

    /**
     * 处理查询返回的结果（抽象方法，由子类实现）
     * @param result 查询结果
     * @protected
     */
    protected abstract processDataResult(result: any): void;

    /**
     * 设置新的显示页
     * @param value 页码
     */
    async setPageNo(value: number): Promise<void> {
        await this.searchData(this.#criteria, value);
    }

    /**
     * 重新设置每页的行数，并从首页查询
     * @param value 每页行数
     */
    async setRowsPage(value: number): Promise<void> {
        this.#rows = value;
        this.#pageNo = 1;
        await this.searchData(this.#criteria, this.#pageNo);
    }

    /**
     * 重置条件查询
     */
    async resetSearch(): Promise<void> {
        await this.searchData(this.buildCriteria());
    }

    /**
     * 按照条件重新查询
     * @param criteria 查询条件
     */
    async search(criteria: any): Promise<void> {
        await this.searchData(criteria);
    }

    /**
     * 设置查询条件
     * @param criteria 查询条件
     * @deprecated 请使用search方法
     */
    async setCriteria(criteria: any): Promise<void> {
        await this.searchData(criteria);
    }

    /**
     * 刷新查询数据
     */
    async refresh(): Promise<void> {
        await this.searchData(this.#criteria);
    }

    /**
     * 当前的查询条件
     * @returns 查询条件对象
     */
    get criteria(): any {
        return this.#criteria;
    }


    /**
     * 获取当前页码
     * @returns 当前页码
     * @protected
     */
    protected getPageNo():number {
        return this.#pageNo;
    }

    /**
     * 总页数
     * @returns 总页数
     * @protected
     */
    protected getPageCount(): number {
        return this.#pageCount;
    }

    /**
     * 返回纪录总数
     * @returns 纪录总数
     */
    get count(): number {
        return this.#count;
    }

    /**
     * 构建查询条件
     * @returns 查询条件对象
     * @protected
     */
    protected buildCriteria() {
        return {...this.tagData}
    }

}