import Utils from './core';

export class BaseModel {
    constructor(data: any = null) {
        if (data !== null) {
            for (let p of data) {
                if (this[p] !== undefined) {
                    let v = data[p];
                    switch (typeof (this[p])) {
                        case 'boolean':
                            this[p] = Utils.parseBoolean(v);
                            break;
                        case 'number':
                            if (Utils.isNullOrEmpty(v)) {
                                this[p] = 0;
                            } else {
                                let v_ = 0;
                                if (v.toString().split('.').length > 1) {
                                    v_ = parseFloat(v);
                                } else {
                                    v_ = parseInt(v);
                                }
                                this[p] = isNaN(v_) ? 0 : v_;
                            }
                            break;
                        default:
                            this[p] = v;
                            break;
                    }
                }
            }
        }
    }
}
