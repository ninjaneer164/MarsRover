import { BaseModel } from '../core/base.model';
import { RoverType } from './enums/RoverType';
import { Camera } from './Camera';

export class Rover extends BaseModel {

    public type: RoverType = RoverType.Curiosity;
    public landingDate: string = '';
    public launchDate: string = '';
    public status: string = '';
    public maxSol: number = 0;
    public maxDate: string = '';
    public roverId: number = 0;
    public totalPhotos: number = 0;
    public cameras: Camera[] = [];

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
