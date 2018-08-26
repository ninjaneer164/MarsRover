export class IdManager {

    private static _id: number = new Date().getTime();

    public static getNew(): number {
        const t = new Date().getTime();

        if (t <= IdManager._id) {
            IdManager._id++;
        } else {
            IdManager._id = t;
        }

        return IdManager._id;
    }
}

export class Utils {

    public static isNullOrUndefined(obj: any): boolean {
        return obj === null || obj === undefined;
    }
    public static isNullOrEmpty(s: string): boolean {
        return this.isNullOrUndefined(s) || s.trim().length < 1;
    }
    public static parseObject(src: any, dst: any): any {
        if (!this.isNullOrUndefined(src)) {
            Object.keys(src).forEach((k) => {
                if (dst[k] !== undefined) {
                    dst[k] = src[k];
                }
            });
        }
        return dst;
    }
}

export class BaseClass {

    private _id: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        throw new Error('"id" cannot be set');
    }

    constructor() {
        this._id = IdManager.getNew();
    }

    public isNullOrUndefined(obj: any): boolean {
        return Utils.isNullOrUndefined(obj);
    }
    public isNullOrEmpty(str: string): boolean {
        return Utils.isNullOrEmpty(str);
    }
}
