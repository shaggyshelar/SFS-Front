import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { StudentService } from '../../../_services/student.service';
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

  constructor(
      private formBuilder: FormBuilder, private studentService: StudentService, private messageService: MessageService,
      private route: ActivatedRoute, private router: Router, private globalErrorHandler: GlobalErrorHandler
  ) {
  }

  ngOnInit() {

      this.studentForm = this.formBuilder.group({
          id: [],
          StudentId: [],
          StudentCode: [],
          SchoolId: [],
          CategoryId: [],
          FeePlanId: [],
          StandardId:[],
          DivisionId:[],
          ZoneFrequencyId:[],
          FirstName:  ['', [Validators.required]],
          MiddleName:['', [Validators.required]],
          LastName: ['', [Validators.required]],
          Email: ['', [Validators.required]],
          Phone: ['', [Validators.required]],
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
                        StudentId:results.StudentId,
                        StudentCode: results.StudentCode,
                        SchoolId: results.SchoolId,
                        CategoryId:results.CategoryId,
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
                        AdmissionDate:results.AdmissionDate,
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
      }else {
          
      }
  }
  onCancel() {
    this.router.navigate(['/features/student/list']);
  }
}

