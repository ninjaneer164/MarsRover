import { BaseModel } from '../core/base.model';
import { RoverType } from './enums/RoverType';
import { Camera } from './Camera';

export class Rover extends BaseModel {
    id: number = 0;
    type: RoverType = RoverType.Curiosity;
    landingDate: string = '';
    launchDate: string = '';
    status: string = '';
    maxSol: number = 0;
    maxDate: string = '';
    totalPhotos: number = 0;
    cameras: Camera[] = [];

    constructor(data: any = null) {
        super(data);
        if (data) {
            if ((data.cameras !== undefined) && Array.isArray(data.cameras)) {
                this.cameras = data.cameras.map((c) => {
                    return new Camera(c);
                });
            }
            if (data.type !== undefined) {
                this.type = data.type;
            }
        }
    }
}
