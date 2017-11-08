import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { SchoolService } from '../../../_services/school.service';
import { InstitutesService } from '../../../_services/institute.service';
import { BoardService } from '../../../_services/board.service';

import { School } from "../../../_models/School";

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
    success:number;

    constructor(
        private formBuilder: FormBuilder, private schoolService: SchoolService, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler, private instituteService: InstitutesService, private boardService: BoardService
    ) {
    }

    ngOnInit() {
        this.institutes = [];
        let val = this.instituteService.getAllInstitutes();
        this.institutes.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.institutes.push({ label: response[key].instituteName, value: response[key].id });
                }
            }
        });

        this.boards = [];
        val = this.boardService.getAllBoards();
        this.boards.push({ label: '--Select--', value: 'select' });
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
            schoolPhone: ['', [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
            schoolAddress: ['', [Validators.required]],
            schoolCity: ['', [Validators.required]],
            schoolState: ['', [Validators.required]],
            schoolLogo: ['logo.png'],
            schoolHeader: ['',[Validators.required]],
            createdOn : [''],
            createdBy: ['']
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['schoolId'];
            if (this.params) {
                this.schoolService.getSchoolById(this.params)
                    .subscribe(
                    (results: School) => {
                        console.log(results);
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
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }

    onSubmit({ value, valid }: { value: School, valid: boolean }) {
        debugger;
        if (this.params) {
            this.schoolService.updateSchool(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/school/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            value.createdBy = "1";
            value.createdOn = "08-11-2017";
            this.schoolService.createSchool(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/school/list']);
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
        // var fr = new FileReader;
        // var success = 0;
        // fr.readAsDataURL(fileInput[0]);
        // fr.onload = function () {
        //     var img = new Image;

        //     img.onload = function () {
        //         if (img.height <= 50 && img.width <= 160) {
        //             success = 1;
        //         }
        //         else {
        //             success = 0;
        //             alert(img.width);
        //             alert(img.height);

        //         }
        //     };
        //     img.src = fr.result;
        // };
        // if (success == 0)
        //     this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
    }


}

