import { BaseModel } from '../core/base.model';
import { CameraType } from './enums/CameraType';

export class Camera extends BaseModel {

    public cameraId: number = 0;
    public fullName: string = '';
    public roverId: number = 0;
    public type: CameraType = CameraType.NONE;

    constructor(data: any = null) {
        super(data);
        if (data) {
            if (data.type !== undefined) {
                this.type = data.type;
            }
        }
    }
}
