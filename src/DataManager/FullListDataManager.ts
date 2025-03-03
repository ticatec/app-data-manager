import BaseDataManager from "./BaseDataManager";
import {FullListDataService} from "@ticatec/app-data-service";

export default class FullListDataManager<T extends FullListDataService> extends BaseDataManager<T> {

    async loadData(params?: any): Promise<void> {
        this.list = await this.service.getList(params);
    }

}