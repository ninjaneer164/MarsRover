import {
    Injectable
} from '@angular/core';
import {
    Headers,
    Http,
    RequestOptions,
    ResponseContentType
} from '@angular/http';
import Utils from '../core/core';

@Injectable()
export class DataService {

    private _apiKey: string = 'Ba6rCdp8BHmPSXSl9TISwRjlYnY2ShVRsTHmfrsv';

    constructor(
        private http: Http
    ) {
    }

    public downloadImage(url: string, onSuccess: Function = null, onError: Function = null): void {
        this._get(url, ResponseContentType.Blob, onSuccess, onError);
    }
    public getImages(date: string, rover: string, camera: string, page: number = 1, onSuccess: Function = null, onError: Function = null): void {
        let q = [
            'api_key=' + this._apiKey,
            'camera=' + camera,
            'earth_date=' + date,
            'page=' + page
        ];

        let url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + rover + '/photos?' + q.join('&');

        this._get(url, ResponseContentType.Json, onSuccess, onError);
    }

    private _get(url: string, responseType: ResponseContentType = ResponseContentType.Json, onSuccess: Function = null, onError: Function = null): void {
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            responseType
        });

        (this.http
            .get(url, options)
            .subscribe((data) => {
                if (onSuccess) {
                    switch (responseType) {
                        case ResponseContentType.Blob:
                            onSuccess(data.blob());
                            break;
                        default:
                            onSuccess(data.json());
                            break;
                    }
                }
            }, (error) => {
                if (onError) {
                    onError(error);
                } else {
                    console.error(error);
                }
            }));
    }
}
