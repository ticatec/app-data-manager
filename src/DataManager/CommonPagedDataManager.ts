import BaseDataManager from "./BaseDataManager";
import type {CheckEqual} from "./BaseDataManager";
import type {PagingDataService} from "@ticatec/app-data-service";
import {utils} from "@ticatec/enhanced-utils";

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
     *
     * @param service
     * @param checkEqual
     * @param options
     * @protected
     */
    protected constructor(service:T, checkEqual: CheckEqual, options: any = null) {
        super(service, checkEqual, options);
        this.list = [];
        this.#rows = CommonPagedDataManager.rowsCount;
        this.#criteria = service.buildCriteria(this.tagData);
    }

    /**
     * 设置分页查询时每页行数的属性名称
     * @param value
     */
    static setRowsPerPage(value: number):void {
        CommonPagedDataManager.rowsCount = value;
    }

    /**
     * 设置默认的每页行数
     * @param value
     */
    static setRowsKey(value: string): void {
        CommonPagedDataManager.rowsKey = value
    }

    /**
     * 设置分页查询时候页吗对应的属性名称
     * @param value
     */
    static setPageNoKey(value: string): void {
        CommonPagedDataManager.pageNoKey = value;
    }

    /**
     * 删除一条记录，并从本地集合中删除
     * @param item
     */
    async remove(item:any):Promise<void> {
        await super.remove(item);
    }

    /**
     * 根据条件通过接口代理查询
     * @param criteria
     * @protected
     */
    protected async searchViaProxy(criteria:any) {
        return this.service.search(criteria);
    }

    /**
     * 根据条件查询数据
     * @param criteria
     * @param pageNo
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
     * 处理查询返回的结果
     * @param result
     * @protected
     */
    protected abstract processDataResult(result: any): void;

    /**
     * 设置新的显示页
     * @param value
     */
    async setPageNo(value: number): Promise<void> {
        await this.searchData(this.#criteria, value);
    }

    /**
     * 重新设置每页的行数，并从首页查询
     * @param value
     */
    async setRowsPage(value: number): Promise<void> {
        let times = value / this.#rows;
        this.#rows = value;
        this.#pageNo = 1;
        await this.searchData(this.#criteria, this.#pageNo);
    }

    /**
     * 重置查询条件
     */
    resetCriteria(): any {
        return this.service.buildCriteria(this.tagData);
    }

    /**
     * 重置条件查询
     */
    async resetSearch(): Promise<void> {
        await this.searchData(this.service.buildCriteria(this.tagData));
    }

    /**
     * 按照条件重新查询
     * @param criteria
     */
    async search(criteria: any): Promise<void> {
        await this.searchData(criteria);
    }

    /**
     * 设置查询条件
     * @param criteria
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
     */
    get criteria(): any {
        return this.#criteria;
    }


    protected getPageNo():number {
        return this.#pageNo;
    }

    /**
     * 总页数
     */
    protected getPageCount(): number {
        return this.#pageCount;
    }

    /**
     * 返回纪录总数
     * @protected
     */
    get count(): number {
        return this.#count;
    }

}