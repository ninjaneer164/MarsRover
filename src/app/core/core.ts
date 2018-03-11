export default class Utils {

    public static isNullOrEmpty(value: string): boolean {
        return (value === undefined) || (value === null) || (value.toString().replace(' ', '').length === 0);
    }
    public static parseBoolean(value: any): boolean {
        if ((value === undefined) || (value === null)) {
            return false;
        }
        let s = value.toString();
        return ((s.toLowerCase() === 'true') || (s.toLowerCase() === 'yes') || (s === '1'));
    }
}
