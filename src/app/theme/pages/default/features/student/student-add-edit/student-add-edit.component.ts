import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { StudentService } from '../../../_services/student.service';
import { CommonService } from '../../../_services/common.service';
import { ClassService } from '../../../_services/class.service';
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
    genderSelected: string; bloodGroupSelected: string;
    dateOfBirth : string;
    dateOfJoining : string;
    
    constructor(
        private formBuilder: FormBuilder, private studentService: StudentService, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler, private commonService: CommonService, private _script: ScriptLoaderService,
        private classService: ClassService
    ) {
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');

    }

    ngOnInit() {

        //List of Gender
        let list = this.commonService.getGender();
        this.genderList = [];

        for (var index = 0; index < list.length; index++) {
            this.genderList.push({ label: list[index], value: list[index] });
        }

        //List of Classes
        this.classList = [];
        let val = this.classService.getAllClasses();
        //this.classList.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.classList.push({ label: response[key].className, value: response[key].id });
                }
            }
        });

        //List of Academic Year
        val = this.commonService.getYear();
        this.yearList = [];

        //this.yearList.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.yearList.push({ label: response[key].academicYear, value: response[key].id });
                }
            }
        });

        //List of Categories
        this.categoryList = [];
        val = this.commonService.getCategory();
        //this.categoryList.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.categoryList.push({ label: response[key].categoryName, value: response[key].id });
                }
            }
        });

        //List of Blood groups
        list = this.commonService.getBloodGroup();
        this.bloodGroupList = [];

        for (var index = 0; index < list.length; index++) {
            this.bloodGroupList.push({ label: list[index], value: list[index] });
        }

        this.studentForm = this.formBuilder.group({
            id: [],
            studentFirstName: ['', [Validators.required]],
            studentMiddleName: ['', [Validators.required]],
            studentLastName: ['', [Validators.required]],
            studentGender: ['', [Validators.required]],
            fatherFirstName: ['', [Validators.required]],
            fatherLastName: ['', [Validators.required]],
            fatherMobile: [, [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
            motherFirstName: ['', [Validators.required]],
            motherLastName: ['', [Validators.required]],
            motherMobile: [, [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
            guardianFirstName: [''],
            guardianLastName: [''],
            guardianMobile: [],
            classId: [, [Validators.required]],
            categoryId: [, [Validators.required]],
            academicYear: [, [Validators.required]],
            city: [, [Validators.required]],
            state: [, [Validators.required]],
            phone: ['', [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
            dateOfJoining: [],
            studentDateOfBirth: [],
            bloodGroup: [],
            studentCode: [, [Validators.required]],
            divisionId: [],


            createdBy: [],
            createdOn: [],
            // schoolId: [],
            email: ['', [Validators.required, Validators.email]],
        });

        this.route.params.forEach((params: Params) => {
            this.params = params['studentId'];
            if (this.params) {
                this.studentService.getStudentById(this.params)
                    .subscribe(
                    (results: Student) => {
                        this.studentForm.setValue({
                            id: results.id,

                            studentFirstName: results.studentFirstName,
                            studentMiddleName: results.studentMiddleName,
                            studentLastName: results.studentLastName,
                            studentGender: results.studentGender,
                            fatherFirstName: results.fatherFirstName,
                            fatherLastName: results.fatherLastName,
                            fatherMobile: results.fatherMobile,
                            motherFirstName: results.motherFirstName,
                            motherLastName: results.motherLastName,
                            motherMobile: results.motherMobile,
                            guardianFirstName: results.guardianFirstName,
                            guardianLastName: results.guardianLastName,
                            guardianMobile: results.guardianMobile,
                            classId: results.classId,
                            categoryId: results.categoryId,
                            academicYear: results.academicYear,
                            city: results.city,
                            state: results.state,
                            phone: results.phone,
                            dateOfJoining: new Date(results.dateOfJoining),
                            studentDateOfBirth: new Date(results.studentDateOfBirth),
                            bloodGroup: results.bloodGroup,
                            studentCode: results.studentCode,
                            divisionId: results.divisionId,
                            email: results.email,

                            createdBy: results.createdBy,
                            createdOn: results.createdOn,
                            /*studentCode: results.studentCode,
                            schoolId: results.schoolId,
                            
                            email: results.email,
                            
                            */
                        });
                    },
                    error => {
                        this.globalErrorHandler.handleError(error);
                    });
            }
        });
    }


    onSubmit({ value, valid }: { value: Student, valid: boolean }) {
        if (this.params) {
            value.schoolId = localStorage.getItem("schoolId");
            value.studentDateOfBirth = this.convertDate(value.studentDateOfBirth);
            value.dateOfJoining = this.convertDate(value.dateOfJoining);
            // if(this.dateOfBirth != null && this.dateOfBirth != '')
            //     value.studentDateOfBirth = this.dateOfBirth;
            // if(this.dateOfJoining != null && this.dateOfJoining != '')
            //     value.dateOfJoining = this.dateOfJoining;
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

    setDateOfBirth(date){
        this.dateOfBirth = date;
    }
    setDateOfJoining(date){
        this.dateOfJoining = date;
    }
    convertDate(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();
      
        var mmChars = mm.split('');
        var ddChars = dd.split('');
        console.log(yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]));
        return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
        
      }
      
}

