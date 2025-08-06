import BaseDataManager, {CheckEqual, ManagerOptions} from "./BaseDataManager";
import {FullListDataService} from "@ticatec/app-data-service";

/**
 * 全列表数据管理器，继承自基础数据管理器，用于管理不需要分页的全列表数据
 * @template T 继承自FullListDataService的服务类型
 */
export default class FullListDataManager<T extends FullListDataService> extends BaseDataManager<T> {


    /**
     * 构造函数
     * @param service 数据服务实例
     * @param keyField 主键字段名或相等性检查函数
     * @param options 配置选项
     */
    protected constructor(service: T, keyField: string | CheckEqual,  options: ManagerOptions = null) {
        super(service, keyField, options);
    }

    /**
     * 加载数据，从服务获取全部数据列表
     */
    async loadData(): Promise<void> {
        this.list = await this.service.getList(this.tagData);
    }



}