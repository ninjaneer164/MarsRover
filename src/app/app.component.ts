import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CameraType } from './models/enums/CameraType';
import { DataService } from './services/data.service';
import { EnumHelper } from './models/EnumHelper';
import { Rover } from './models/Rover';
import { RoverType } from './models/enums/RoverType';
import { SelectItem } from './models/SelectItem';

import { saveAs } from 'file-saver/FileSaver';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public callStatus: Map<string, boolean> = new Map<string, boolean>();
    public cameras: SelectItem[] = [];
    public cameraType: CameraType = null;
    public canSubmit: boolean = false;
    public error: string = '';
    public form: FormGroup;
    public loading: boolean = false;
    public marsDates: SelectItem[] = [];
    public photos: string[] = [];
    public results: Map<string, any[]> = new Map<string, any[]>();
    public rovers: SelectItem[] = [];

    constructor(
        private dataService: DataService,
        private fb: FormBuilder
    ) { }

    public ngOnInit() {
        this.marsDates = [
            '2015-02-22',
            '2016-03-01',
            '2017-07-03',
            '2017-12-15',
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

        this.form = this.fb.group({
            rover: ['', Validators.required],
            camera: ['', Validators.required]
        });
    }

    public download(url: string): void {
        this.dataService.downloadImage(url).subscribe((blob) => {
            const fileName = url.split('/').pop();
            saveAs(blob, fileName);
        });
    }

    public initCameras(): void {
        const r = this.form.value['rover'];
        this.cameraType = null;
        this.cameras = EnumHelper.getNames(CameraType).filter((t) => {
            return (r !== null)
                && (r.cameras.find((c) => {
                    return (c.type === CameraType[t]);
                }) !== undefined);
        }).map((t) => {
            return {
                label: t,
                value: CameraType[t]
            };
        });
    }

    public onSubmit(): void {
        this.callStatus.clear();
        this.results.clear();
        this.photos = [];
        this.error = '';

        this.marsDates.forEach((date) => {
            this.callStatus.set(date.label, false);
            this.results.set(date.label, []);
        });

        const values = this.form.value;

        const rover = RoverType[values.rover.type].toLowerCase();
        const camera = CameraType[values.camera].toLowerCase();

        this.marsDates.forEach((date) => {
            this._getImages(date.label, rover, camera);
        });

        this.loading = true;
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
                return p.img_src;
            });

            this.loading = false;
        }
    }

    private _getImages(date: string, rover: string, camera: string): void {
        this._getImageByPage(date, rover, camera, 1);
    }

    private _getImageByPage(date: string, rover: string, camera: string, page: number): void {
        this.dataService.getImages(date, rover, camera, page).subscribe((d: any) => {
            const photos = d.photos;
            if ((photos !== undefined) && Array.isArray(photos)) {
                if (photos.length === 25) {
                    this._getImageByPage(date, rover, camera, page + 1);
                } else {
                    const p = this.results.get(date);
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
        }, (e) => {
            this.error = e.text();
            console.error(this.error);
        });
    }
}
