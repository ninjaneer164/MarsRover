import { BaseClass, Utils } from './core';

export class BaseModel extends BaseClass {
    constructor(data?: any) {
        super();

        Promise.resolve(null).then(() => {
            this.parseObject(data);
        });
    }

    public parseObject(data: any): void {
        Utils.parseObject(data, this);
    }
}
