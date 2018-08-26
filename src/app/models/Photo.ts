import { BaseModel } from '../core/base.model';
import { Camera } from './Camera';
import { Rover } from './Rover';

export class Photo extends BaseModel {

    public camera: Camera = null;
    public earthDate: string = '';
    public imgSrc: string = '';
    public photoId: number = 0;
    public rover: Rover = null;
    public sol: number = 0;

    constructor(data: any = null) {
        super(data);
    }
}
