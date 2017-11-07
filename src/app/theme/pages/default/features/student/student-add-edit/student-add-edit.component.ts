import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { StudentService } from '../../../_services/student.service';
import { CommonService } from '../../../_services/common.service';
import { Student } from "../../../_models/Student";

@Component({
    selector: "app-students-list",
    templateUrl: "./student-add-edit.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class StudentAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    studentForm: FormGroup;
    institutes: SelectItem[];
    genderList: any;
    classList: any;
    yearList: any;
    boardList: any;
    categoryList: any;
    bloodGroupList: any;
    genderSelected: string;
    classSelected: string;
    categorySelected: string;
    boardSelected: string;
    yearSelected: string;
    bloodGroupSelected : string;


    constructor(
        private formBuilder: FormBuilder, private studentService: StudentService, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler, private commonService: CommonService
    ) {
    }

    ngOnInit() {

        let list = this.commonService.getGender();
        this.genderList = [];

        for (var index = 0; index < list.length; index++) {
            this.genderList.push({ label: list[index], value: list[index] });
        }

        list = this.commonService.getClass();
        this.classList = [];

        for (var index = 0; index < list.length; index++) {
            this.classList.push({ label: list[index], value: list[index] });
        }

        list = this.commonService.getYear();
        this.yearList = [];

        for (var index = 0; index < list.length; index++) {
            this.yearList.push({ label: list[index], value: list[index] });
        }

        list = this.commonService.getBoard();
        this.boardList = [];

        for (var index = 0; index < list.length; index++) {
            this.boardList.push({ label: list[index], value: list[index] });
        }

        list = this.commonService.getCategory();
        this.categoryList = [];

        for (var index = 0; index < list.length; index++) {
            this.categoryList.push({ label: list[index], value: list[index] });
        }

        list = this.commonService.getBloodGroup();
        this.bloodGroupList = [];

        for (var index = 0; index < list.length; index++) {
            this.bloodGroupList.push({ label: list[index], value: list[index] });
        }

        this.studentForm = this.formBuilder.group({
            id: [],
            StudentId: [],
            StudentCode: [],
            SchoolId: [],
            CategoryId: [],
            FeePlanId: [],
            StandardId: [],
            DivisionId: [],
            ZoneFrequencyId: [],
            FirstName: ['', [Validators.required]],
            MiddleName: ['', [Validators.required]],
            LastName: ['', [Validators.required]],
            //Email: ['', [Validators.required]],
            //Phone: ['', [Validators.required]],
            FatherFirstName: ['', [Validators.required]],
            FatherLastName: ['', [Validators.required]],
            FatherMobile: [],
            MotherFirstName: [],
            MotherLastName: [],
            MotherMobile: [],
            GuardianFirstName: [],
            GuardianLastName: [],
            GuardianMobile: [],
            City: [],
            State: [],
            DOB: [],
            DOJ: [],
            ContactNumber: [],
            Age: [],
            DateOfBirth: [],
            AdmissionDate: [],
            AcademicYear: 0,
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['studentId'];
            if (this.params) {
                this.studentService.getStudentById(this.params)
                    .subscribe(
                    (results: Student) => {
                        this.studentForm.setValue({
                            id: results.id,
                            StudentId: results.StudentId,
                            StudentCode: results.StudentCode,
                            SchoolId: results.SchoolId,
                            CategoryId: results.CategoryId,
                            FeePlanId: results.FeePlanId,
                            StandardId: results.StandardId,
                            DivisionId: results.DivisionId,
                            ZoneFrequencyId: results.ZoneFrequencyId,
                            FirstName: results.FirstName,
                            MiddleName: results.MiddleName,
                            LastName: results.LastName,
                            Email: results.Email,
                            Phone: results.Phone,
                            Age: results.Age,
                            DateOfBirth: results.DateOfBirth,
                            AdmissionDate: results.AdmissionDate,
                            AcademicYear: 0,
                        });
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }


    onSubmit({ value, valid }: { value: Student, valid: boolean }) {
        console.log(value);
        if (this.params) {
            this.studentService.updateStudent(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/student/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {

        }
    }
    onCancel() {
        this.router.navigate(['/features/student/list']);
    }
}

