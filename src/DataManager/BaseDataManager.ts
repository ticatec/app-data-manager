import "@ticatec/enhanced-utils/EnArray";
import type {CommonDataService} from "@ticatec/app-data-service";

/**
 * 检查两个对象是否相等的函数类型
 * @param e1 第一个对象
 * @param e2 第二个对象
 * @returns 如果相等返回true，否则返回false
 */
export type CheckEqual = (e1: any, e2: any) => boolean;
/**
 * 数据转换函数类型
 * @param item 要转换的数据项
 * @param isNew 是否为新数据
 * @returns 转换后的数据
 */
export type DataConvert = (item: any, isNew: boolean) => any

/**
 * 数据管理器配置选项
 */
export interface ManagerOptions {
    /** 数据转换函数 */
    convert?: DataConvert;
    /** 是否从顶部添加数据 */
    fromTop?: boolean;
    /** 标签数据 */
    tagData?: any;
}

/**
 * 基础数据管理器抽象类，提供数据的基本CRUD操作和本地缓存管理
 * @template T 继承自CommonDataService的服务类型
 */
export default abstract class BaseDataManager<T extends CommonDataService> {

    private _list: Array<any>;
    protected fromTop: boolean = true;
    readonly service: T;
    protected readonly checkEqual: CheckEqual;
    protected readonly convert: DataConvert;
    protected readonly tagData: any;

    /**
     * 构造函数
     * @param service 数据服务实例
     * @param keyField 主键字段名或相等性检查函数
     * @param options 配置选项
     */
    protected constructor(service: T, keyField: string | CheckEqual, options: ManagerOptions = null) {
        this.service = service;
        this.checkEqual = typeof keyField == "string" ? ((o1: any, o2: any) => o1[keyField] == o2[keyField]) : keyField;
        this.convert = options?.convert;
        this.fromTop = options?.fromTop ?? true;
        this.tagData = options?.tagData;
    }


    /**
     * 保存一条记录到数据库，并加入到本地集合
     * @param data 要保存的数据
     * @param isNew 是否为新数据
     */
    async save(data: any, isNew: boolean): Promise<void> {
        let item = await this.service.save(data, isNew);
        if (this.convert != null) {
            item = this.convert(item, isNew);
        }
        if (isNew) {
            this._list = [item, ...this._list];
        } else {
            this._list.replace(item, this.checkEqual);
        }
    }

    /**
     * 删除一条记录，并从本地集合中删除
     * @param item 要删除的数据项
     */
    async remove(item: any): Promise<void> {
        await this.service.remove(item);
        this._list.remove(item);
    }

    /**
     * 从列表中删除数据
     * @param item 要删除的数据项
     * @protected
     */
    protected removeItem(item: any): void {
        this._list.remove(item);
    }

    /**
     * 替换主键相同的条目
     * @param item 要替换的数据项
     * @protected
     */
    protected replace(item: any): void {
        this._list.replace(item, this.checkEqual);
    }

    /**
     * 在列表增加一个条目到最前面
     * @param item 要添加的数据项
     * @protected
     */
    protected append(item: any): void {
        this._list = [item, ...this._list];
    }

    /**
     * 设置数据集
     * @param value 新的数据集
     * @protected
     */
    protected set list(value: Array<any>) {
        this._list = value;
    }

    /**
     * 当前的数据集
     * @returns 数据集的副本
     */
    get list(): any {
        return [...this._list];
    }

}

