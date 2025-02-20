import BaseDataManager from "./BaseDataManager";
import {FullListDataService} from "@ticatec/app-data-service";

export default class FullListDataManager extends BaseDataManager<FullListDataService> {

    async loadData(params?: any): Promise<void> {
        this.list = await this.service.getList(params);
    }

}