import { BaseModel } from '../core/base.model';
import { Camera } from './Camera';
import { Rover } from './Rover';

export class Photo extends BaseModel {
    id: number = 0;
    sol: number = 0;
    camera: Camera = null;
    imgSrc: string = '';
    earthDate: string = '';
    rover: Rover = null;

    constructor(data: any = null) {
        super(data);
    }
}
