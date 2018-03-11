import { Component } from '@angular/core';
import { Response } from '@angular/http';

import { SelectItem } from 'primeng/api';

import { Camera } from './models/Camera';
import { CameraType } from './models/enums/CameraType';
import { EnumHelper } from './models/EnumHelper';
import { Rover } from './models/Rover';
import { RoverType } from './models/enums/RoverType';

import { DataService } from './services/data.service';

import { saveAs } from 'file-saver/FileSaver';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    callStatus: Map<string, boolean> = new Map<string, boolean>();
    cameras: SelectItem[] = [];
    cameraType: CameraType = null;
    canSubmit: boolean = false;
    error: string = '';
    loading: boolean = false;
    marsDates: SelectItem[] = [];
    photos: string[] = [];
    results: Map<string, any[]> = new Map<string, any[]>();
    rovers: SelectItem[] = [];
    rover: Rover = null;

    constructor(
        private _dataService: DataService
    ) {

    }

    ngDoCheck() {
        this.canSubmit = (
            (this.rover !== null)
            && (this.cameraType !== null)
        );
    }
    ngOnInit() {
        this.marsDates = [
            '2017-12-15',
            '2016-03-01',
            '2015-02-22',
            '2017-07-03',
            '2019-05-03'
        ].map((d) => {
            return {
                label: d,
                value: d
            };
        });

        this.rovers = [
            {
                label: 'Curiosity',
                value: new Rover({
                    type: RoverType.Curiosity,
                    cameras: [
                        {
                            type: CameraType.FHAZ
                        },
                        {
                            type: CameraType.RHAZ
                        },
                        {
                            type: CameraType.MAST
                        },
                        {
                            type: CameraType.CHEMCAM
                        },
                        {
                            type: CameraType.MAHLI
                        },
                        {
                            type: CameraType.MARDI
                        },
                        {
                            type: CameraType.NAVCAM
                        }
                    ]
                })
            },
            {
                label: 'Opportunity',
                value: new Rover({
                    type: RoverType.Opportunity,
                    cameras: [
                        {
                            type: CameraType.FHAZ
                        },
                        {
                            type: CameraType.RHAZ
                        },
                        {
                            type: CameraType.NAVCAM
                        },
                        {
                            type: CameraType.PANCAM
                        },
                        {
                            type: CameraType.MINITES
                        }
                    ]
                })
            },
            {
                label: 'Spirit',
                value: new Rover({
                    type: RoverType.Spirit,
                    cameras: [
                        {
                            type: CameraType.FHAZ
                        },
                        {
                            type: CameraType.RHAZ
                        },
                        {
                            type: CameraType.NAVCAM
                        },
                        {
                            type: CameraType.PANCAM
                        },
                        {
                            type: CameraType.MINITES
                        }
                    ]
                })
            }
        ];

        this.initCameras();
    }

    public download(photo: any): void {
        this._dataService.downloadImage(photo.img_src, (blob) => {
            let fileName = photo.img_src.split('/').pop();
            saveAs(blob, fileName);
        });
    }
    public initCameras(): void {
        this.cameraType = null;
        this.cameras = EnumHelper.getNames(CameraType).filter((t) => {
            return (this.rover !== null)
                && (this.rover.cameras.find((c) => {
                    return (c.type === CameraType[t]);
                }) !== undefined);
        }).map((t) => {
            return {
                label: t,
                value: CameraType[t]
            };
        });
    }
    public submit(): void {
        this.callStatus.clear();
        this.results.clear();
        this.photos = [];
        this.error = '';

        this.marsDates.forEach((date) => {
            this.callStatus.set(date.label, false);
            this.results.set(date.label, []);
        });
        let rover = RoverType[this.rover.type].toLowerCase();
        let camera = CameraType[this.cameraType].toLowerCase();
        this.marsDates.forEach((date) => {
            this._getImages(date.label, rover, camera);
        });
    }
    private _checkPhotos(): void {
        let done = true;
        this.callStatus.forEach((s) => {
            done = done && s;
        });

        if (done) {
            console.log('DONE!!');
            let photos = [];
            this.results.forEach((p) => {
                photos = photos.concat(p);
            });
            photos.sort((a, b) => {
                if (a.earth_date < b.earth_date) {
                    return -1;
                }
                if (a.earth_date > b.earth_date) {
                    return 1;
                }
                return 0;
            });
            this.photos = photos.map((p) => {
                return p;
            });
        }
    }
    private _getImages(date: string, rover: string, camera: string): void {
        this._getImageByPage(date, rover, camera, 1);
    }
    private _getImageByPage(date: string, rover: string, camera: string, page: number): void {
        this._dataService.getImages(date, rover, camera, page, (d_) => {
            let photos = d_.photos;
            if ((photos !== undefined) && Array.isArray(photos)) {
                if (photos.length === 25) {
                    this._getImageByPage(date, rover, camera, page + 1);
                } else {
                    let p = this.results.get(date);
                    photos.forEach((photo) => {
                        if (p.find((p_) => {
                            return (p_.img_src === photo.img_src);
                        }) === undefined) {
                            p.push(photo);
                        }
                    });
                    this.results.set(date, p);

                    if (photos.length < 25) {
                        this.callStatus.set(date, true);
                        this._checkPhotos();
                    }
                }
            }
        }, (e: Response) => {
            this.error = e.text();
            console.error(this.error);
        });
    }
}
