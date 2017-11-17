import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { SchoolService } from '../../../_services/school.service';
import { ImageUploadService } from '../../../_services/imageUpload.service';
import { InstitutesService } from '../../../_services/institute.service';
import { BoardService } from '../../../_services/board.service';
import { School } from "../../../_models/School";
import { ViewChild } from '@angular/core';

@Component({
    selector: "app-users-list",
    templateUrl: "./school-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SchoolAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    schoolForm: FormGroup;
    institutes: SelectItem[];
    boards: SelectItem[];
    myLogo: any;
    success: number;
    imageFileName: string;
    @ViewChild('fileupload')
    myInputVariable: any;
    fileInput: any;

    constructor(
        private formBuilder: FormBuilder, private schoolService: SchoolService, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler, private instituteService: InstitutesService, private boardService: BoardService, private imageUploadService: ImageUploadService
    ) {
    }



    ngOnInit() {
        this.imageFileName = null;
        this.institutes = [];
        let val = this.instituteService.getAllInstitutes();
        //this.institutes.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.institutes.push({ label: response[key].instituteName, value: response[key].id });
                }
            }
        });

        this.boards = [];
        val = this.boardService.getAllBoards();
        //this.boards.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.boards.push({ label: response[key].boardName, value: response[key].id });
                }
            }
        });

        this.schoolForm = this.formBuilder.group({
            id: [0],
            instituteId: [, [Validators.required]],
            boardId: [, [Validators.required]],
            schoolName: ['', [Validators.required]],
            schoolCode: ['', [Validators.required]],
            schoolEmail: ['', [Validators.required, Validators.email]],
            schoolPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
            schoolAddress: ['', [Validators.required]],
            schoolCity: ['', [Validators.required]],
            schoolState: ['', [Validators.required]],
            schoolLogo: [],
            schoolHeader: ['', [Validators.required]],
            createdOn: [''],
            createdBy: ['']
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['schoolId'];
            if (this.params) {
                this.schoolService.getSchoolById(this.params)
                    .subscribe(
                    (results: School) => {
                        this.schoolForm.setValue({
                            id: results.id,
                            boardId: results.boardId,
                            instituteId: results.instituteId,
                            schoolName: results.schoolName,
                            schoolCode: results.schoolCode,
                            schoolEmail: results.schoolEmail,
                            schoolPhone: results.schoolPhone,
                            schoolAddress: results.schoolAddress,
                            schoolCity: results.schoolCity,
                            schoolState: results.schoolState,
                            schoolLogo: results.schoolLogo,
                            schoolHeader: results.schoolHeader,
                            createdBy: results.createdBy,
                            createdOn: results.createdOn,
                        });
                        this.imageFileName = results.schoolLogo;
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }

    onSubmit({ value, valid }: { value: School, valid: boolean }) {
        if (this.params) {
            value.schoolLogo = this.imageFileName;
            this.schoolService.updateSchool(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    var obj = { "name": results.id.toString() };

                    let fd = new FormData();
                    fd.append('image', this.fileInput[0]);

                    this.imageUploadService.uploadImage(results.id, fd).subscribe(
                        imageResponse => {
                            this.router.navigate(['/features/school/list']);
                        },
                        error => {
                            this.globalErrorHandler.handleError(error);
                        }
                    );





                    this.router.navigate(['/features/school/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            this.schoolService.createSchool(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    var obj = { "name": results.id.toString() };
                    //obj["name"] = results.id;
                    let fd = new FormData();
                    fd.append('image', this.fileInput[0]);

                    this.imageUploadService.uploadImage(results.id, fd).subscribe(
                        imageResponse => {
                            this.router.navigate(['/features/school/list']);
                        },
                        error => {
                            this.globalErrorHandler.handleError(error);
                        }
                    );
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }
    onCancel() {
        this.router.navigate(['/features/school/list']);
    }
    onUploadLogo(fileInput: any) {
        var rec = this;
        var fr = new FileReader;

        fr.readAsDataURL(fileInput[0]);
        this.fileInput = fileInput;
        let ext = fileInput[0].name.split('.')[1];
        if (ext != 'jpeg' && ext != 'jpg' && ext != 'png') {
            this.messageService.addMessage({ severity: 'fail', summary: 'Fail', detail: 'Wrong extention' });
            this.myInputVariable.nativeElement.value = "";
            return;
        }
        rec.imageFileName = fileInput[0].name;
        var img = new Image;
        var success = 0;
        fr.onload = function () {
            success = 1;
            img.onload = function () {
                if (img.height <= 50 && img.width <= 160) {
                    //
                    success = 1;

                }
                else {
                    rec.imageFileName = null;
                    success = 0;
                    rec.fileInput = null;
                    rec.messageService.addMessage({ severity: 'fail', summary: 'Fail', detail: 'Image Resolution not should be greater than 160 * 50 px ' });
                    rec.myInputVariable.nativeElement.value = "";
                }

            };
            img.src = fr.result;
        };
    }


}

