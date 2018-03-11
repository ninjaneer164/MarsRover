import { BaseModel } from '../core/base.model';
import { CameraType } from './enums/CameraType';

export class Camera extends BaseModel {
    id: number = 0;
    type: CameraType = CameraType.NONE;
    roverId: number = 0;
    fullName: string = '';

    constructor(data: any = null) {
        super(data);
        if (data) {
            if (data.type !== undefined) {
                this.type = data.type;
            }
        }
    }
}
