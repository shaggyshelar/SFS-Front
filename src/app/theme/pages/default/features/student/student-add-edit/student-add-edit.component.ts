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
import { AcademicYearService } from '../../../_services/academic-year.service';
import { CategoriesService } from '../../../_services/categories.service';
import { TransportService } from '../../../_services/transport.service';
import { Helpers } from "../../../../../../helpers";
import { Student } from "../../../_models/student";

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
    dateOfBirth: string;
    dateOfJoining: string;
    studentName: string;
    studentCode: string;
    transportList = [];
    constructor(
        private formBuilder: FormBuilder, private studentService: StudentService, private messageService: MessageService,
        private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler, private commonService: CommonService, private _script: ScriptLoaderService,
        private classService: ClassService, private academicYearService: AcademicYearService, private categoryService: CategoriesService, private transportServics: TransportService,
    ) {
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');

    }

    ngOnInit() {

        this.studentCode = '';
        this.studentName = '';

        this.studentForm = this.formBuilder.group({
            id: [],
            studentFirstName: ['', [Validators.required]],
            studentMiddleName: ['', [Validators.required]],
            studentLastName: ['', [Validators.required]],
            studentGender: ['', [Validators.required]],
            fatherFirstName: [],
            fatherLastName: [],
            fatherMobile: [, [Validators.pattern('^[0-9]{10,15}$')]],
            motherFirstName: [],
            motherLastName: [],
            motherMobile: [, [Validators.pattern('^[0-9]{10,15}$')]],
            guardianFirstName: [],
            guardianLastName: [],
            gRNumber: [],
            guardianMobile: [, [Validators.pattern('^[0-9]{10,15}$')]],
            classId: [, [Validators.required]],
            categoryId: [, [Validators.required]],
            academicYear: [, [Validators.required]],
            city: [],
            state: [],
            zoneId: [],
            phone: ['', [Validators.pattern('^[0-9]{10,15}$')]],
            dateOfJoining: [],
            studentDateOfBirth: [],
            bloodGroup: [],
            studentCode: [, [Validators.required]],
            divisionId: [],
            createdBy: [],
            createdOn: [],
            // schoolId: [],
            //email: [null, [ Validators.pattern(emailRegex)]],
            email: [],
        });

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

            //List of Academic Year
            val = this.academicYearService.getAllAcademicYears();
            this.yearList = [];

            //this.yearList.push({ label: '--Select--', value: 'select' });
            val.subscribe((response) => {

                for (let key in response) {
                    if (response.hasOwnProperty(key)) {
                        this.yearList.push({ label: response[key].academicYear, value: response[key].academicYear });
                    }
                }

                //List of Categories
                this.categoryList = [];
                val = this.categoryService.getAllCategories();
                //this.categoryList.push({ label: '--Select--', value: 'select' });
                val.subscribe((response) => {

                    for (let key in response) {
                        if (response.hasOwnProperty(key)) {
                            this.categoryList.push({ label: response[key].categoryName, value: response[key].id });
                        }
                    }
                    
                    this.route.params.forEach((params: Params) => {
                        this.params = params['studentId'];
                        Helpers.setLoading(true);
                        if (this.params) {
                            this.studentService.getStudentById(this.params)
                                .subscribe(
                                (results: Student) => {
                                    Helpers.setLoading(false);
                                    this.studentCode = results.studentCode;
                                    this.studentName = results.studentFirstName + ' ' + results.studentLastName;

                                    let url = '?&filter[where][academicyear]=' + results.academicYear;
                                    val = this.transportServics.getAllTransports(url);
                                    val.subscribe(response => {
                                        for (let key in response) {
                                            if (response.hasOwnProperty(key)) {
                                                this.transportList.push({ label: response[key].zoneCode, value: response[key].id });
                                            }
                                        }

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
                                            zoneId: results.zoneId,
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
                                            gRNumber: results.gRNumber,
                                            /*studentCode: results.studentCode,
                                            schoolId: results.schoolId,
                                            
                                            email: results.email,
                                            
                                            */
                                        });
                                    });
                                },
                                error => {
                                    Helpers.setLoading(false);
                                    this.globalErrorHandler.handleError(error);
                                });
                        }
                    });
                    //  });


                });
            });
        });
        //List of Blood groups
        list = this.commonService.getBloodGroup();
        this.bloodGroupList = [];

        for (var index = 0; index < list.length; index++) {
            this.bloodGroupList.push({ label: list[index], value: list[index] });
        }
        let emailRegex: any = '^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$';
    }

    onAcademicYear(val: any) {
        let url = '?&filter[where][academicyear]=' + val;
        this.getAllTransports(url);
    }

    getAllTransports(url) {
        this.transportServics.getAllTransports(url)
            .subscribe(response => {
                for (let key in response) {
                    if (response.hasOwnProperty(key)) {
                        this.transportList.push({ label: response[key].zoneCode, value: response[key].id });
                    }
                }
            });
    }
    onSubmit({ value, valid }: { value: Student, valid: boolean }) {
        if (this.params) {
            value.schoolId = localStorage.getItem("schoolId");
            value.studentDateOfBirth = this.convertDate(value.studentDateOfBirth);
            value.dateOfJoining = this.convertDate(value.dateOfJoining);
            this.studentService.updateStudent(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/student/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }

    onCancel() {
        this.router.navigate(['/features/student/list']);
    }

    setDateOfBirth(date) {
        this.dateOfBirth = date;
    }

    setDateOfJoining(date) {
        this.dateOfJoining = date;
    }

    convertDate(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();
        var mmChars = mm.split('');
        var ddChars = dd.split('');
        console.log(yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]));
        return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
    }
}

