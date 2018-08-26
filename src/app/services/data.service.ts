import {
    Injectable
} from '@angular/core';
import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';
import {
    Response,
    ResponseContentType
} from '@angular/http';
import {
    Observable
} from 'rxjs';

@Injectable()
export class DataService {

    private _apiKey: string = 'Ba6rCdp8BHmPSXSl9TISwRjlYnY2ShVRsTHmfrsv';
    private _url: string = 'https://api.nasa.gov/mars-photos/api/v1/rovers';

    constructor(
        private http: HttpClient
    ) { }

    public downloadImage(url: string) {
        return this.http.get(url, { responseType: 'blob' });
    }

    public getImages(date: string, rover: string, camera: string, page: number = 1) {
        const q = [
            'api_key=' + this._apiKey,
            'camera=' + camera,
            'earth_date=' + date,
            'page=' + page
        ].join('&');

        const url = `${this._url}/${rover}/photos?${q}`;

        return this.http.get(url);
    }
}
